import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export async function POST(req) {
    await mongooseConnect();

    try {
        const { title, description, price } = await req.json();
        
        // Create a new product
        const productDoc = await Product.create({ title, description, price });
        
        // Respond with the created product
        return new Response(JSON.stringify(productDoc), { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return new Response(JSON.stringify({ error: 'Failed to create product' }), { status: 500 });
    }
}

export async function GET(req) {
    await mongooseConnect();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch a single product by its ID
            const product = await Product.findById(id);
            if (!product) {
                return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
            }
            return new Response(JSON.stringify(product), { status: 200 });
        } else {
            // Fetch all products
            const products = await Product.find();
            return new Response(JSON.stringify(products), { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
    }
}
