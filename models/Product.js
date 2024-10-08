// models/Product.js

import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: {type: mongoose.Types.ObjectId, ref: 'Category'},
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
