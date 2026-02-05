"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({ url: '', title: '', description: '', tags: '' });
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`);
    setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tagsArray = form.tags.split(',').map(tag => tag.trim());
    
    // Title will be auto-fetched by backend if left empty
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, { ...form, tags: tagsArray });
    
    setForm({ url: '', title: '', description: '', tags: '' });
    setLoading(false);
    fetchBookmarks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${id}`);
    fetchBookmarks();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bookmarks</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-neutral-600 p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Bookmark</h2>
        <div className="grid gap-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="URL (https://...)"
            value={form.url}
            onChange={e => setForm({...form, url: e.target.value})}
            required
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Title (Leave empty to auto-fetch)"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
          />
           <input
            className="w-full p-2 border rounded"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />
           <input
            className="w-full p-2 border rounded"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={e => setForm({...form, tags: e.target.value})}
          />
        </div>
        <button 
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving & Fetching Title...' : 'Save Bookmark'}
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        {bookmarks.map(bm => (
          <div key={bm._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
            <div>
              <a href={bm.url} target="_blank" className="font-bold text-lg text-blue-600 hover:underline flex items-center gap-2">
                {bm.title} <FaExternalLinkAlt size={12}/>
              </a>
              <p className="text-gray-600 text-sm">{bm.url}</p>
              <p className="mt-2 text-gray-400">{bm.description}</p>
              <div className="mt-2 flex gap-2">
                {bm.tags.map(tag => (
                   <span key={tag} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={() => handleDelete(bm._id)} className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}