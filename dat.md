"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface IInterpretations {
    $id: string;
    term: string;
    interpretation: string;
}

export default function Home() {
    const [interpretations, setInterpretations] = useState<IInterpretations[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInterpretations = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/interpretation");
                if (!response.ok) {
                    throw new Error("Failed to fetch interpretations");
                }
                const data = await response.json();
                setInterpretations(data);
            } catch (error) {
                console.error("Error:", error);
                setError("Failed to fetch interpretations. Please try to reload the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchInterpretations();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/interpretation/${id}`, {
                method: "DELETE",
            });
            setInterpretations((prevInterpretations) =>
                prevInterpretations?.filter((i) => i.$id !== id)
            );
        } catch (error) {
            setError("Failed to delete interpretation. Please try again.");
        }
    };

    const handleEdit = async (id: string, updatedData: Partial<IInterpretations>) => {
        try {
            const response = await fetch(`/api/interpretation/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update interpretation");
            }

            const updatedItem = await response.json();
            setInterpretations((prev) =>
                prev?.map((item) => (item.$id === id ? updatedItem : item))
            );
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to edit interpretation. Please try again.");
        }
    };

    return (
        <div>
            {error && <p className="text-red-500 py-4">{error}</p>}

            {loading ? (
                <p>Loading Interpretations...</p>
            ) : (
                <div>
                    {interpretations?.length ? (
                        interpretations.map((interpretation) => (
                            <div key={interpretation.$id} className="p-4 my-2 rounded-md leading-9 shadow-sm border-b">
                                <div className="text-xl font-bold">{interpretation.term}</div>
                                <div>{interpretation.interpretation}</div>
                                <div className="flex justify-end gap-4 mt-4 text-sm">
                                    <Link onClick={	() => handleEdit(interpretation.$id, { interpretation: "Updated Interpretation" })}
                                        href={`/edit/${interpretation.$id}`}
                                        className="bg-slate-200 px-4 py-2 rounded-md uppercase font-bold"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(interpretation.$id)}
                                        className="px-4 py-2 rounded-md uppercase font-bold bg-red-500 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No interpretations found</p>
                    )}
                </div>
            )}
        </div>
    );
}
