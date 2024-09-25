import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

// Handle GET request to fetch all categories
export async function GET() {
    await mongooseConnect();

    try {
        // Fetch all categories from the database
        const categories = await Category.find();

        // Return the categories in JSON format
        return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch categories" }),
            { status: 500 }
        );
    }
}

// Handle POST request to create a new category
export async function POST(req) {
    await mongooseConnect();

    try {
        const { name } = await req.json(); // Parse the JSON body

        if (!name) {
            return new Response(
                JSON.stringify({ error: "Category name is required" }),
                { status: 400 }
            );
        }

        // Create a new category
        const categoryDoc = await Category.create({ name });

        return new Response(JSON.stringify(categoryDoc), { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create category" }),
            { status: 500 }
        );
    }
}
