import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './Authcontext';
import { BarChart, ResponsiveContainer, Bar, XAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io("http://localhost:5000");

const professionalBgStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%)',
  backgroundSize: '400% 400%',
  animation: 'professionalGradient 20s ease infinite',
};

const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
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

const Details = () => {
  const [poll, setPoll] = useState(null);
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/polls/${id}`);
        setPoll(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching poll details:", error);
        setMessage("Failed to load poll details.");
        setLoading(false);
      }
    };

    fetchPoll();

    const handleVoteUpdate = (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    };

    socket.on("voteUpdate", handleVoteUpdate);

    return () => {
      socket.off("voteUpdate", handleVoteUpdate);
    };
  }, [id]);

  const handleVote = async () => {
    if (selectedOption === null) {
      alert("Please select an option to vote.");
      return;
    }

    const userId = user ? user.id : null;
    if (!userId) {
      alert("You must be logged in to vote.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/polls/${id}/vote`, {
        optionIndex: selectedOption,
        userId: userId,
      });

      setMessage("Vote cast successfully!");
      setVoted(true);
      setShowResults(true);
    } catch (error) {
      console.error("Error casting vote:", error);
      setMessage("Failed to cast vote. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={professionalBgStyle}>
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold">Loading poll details...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={professionalBgStyle}>
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-slate-700 font-semibold">{message || "Poll not found."}</p>
          <Link to="/dash" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);
  const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <div className="min-h-screen flex flex-col relative" style={professionalBgStyle}>
      
      
      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-6 pb-12 pt-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
          
          {/* Poll Question */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-tight">
              {poll.question}
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 text-lg">
              Total Votes: <span className="font-bold text-blue-600">{totalVotes}</span>
            </p>
          </div>

          {!voted && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Cast Your Vote</h2>
              <div className="grid gap-4 max-w-2xl mx-auto">
                {poll.options.map((option, index) => {
                  const percentage = totalVotes ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                  
                  return (
                    <div 
                      key={index} 
                      className={`relative group cursor-pointer transition-all duration-300 ${
                        selectedOption === index 
                          ? 'ring-4 ring-blue-500 ring-opacity-50' 
                          : 'hover:ring-2 hover:ring-blue-300'
                      }`}
                    >
                      <label className="block bg-gradient-to-r from-slate-50 to-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="pollOption"
                            value={index}
                            checked={selectedOption === index}
                            onChange={() => setSelectedOption(index)}
                            className="w-5 h-5 text-blue-600 border-2 border-slate-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className="text-lg font-semibold text-slate-800">
                              {option.text}
                            </span>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-slate-600">
                                {option.votes} votes ({percentage}%)
                              </span>
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <button
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg transform hover:scale-105 ${
                    selectedOption !== null
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                  onClick={handleVote}
                  disabled={selectedOption === null}
                >
                  {selectedOption !== null ? 'Cast Vote' : 'Select an option to vote'}
                </button>
              </div>
            </div>
          )}

          {voted && (
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Vote Cast Successfully!</h2>
              <p className="text-slate-600">Thank you for participating in this poll.</p>
            </div>
          )}

          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Poll Results</h2>
            </div>

            <div className="grid gap-6 mb-8">
              {poll.options.map((option, index) => {
                const percentage = totalVotes ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                const isWinning = option.votes === Math.max(...poll.options.map(opt => opt.votes));
                
                return (
                  <div 
                    key={index}
                    className={`relative p-6 rounded-2xl transition-all duration-500 animate-fadeInUp ${
                      isWinning 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' 
                        : 'bg-gradient-to-r from-slate-50 to-white border border-slate-200'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                          isWinning 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                        }`}>
                          {isWinning ? '🏆' : `${index + 1}`}
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            isWinning ? 'text-yellow-800' : 'text-slate-800'
                          }`}>
                            {option.text}
                            {isWinning && <span className="ml-2 text-yellow-600">(Winner)</span>}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            {option.votes} votes • {percentage}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          isWinning ? 'text-yellow-600' : 'text-slate-700'
                        }`}>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${
                          isWinning 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Vote Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={poll.options.map((option, index) => ({
                      name: option.text.length > 15 ? option.text.substring(0, 15) + '...' : option.text,
                      votes: option.votes,
                      percentage: totalVotes ? ((option.votes / totalVotes) * 100).toFixed(1) : 0,
                      color: colors[index % colors.length]
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="votes" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Results Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={poll.options.map((option, index) => ({
                        name: option.text,
                        value: option.votes,
                        color: colors[index % colors.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {poll.options.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 space-x-4">
            <Link
              to="/dash"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Refresh Results
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeIn">
          {message}
        </div>
      )}
    </div>
  );
};

export default Details;
