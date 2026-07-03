const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, enum: ['appetizer', 'main', 'dessert', 'beverage'] },
  isAvailable: { type: Boolean, default: true },
  stock: { type: Number, default: 10 }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);