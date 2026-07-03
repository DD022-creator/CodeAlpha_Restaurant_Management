const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem').populate('tableId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place order
router.post('/', async (req, res) => {
  try {
    const { tableId, items } = req.body;
    
    // Check table exists
    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    if (!table.isAvailable) return res.status(400).json({ error: 'Table not available' });
    
    // Check items and calculate total
    let total = 0;
    const orderItems = [];
    
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) return res.status(404).json({ error: `Item not found: ${item.menuItem}` });
      if (!menuItem.isAvailable) return res.status(400).json({ error: `${menuItem.name} is not available` });
      if (menuItem.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${menuItem.name}` });
      
      // Update stock
      menuItem.stock -= item.quantity;
      await menuItem.save();
      
      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
      total += menuItem.price * item.quantity;
    }
    
    // Create order
    const order = new Order({
      tableId,
      items: orderItems,
      totalAmount: total
    });
    await order.save();
    
    // Mark table as occupied
    table.isAvailable = false;
    await table.save();
    
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    order.status = status;
    await order.save();
    
    // If order is paid, free the table
    if (status === 'paid') {
      await Table.findByIdAndUpdate(order.tableId, { isAvailable: true });
    }
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Free the table
    await Table.findByIdAndUpdate(order.tableId, { isAvailable: true });
    await order.deleteOne();
    
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;