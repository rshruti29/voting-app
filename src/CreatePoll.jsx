import React from 'react';
import axios from 'axios';

const CreatePoll = () => {
  const [question, setQuestion] = React.useState('');
  const [options, setOptions] = React.useState(['', '']);
  const [message, setMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!question.trim() || options.some(opt => !opt.trim())) {
      setMessage('Please fill in all fields.');
      setIsError(true);
      return;
    }

    try {
      await axios.post('https://voting-app-99th.onrender.com/api/polls/create', {
        question,
        options
      });
      setQuestion('');
      setOptions(['', '']);
      setMessage('✅ Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      setMessage('❌ Failed to create poll. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-extrabold text-indigo-600 text-center mb-6">
          Create a New Poll
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Poll Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Who should be the next team lead?"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
            <div className="space-y-3">
              {options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="text-sm text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              + Add Option
            </button>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Create Poll
            </button>
          </div>

          {message && (
            <p
              className={`text-center text-sm font-medium ${
                isError ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
