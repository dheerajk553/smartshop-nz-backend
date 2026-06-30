const ShoppingListItem = require('../models/ShoppingListItem');
const Branch = require('../models/Branch');
const PriceRepository = require('../repositories/PriceRepository');

const STORES = ['paknsave', 'newworld', 'woolworths'];

// GET /v1/optimise/:listId?branches=paknsave:<branchId>,newworld:<branchId>
// Rule-based store recommendation engine (NOT machine learning / AI —
// confirmed naming with supervisor). For every item on a shopping list,
// looks up the latest price at each store (using a branch-specific price
// when the user has selected a branch for that store, otherwise the
// chain-level average), sums the totals per store, and recommends the
// cheapest store along with the amount saved versus the most expensive.
exports.optimiseList = async (req, res) => {
  try {
    const list = await ShoppingListItem.findOne({
      _id: req.params.listId,
      userId: req.user.id
    }).populate('items.productId');

    if (!list) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    if (!list.items || list.items.length === 0) {
      return res.status(400).json({ error: 'Shopping list is empty' });
    }

    // Parse optional ?branches=store:branchId,store:branchId query param
    const branchIdsByStore = parseBranchQuery(req.query.branches);

    // Running totals per store, plus a per-item breakdown so the
    // frontend can show "Not available" for items missing at a store.
    const totals = { paknsave: 0, newworld: 0, woolworths: 0 };
    const itemsAvailable = { paknsave: 0, newworld: 0, woolworths: 0 };
    const breakdown = [];

    for (const item of list.items) {
      if (!item.productId) {
        // Item has no linked product (e.g. free-text item) — cannot be priced.
        breakdown.push({
          itemName: item.name,
          quantity: item.quantity || 1,
          prices: { paknsave: null, newworld: null, woolworths: null }
        });
        continue;
      }

      const pricesByStore = await PriceRepository.getLatestByStoreForBranch(
        item.productId._id,
        branchIdsByStore
      );

      const itemPrices = {};
      for (const store of STORES) {
        const entry = pricesByStore[store];
        if (entry) {
          const lineTotal = entry.price * (item.quantity || 1);
          totals[store] += lineTotal;
          itemsAvailable[store] += 1;
          itemPrices[store] = {
            unitPrice: entry.price,
            lineTotal: Number(lineTotal.toFixed(2)),
            branchSpecific: entry.branchSpecific
          };
        } else {
          itemPrices[store] = null; // "Not available" at this store
        }
      }

      breakdown.push({
        itemName: item.productId.name || item.name,
        quantity: item.quantity || 1,
        prices: itemPrices
      });
    }

    // A store only qualifies for recommendation if it has a price for at
    // least one item — a store with zero matches is excluded rather than
    // being recommended as "cheapest" by default at $0.
    const eligibleStores = STORES.filter((store) => itemsAvailable[store] > 0);

    if (eligibleStores.length === 0) {
      return res.status(200).json({
        listId: list._id,
        listName: list.name,
        items: breakdown,
        totals,
        itemsAvailable,
        cheapestStore: null,
        savings: null,
        disclaimer: 'No pricing data is available for any item on this list yet.'
      });
    }

    const sorted = [...eligibleStores].sort((a, b) => totals[a] - totals[b]);
    const cheapestStore = sorted[0];
    const mostExpensiveStore = sorted[sorted.length - 1];
    const savings = Number(
      (totals[mostExpensiveStore] - totals[cheapestStore]).toFixed(2)
    );

    // Disclaimer when any store's total is based on a chain-level average
    // rather than a confirmed branch price (per A2 Section 4.3 limitation).
    const anyBranchSpecific = breakdown.some((item) =>
      STORES.some((store) => item.prices[store]?.branchSpecific)
    );
    const allRecommendedItemsBranchSpecific = breakdown
      .filter((item) => item.prices[cheapestStore])
      .every((item) => item.prices[cheapestStore].branchSpecific);

    const disclaimer = allRecommendedItemsBranchSpecific
      ? null
      : 'Price may vary by store — some prices shown are chain averages, not the exact price at your nearest branch.';

    res.json({
      listId: list._id,
      listName: list.name,
      items: breakdown,
      totals: roundTotals(totals),
      itemsAvailable,
      itemCount: list.items.length,
      cheapestStore,
      mostExpensiveStore,
      savings,
      disclaimer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /v1/optimise/branches?store=paknsave
exports.getBranches = async (req, res) => {
  try {
    const filter = {};
    if (req.query.store) {
      filter.store = String(req.query.store).toLowerCase();
    }
    const branches = await Branch.find(filter).sort({ store: 1, name: 1 });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function roundTotals(totals) {
  const rounded = {};
  for (const store of Object.keys(totals)) {
    rounded[store] = Number(totals[store].toFixed(2));
  }
  return rounded;
}

// "paknsave:64ab...,newworld:64cd..." -> { paknsave: '64ab...', newworld: '64cd...' }
function parseBranchQuery(raw) {
  if (!raw) return {};
  const result = {};
  for (const pair of String(raw).split(',')) {
    const [store, branchId] = pair.split(':');
    if (store && branchId) {
      result[store.trim().toLowerCase()] = branchId.trim();
    }
  }
  return result;
}