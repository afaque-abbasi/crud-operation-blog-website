import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function fetchInterpretation(id: string) {
    try {
        const interpretation = await database.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            id, // Use dynamic ID
        );
        return interpretation;
    } catch (error) {
        console.error("Error fetching interpretation:", error);
        throw new Error("Failed to fetch interpretation");
    }
}

async function deleteInterpretation(id: string) {
    try {
        const interpretation = await database.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            id, // Use dynamic ID
        );
        return interpretation;
    } catch (error) {
        console.error("Error deleting interpretation:", error);
        throw new Error("Failed to delete interpretation");
    }
}

async function updateInterpretation(
    id: string,
    data: { term: string; interpretation: string },
) {
    try {
        const interpretation = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            id, // Use dynamic ID
            data,
        );
        return interpretation;
    } catch (error) {
        console.error("Error updating interpretation:", error);
        throw new Error("Failed to update interpretation");
    }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const id = params.id;
        const interpretation = await fetchInterpretation(id);
        return NextResponse.json(interpretation);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch interpretation" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const id = params.id;
        await deleteInterpretation(id);
        return NextResponse.json({
            message: "Interpretation deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete interpretation" },
            { status: 500 },
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const id = params.id;
        const data = await req.json();
        await updateInterpretation(id, data);
        return NextResponse.json({
            message: "Interpretation updated successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update interpretation" },
            { status: 500 },
        );
    }
}
 