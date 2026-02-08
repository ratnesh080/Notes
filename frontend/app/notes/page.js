"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaMagic } from 'react-icons/fa';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [search, setSearch] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(null); // Tracks which note is loading

  // Uses your dynamic environment variable
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const fetchNotes = async () => {
    try {
      // Added search query support back in
      const { data } = await axios.get(`${API_BASE}/notes?q=${search}`);
      setNotes(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSummarize = async (id) => {
    setIsSummarizing(id); // Start loading state
    try {
      // Changed from localhost to your dynamic API_BASE
      const { data } = await axios.put(`${API_BASE}/notes/${id}/summarize`);
      
      setNotes(notes.map(n => n._id === id ? data : n));
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI Summarization failed. Make sure your OpenAI key is set on Render.");
    } finally {
      setIsSummarizing(null); // Stop loading state
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = form.tags.split(',').map(tag => tag.trim());
    await axios.post(`${API_BASE}/notes`, { ...form, tags: tagsArray });
    setForm({ title: '', content: '', tags: '' });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/notes/${id}`);
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

      {/* Form with requested bg-neutral-600 */}
      <form onSubmit={handleSubmit} className="bg-neutral-600 p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Add New Note</h2>
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
        {/* Button with requested bg-blue-600 */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Note
        </button>
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
            <h3 className="text-gray-900 font-bold text-lg">{note.title}</h3>
            
            {/* AI Summary Section */}
            {note.summary && (
              <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-800 border border-purple-100">
                <strong>AI Summary:</strong> {note.summary}
              </div>
            )}
            
            <p className="text-gray-600 mt-2">{note.content}</p>
            
            <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {note.tags && note.tags.filter(tag => tag.trim() !== "").map((tag, index) => (
    <span key={index} className="text-xs bg-gray-400 text-white px-2 py-1 rounded">
      {tag}
    </span>
  ))}
              </div>

              {/* AI Summarize Button */}
              <button 
                onClick={() => handleSummarize(note._id)}
                disabled={isSummarizing === note._id}
                className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition ${
                  isSummarizing === note._id 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isSummarizing === note._id ? (
                  <>Thinking...</>
                ) : (
                  <>✨ Summarize</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}