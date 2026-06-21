const ShoppingListItem = require('../models/ShoppingListItem');

// GET all lists for user
exports.getLists = async (req, res) => {
  try {
    const lists = await ShoppingListItem.find({ userId: req.user.id });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new list
exports.createList = async (req, res) => {
  try {
    const list = await ShoppingListItem.create({
      userId: req.user.id,
      name: req.body.name || 'My Shopping List'
    });
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST add item to list
exports.addItem = async (req, res) => {
  try {
    const list = await ShoppingListItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $push: { items: req.body } },
      { new: true }
    );
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH toggle item checked
exports.toggleItem = async (req, res) => {
  try {
    const list = await ShoppingListItem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!list) return res.status(404).json({ error: 'List not found' });
    const item = list.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.checked = !item.checked;
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE item from list
exports.deleteItem = async (req, res) => {
  try {
    const list = await ShoppingListItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true }
    );
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE entire list
exports.deleteList = async (req, res) => {
  try {
    await ShoppingListItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};