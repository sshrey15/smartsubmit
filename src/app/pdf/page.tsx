"use client"
import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setMessage(data.docs.info);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <button onClick={() => setDrawerOpen(!drawerOpen)} className="mb-4 px-4 py-2 bg-blue-800 text-white rounded-sm">
        Toggle Drawer
      </button>
      {drawerOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul>
            <li className="mb-2">Upload</li>
            <li className="mb-2">Ask PDF</li>
            <li className="mb-2">More</li>
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-6 rounded shadow-md">
        <input type="file" name="file" required className="border p-2 rounded mb-4" />
        <button type="submit" className="px-4 py-2 bg-blue-800 text-white rounded-sm">
          upload
        </button>
      </form>
      {message && <div className="mt-6 ml-20 p-4 w-3/4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded shadow-md">{message}</div>}
    </main>
  );
}