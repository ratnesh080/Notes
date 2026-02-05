"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [search, setSearch] = useState('');

  // Fetch Notes
  const fetchNotes = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notes`);
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, [search]); // Re-run when search changes

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = form.tags.split(',').map(tag => tag.trim());
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notes`, { ...form, tags: tagsArray });
    setForm({ title: '', content: '', tags: '' });
    fetchNotes();
  };

  // Handle Delete
  const handleDelete = async (id) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      
      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full p-2 mb-6 border rounded shadow-sm"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-neutral-600 p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          required
        />
        <textarea
          className="w-full mb-3 p-2 border rounded"
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({...form, content: e.target.value})}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={e => setForm({...form, tags: e.target.value})}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ">Save Note</button>
      </form>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2">
        {notes.map(note => (
          <div key={note._id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 relative">
            <button 
              onClick={() => handleDelete(note._id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            <h3 className=" text-gray-900 font-bold text-lg">{note.title}</h3>
            <p className="text-gray-600 mt-2">{note.content}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-400 px-2 py-1 rounded">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}