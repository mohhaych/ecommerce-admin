"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProductForm({ 
    title: existingTitle = '', 
    description: existingDescription = '', 
    price: existingPrice = '', 
    _id: productId = '',  // Add productId as a prop
    images: existingImages,
}) {
    const [title, setTitle] = useState(existingTitle); // Initialize state with props
    const [description, setDescription] = useState(existingDescription);
    const [price, setPrice] = useState(existingPrice);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState([existingImages || []]);

    const router = useRouter();

    async function handleSubmit(ev) {
        ev.preventDefault();
        const data = { title, description, price: parseFloat(price) };

        try {
            if (productId) {
                // Editing an existing product
                await axios.put(`/api/products?id=${productId}`, data); // Ensure the ID is included in the URL
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

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
        }
    }

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
            <label>
                Photos
            </label>
            <div className='mb-2 flex flex-wrap gap-2'>
                {!!images?.length && images.map(link => (
                    <div key={link} className='h-24'>
                        <img src={link} alt='' className='rounded-lg'/>
                    </div>
                ))}
                <label className='w-24 h-24 cursor-pointer text-center 
                flex items-center justify-center text-sm gap-1
                text-gray-500 rounded-lg bg-gray-200'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type='file' onChange={uploadImages} className='hidden'/>
                </label>
                {!images?.length && (
                    <div>No photos in this product</div>
                )}
            </div>
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
                {productId ? 'Update' : 'Save'}
            </button> 
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </form>
    );
}
