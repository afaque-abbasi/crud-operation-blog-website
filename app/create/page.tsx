"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
    const [formData, setFormData] = useState({term: '', interpretation: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();

   const handleInputChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    e.preventDefault();
    setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
    }))
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!formData.term || !formData.interpretation){
        setError('Please fill in all the fields');
        return;
   }
    setError(null);
    setIsLoading(true);
    try {
        const response = await fetch('/api/interpretation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Failed to create interpretation');
        }
        router.push('/');
    } catch (error) {
        console.log(error);
        setError("Something went wrong. Please try again.");
    }
    finally {
        setIsLoading(false);
    }
   };
    return (
        <>
          <div>
            <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                type="text" 
                name="term" 
                placeholder="Term" 
                value={formData.term} 
                className="border border-gray-300 rounded-md px-4 py-1 mb-4 w-full" 
                onChange={handleInputChange}
                />
                <textarea
                 name="interpretation" 
                 placeholder="Interpretation"  
                 value={formData.interpretation}
                 rows={4} 
                 className="border border-gray-300 rounded-md px-4 py-1 mb-4 w-full resize-none"
                 onChange={handleInputChange}
                 >
                 </textarea>
                <button className="bg-black text-white px-4 py-2 mt-5      cursor-pointer font-semibold rounded-md" 
                disabled={isLoading} 
                type="submit"
                >
                    {isLoading ? "Loading..." : "Add Interpretation"}
                </button>
            </form>
            {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
          </div>
        </>
    );
}