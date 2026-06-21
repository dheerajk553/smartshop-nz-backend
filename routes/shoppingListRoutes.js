const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/shoppingListController');

router.get('/',                           auth, c.getLists);
router.post('/',                          auth, c.createList);
router.post('/:id/items',                 auth, c.addItem);
router.patch('/:id/items/:itemId/toggle', auth, c.toggleItem);
router.delete('/:id/items/:itemId',       auth, c.deleteItem);
router.delete('/:id',                     auth, c.deleteList);

module.exports = router;