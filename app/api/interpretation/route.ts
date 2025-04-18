import client from "@/lib/appwrite_client";
import { Databases, Query, ID } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create Interpretations
async function createInterpretation(data: { term: string; interpretation: string }) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating interpretation:", error);
        throw new Error("Failed to create interpretation");
    }
}

// Fetch Interpretations
async function fetchInterpretation() {
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            [Query.orderDesc("$createdAt")]
        );
        return response.documents || [];
    } catch (error) {
        console.error("Error fetching interpretations:", error);
        throw new Error("Failed to fetch interpretations");
    }
}

// POST Interpretations
export async function POST(request: Request) {
    try {
        const { term, interpretation } = await request.json();

        // Validate payload
        if (!term || !interpretation) {
            return NextResponse.json(
                { message: "Both 'term' and 'interpretation' are required." },
                { status: 400 }
            );
        }

        const data = { term, interpretation };
        const response = await createInterpretation(data);

        return NextResponse.json({
            message: "Interpretation created successfully",
            data: response,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to create interpretation",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}

// GET Interpretations
export async function GET(request: Request) {
    try {
        const interpretations = await fetchInterpretation();
        return NextResponse.json(interpretations);
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to fetch interpretations",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
