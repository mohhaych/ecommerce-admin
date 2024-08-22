// app/products/new/page.js
"use client";

import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm"; // Adjust the import path as needed

export default function NewProductPage() {
    return (
        <Layout>
            <ProductForm />
        </Layout>
    );
}
