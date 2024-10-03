import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

// Handle GET request to fetch all categories
export async function GET() {
    await mongooseConnect();

    try {
        // Fetch all categories from the database
        const categories = await Category.find().populate('parent');
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
        const { name, parentCategory } = await req.json(); // Parse the JSON body

        if (!name) {
            return new Response(
                JSON.stringify({ error: "Category name is required" }),
                { status: 400 }
            );
        }

        // Create a new category
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || null, // If no parentCategory, set to null
        });

        return new Response(JSON.stringify(categoryDoc), { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create category" }),
            { status: 500 }
        );
    }
}

// Handle PUT request to update an existing category
export async function PUT(req) {
    await mongooseConnect();

    try {
        const { _id, name, parentCategory } = await req.json(); // Parse the JSON body

        if (!_id) {
            return new Response(
                JSON.stringify({ error: "Category ID is required" }),
                { status: 400 }
            );
        }

        if (!name) {
            return new Response(
                JSON.stringify({ error: "Category name is required" }),
                { status: 400 }
            );
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            _id,
            { name, parent: parentCategory || null }, // Update name and parentCategory
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return new Response(
                JSON.stringify({ error: "Category not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(updatedCategory), { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update category" }),
            { status: 500 }
        );
    }
}

// Handle DELETE request to delete a category by _id
export async function DELETE(req) {
    await mongooseConnect();

    try {
        const url = new URL(req.url);
        const _id = url.searchParams.get('_id');

        if (!_id) {
            return new Response(
                JSON.stringify({ error: "Category ID is required" }),
                { status: 400 }
            );
        }

        // Find and delete the category
        const deletedCategory = await Category.findByIdAndDelete(_id);

        if (!deletedCategory) {
            return new Response(
                JSON.stringify({ error: "Category not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify({ success: "Category deleted" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        return new Response(
            JSON.stringify({ error: "Failed to delete category" }),
            { status: 500 }
        );
    }
}
