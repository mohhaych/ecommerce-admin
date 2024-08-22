"use client";

import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter, useParams } from "next/navigation"; // Use useParams for dynamic route parameters
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get dynamic route parameter `id`
    const router = useRouter();

    useEffect(() => {
        if (!id) {
            setError('No product ID found in parameters.');
            setLoading(false);
            return;
        }

        console.log(`Fetching product with ID: ${id}`);
        axios.get(`/api/products?id=${id}`)
            .then(response => {
                setProductInfo(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setError('Failed to fetch product.');
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        try {
            await axios.delete(`/api/products?id=${id}`);
            router.push('/products');
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product.');
        }
    };

    const goBack = () => {
        router.push('/products');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    async function deleteProduct() {
        await axios.delete(`/api/products?id=${id}`);
        goBack();
    }

    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete 
                &nbsp;"{productInfo?.title}"?
            </h1>
            <div className="flex gap-2 justify-center">
                <button 
                    onClick={deleteProduct}
                    className="btn-red">Yes</button>
                <button 
                    className="btn-default" 
                    onClick={goBack}>
                    No
                </button>
            </div>
        </Layout>
    );
}
