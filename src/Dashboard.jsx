import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-indigo-100 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${10 + Math.random() * 20}s`,
        }}
      />
    ))}
  </div>
);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" >
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-800">Edit Poll</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Question</label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  className="flex-1 border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-300"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="text-red-500 hover:text-red-700 text-lg font-semibold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="text-indigo-600 text-sm font-medium hover:underline mt-1"
            >
              + Add Option
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition disabled:opacity-50"
          >
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
      await axios.delete(`https://voting-app-3eju.onrender.com/api/polls/${pollId}/delete`, {
  data: { userId: user.id },
});
      setPolls(prev => prev.filter(p => p._id !== pollId));
    } catch {
      alert('Failed to delete poll.');
    }
  };

  const handleEditSave = async (data) => {
    setEditLoading(true);
    try {
      const res = await axios.put(`https://voting-app-3eju.onrender.com/api/polls/${editPoll._id}/edit`, {
        userId: user.id,
        question: data.question,
        options: data.options,
      });
      setPolls(prev => prev.map(p => p._id === editPoll._id ? res.data.poll : p));
      setEditPoll(null);
    } catch {
      alert('Failed to edit poll.');
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('https://voting-app-3eju.onrender.com/api/polls/all');
        setPolls(response.data.polls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative " style={{
    background: 'linear-gradient(90deg, #667eea 5%, #764ba2 50%)',
    backgroundAttachment: 'fixed',
    color: 'white', 
  }}>
      <nav className="relative z-10 flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-md px-6 py-5 rounded-b-2xl border-b border-slate-200 shadow-sm">
        <div className="text-3xl font-extrabold text-indigo-600 tracking-tight">PulsePoll</div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
          {user && (
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              Hello, {user.username}
            </div>
          )}
          <Link
            to="/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
          >
            Create Poll
          </Link>
          <button
            onClick={handleLogout}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="text-center my-10 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
          Effortless Polls 
        </h1>
        
      </section>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">All Polls</h2>

          {polls.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No polls available. Create your first one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.map(poll => (
                <div key={poll._id} className="group rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition transform hover:-translate-y-1">
                  <Link to={`/poll/${poll._id}`} className="block space-y-3">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>{poll.options.length} options</span>
                      <span>View →</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">{poll.question}</h3>
                  </Link>
                  {user?.isAdmin && (
                    <div className="mt-4 flex gap-3 justify-end">
                      <button
                        onClick={() => setEditPoll(poll)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(poll._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
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
      </main>



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
