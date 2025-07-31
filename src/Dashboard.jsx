import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

// Add animated gradient background via custom CSS
const animatedBgStyle = {
  background: 'linear-gradient(-45deg, #a5b4fc, #f0abfc, #7dd3fc, #f9fafb)',
  backgroundSize: '400% 400%',
  animation: 'gradientBG 15s ease infinite',
};

function EditPollModal({ poll, onClose, onSave, loading }) {
  const [question, setQuestion] = useState(poll.question);
  const [options, setOptions] = useState(poll.options.map(o => o.text));

  const handleOptionChange = (idx, value) => {
    setOptions(opts => opts.map((o, i) => (i === idx ? value : o)));
  };
  const handleAddOption = () => setOptions([...options, '']);
  const handleRemoveOption = idx => setOptions(opts => opts.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && options.filter(o => o.trim()).length >= 2) {
      onSave({ question, options: options.filter(o => o.trim()) });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Poll</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input type="text" value={opt} onChange={e => handleOptionChange(idx, e.target.value)} className="flex-1 border rounded-lg px-3 py-2" required />
                {options.length > 2 && (
                  <button type="button" onClick={() => handleRemoveOption(idx)} className="text-red-500 hover:text-red-700 text-lg font-bold">&times;</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddOption} className="text-indigo-600 hover:underline text-sm mt-1">+ Add Option</button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editPoll, setEditPoll] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/polls/${pollId}/delete`, {
        data: { userId: user.id },
      });
      setPolls((prev) => prev.filter((p) => p._id !== pollId));
    } catch (err) {
      alert('Failed to delete poll.');
    }
  };

  const handleEditSave = async (data) => {
    setEditLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/polls/${editPoll._id}/edit`, {
        userId: user.id,
        question: data.question,
        options: data.options,
      });
      setPolls((prev) => prev.map(p => p._id === editPoll._id ? res.data.poll : p));
      setEditPoll(null);
    } catch (err) {
      alert('Failed to edit poll.');
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/polls/all');
        setPolls(response.data.polls);
        console.log("Fetched polls:", response.data.polls);  // 🔍 DEBUG LOG
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={animatedBgStyle}>
      {/* Responsive Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-md shadow px-4 sm:px-8 py-4 mb-10 gap-4 sm:gap-0 rounded-b-2xl border-b border-indigo-100">
        <div className="text-2xl font-bold text-indigo-700 w-full sm:w-auto text-center sm:text-left drop-shadow-lg">Tallyfy</div>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto justify-center sm:justify-end">
          {user && (
            <span className="text-gray-700 font-medium text-base sm:text-lg">Welcome, {user.username}!</span>
          )}
          <Link
            to="/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition w-full sm:w-auto text-center shadow-md hover:scale-105 duration-200"
          >
            Create Poll
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition w-full sm:w-auto text-center shadow-md hover:scale-105 duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
      {/* Tagline Section */}
      <div className="max-w-3xl mx-auto mb-8 mt-2 px-4">
        <div className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold italic bg-gradient-to-r from-indigo-500 via-sky-400 to-pink-400 bg-clip-text text-transparent drop-shadow-md animate-pulse">
          People-friendly poll maker
        </div>
        <div className="text-center mt-3 text-base sm:text-lg md:text-xl font-medium text-gray-700">
          You need data. Online polls make data. But polls need people.<br/>
          <span className="text-indigo-600 font-semibold">87% get more responses (from people) after switching to <span className="font-bold">Tallyfy</span>.</span>
        </div>
      </div>
      <div className="flex-1 max-w-5xl mx-auto px-2 sm:px-6 py-6 sm:py-12 w-full bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-indigo-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-6 sm:mb-10 drop-shadow-lg">All Polls</h1>
        {polls.length === 0 ? (
          <p className="text-center text-gray-600 text-base sm:text-lg">No polls available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {polls.map((poll) => (
              <div key={poll._id} className="relative">
                <Link
                  to={`/poll/${poll._id}`}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 border border-indigo-100 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-indigo-50/80 group"
                >
                  <h2 className="text-base sm:text-lg font-semibold text-indigo-600 group-hover:text-pink-500 transition-colors duration-200">{poll.question}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">Click to view and vote</p>
                </Link>
                {user && user.isAdmin && (
                  <div className="flex gap-2 mt-2 justify-center">
                    <button
                      onClick={() => setEditPoll(poll)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg text-xs font-semibold shadow transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(poll._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 w-full mt-0">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-2 text-center">
          <div className="text-xl font-bold text-indigo-700">Tallyfy</div>
          <div className="text-gray-500 text-sm">Empowering Decisions, One Vote at a Time</div>
          <div className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} Tallyfy. All rights reserved.</div>
        </div>
      </footer>
      {editPoll && (
        <EditPollModal
          poll={editPoll}
          onClose={() => setEditPoll(null)}
          onSave={handleEditSave}
          loading={editLoading}
        />
      )}
    </div>
  );
};

export default Dashboard;

/* Add this to your global CSS (e.g., index.css) for the animated gradient */
/*
@keyframes gradientBG {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}
*/
