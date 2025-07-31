import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

// Professional animated background with sophisticated gradient
const professionalBgStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
  backgroundSize: '400% 400%',
  animation: 'professionalGradient 20s ease infinite',
};

// Floating particles effect
const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${10 + Math.random() * 20}s`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl p-8 w-full max-w-lg relative border border-slate-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-slate-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit Poll
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Question</label>
            <input 
              type="text" 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-3">
                <input 
                  type="text" 
                  value={opt} 
                  onChange={e => handleOptionChange(idx, e.target.value)} 
                  className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                  required 
                />
                {options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveOption(idx)} 
                    className="text-red-500 hover:text-red-700 text-xl font-bold transition-colors duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={handleAddOption} 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
            >
              + Add Option
            </button>
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
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
        console.log("Fetched polls:", response.data.polls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative" style={professionalBgStyle}>
      <FloatingParticles />
      
      {/* Professional Navbar */}
      <nav className="relative z-10 flex flex-col sm:flex-row items-center justify-between bg-white/90 backdrop-blur-xl shadow-2xl px-6 sm:px-8 py-6 mb-12 gap-6 sm:gap-0 rounded-b-3xl border-b border-white/20">
        <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
          Tallyfy
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end">
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-700 font-semibold text-base sm:text-lg">
                Welcome, {user.username}!
              </span>
            </div>
          )}
          <Link
            to="/create"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Create Poll
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl mx-auto mb-12 px-6">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent drop-shadow-2xl mb-6 animate-fadeInUp">
            People-friendly poll maker
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-white/90 mb-4 leading-relaxed">
            You need data. Online polls make data. But polls need people.
          </p>
          <p className="text-base sm:text-lg text-white/80">
            <span className="font-bold text-yellow-300">87%</span> get more responses after switching to{' '}
            <span className="font-black text-yellow-300">Tallyfy</span>.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              All Polls
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          {polls.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-600 text-lg font-medium">No polls available</p>
              <p className="text-slate-500 text-sm mt-2">Create your first poll to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {polls.map((poll, index) => (
                <div 
                  key={poll._id} 
                  className="group relative animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    to={`/poll/${poll._id}`}
                    className="block bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:shadow-blue-500/25"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        📊
                      </div>
                      <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {poll.options.length} options
                      </div>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {poll.question}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4">
                      Click to view and participate in this poll
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Poll
                      </div>
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold transform group-hover:scale-110 transition-transform duration-300">
                        →
                      </div>
                    </div>
                  </Link>
                  
                  {user && user.isAdmin && (
                    <div className="flex gap-3 mt-4 justify-center">
                      <button
                        onClick={() => setEditPoll(poll)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(poll._id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
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
      </div>

      {/* Professional Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-xl shadow-2xl border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tallyfy
            </div>
            <div className="text-slate-600 font-medium">
              Empowering Decisions, One Vote at a Time
            </div>
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Tallyfy. All rights reserved.
            </div>
          </div>
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
