export default function EditPage() {
    return (
        <>
           <div>
            <h2 className="text-2xl font-bold my-8">Edit Interpretation</h2>
            <form className="flex flex-col gap-3">
                <input type="text" name="term" placeholder="Term" className="border border-gray-300 rounded-md px-4 py-1 mb-4 w-full" />
                <textarea name="interpretation" placeholder="Interpretation" rows={4} className="border border-gray-300 rounded-md px-4 py-1 mb-4 w-full resize-none"></textarea>
                <button className="bg-black text-white px-4 py-2 mt-5 cursor-pointer font-semibold rounded-md">Update Interpretation</button>
            </form>
          </div>
        </>
    );
}