// app/products/edit/[id]/page.js
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";

export default function EditProductPage({ params }) {
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
        }).catch(error => {
            console.error('Error fetching product:', error);
        });
    }, [id]);

    return (
        <Layout>
            <h1>Edit Product</h1>
            {productInfo && (
                <ProductForm 
                    title={productInfo.title} 
                    description={productInfo.description} 
                    price={productInfo.price} 
                />
            )}
        </Layout>
    );
}
