"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';

export default function ProductForm({ 
    title: existingTitle = '', 
    description: existingDescription = '', 
    price: existingPrice = '', 
    categoryId: existingCategoryId = '', // Add existing category ID prop
    _id: productId = '',
    images: existingImages = [],
}) {
    const [title, setTitle] = useState(existingTitle);
    const [description, setDescription] = useState(existingDescription);
    const [price, setPrice] = useState(existingPrice);
    const [category, setCategory] = useState(existingCategoryId); // New state for selected category
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState(existingImages);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch categories from API
        axios.get('/api/categories')
            .then(result => {
                console.log("Categories response:", result); // Log the response
                if (Array.isArray(result.data)) {
                    setCategories(result.data);
                } else {
                    setCategories([]); // Ensure categories is an array
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setCategories([]);  // Handle the error by resetting categories to an empty array
            });
    }, []);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const data = { title, description, price: parseFloat(price), images, category }; // Include selected category
        
        try {
            if (productId) {
                // Update the existing product
                await axios.put(`/api/products?id=${productId}`, data);
                setSuccess('Product updated successfully!');
            } else {
                // Create a new product
                await axios.post('/api/products', data);
                setSuccess('Product created successfully!');
            }
            setError('');
            setGoToProducts(true);
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
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => [...oldImages.flat(), ...res.data.links]);
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
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
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}> {/* Bind selected category */}
                <option value="">Uncategorised</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            <label>Photos</label>
            <div className='mb-2 flex flex-wrap gap-1'>
                <ReactSortable 
                    list={images} 
                    className='flex flex-wrap gap-1'
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className='h-24'>
                            <img src={link} alt='' className='rounded-lg'/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className='h-24 p-1 flex items-center'>
                        <Spinner />
                    </div>
                )}
                <label className='w-24 h-24 cursor-pointer text-center 
                flex items-center justify-center text-sm gap-1
                text-gray-500 rounded-lg bg-gray-200'>
                    <input type='file' onChange={uploadImages} className='hidden' />
                    <div>
                        Upload
                    </div>
                </label>
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
            <button type="submit" className="btn-primary">
                {productId ? 'Update' : 'Save'}
            </button> 
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </form>
    );
}
