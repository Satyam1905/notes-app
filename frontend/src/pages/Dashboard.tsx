import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Trash2 } from 'lucide-react';

interface User {
  name: string;
  email: string;
}

interface Note {
  _id: string;
  content: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
      } catch (error) {
        toast.error('Could not fetch user data');
      }
    };

    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes');
        setNotes(data);
      } catch (error) {
        toast.error('Could not fetch notes');
      }
    };

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([fetchUserData(), fetchNotes()]);
        setLoading(false);
    }
    fetchAll();

  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const { data } = await api.post('/notes', { content: newNote });
      setNotes([data, ...notes]);
      setNewNote('');
      toast.success('Note created!');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note._id !== id));
            toast.success('Note deleted!');
        } catch (error) {
            toast.error('Failed to delete note');
        }
    }
  };

  if (loading) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h2>
        <p className="text-gray-500 mt-1">Email: {user?.email}</p>
      </div>

      <form onSubmit={handleCreateNote} className="mb-8">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
        />
        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create Note
        </button>
      </form>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Notes</h3>
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <p className="text-gray-700">{note.content}</p>
                <button onClick={() => handleDeleteNote(note._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have no notes yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;