// components/ProductForm.js
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // or 'next/router' if you're using an older version of Next.js
import Layout from '@/components/Layout'; // Adjust the import path based on where your Layout component is located

export default function ProductForm({ 
    title: existingTitle = '', 
    description: existingDescription = '', 
    price: existingPrice = '' 
}) {
    const [title, setTitle] = useState(existingTitle); // Initialize state with props
    const [description, setDescription] = useState(existingDescription);
    const [price, setPrice] = useState(existingPrice);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);

    const router = useRouter();

    async function handleSubmit(ev) {
        ev.preventDefault();
        const data = { title, description, price: parseFloat(price) };

        try {
            if (existingTitle) {
                // Editing an existing product
                await axios.put('/api/products', data); // Adjust the endpoint if needed
                setSuccess('Product updated successfully!');
            } else {
                // Creating a new product
                await axios.post('/api/products', data);
                setSuccess('Product created successfully!');
            }
            setError('');
            setGoToProducts(true);  // Set to true to trigger redirection
            // Optionally reset the form fields
            setTitle('');
            setDescription('');
            setPrice('');
        } catch (err) {
            console.error('Error processing product:', err);
            setError('Failed to process product.');
            setSuccess('');
        }
    }

    useEffect(() => {
        if (goToProducts) {
            router.push('/products');  // Redirect to products page
        }
    }, [goToProducts, router]);

    return (
        <form onSubmit={handleSubmit}>
            <label>Product name</label>
            <input 
                type="text" 
                placeholder="Product name" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)}
                required
            />
            <label>Description</label>
            <textarea 
                placeholder="Description" 
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                required
            />
            <label>Price (in USD)</label>
            <input 
                type="number" 
                placeholder="Price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
                required
            />
            <button 
                type="submit" 
                className="btn-primary">
                {existingTitle ? 'Update' : 'Save'}
            </button> 
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </form>
    );
}
