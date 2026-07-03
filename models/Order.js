const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'paid'],
    default: 'pending'
  },
  orderTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);