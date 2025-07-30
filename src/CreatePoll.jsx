// import React from 'react';
// import axios from "axios";

// const CreatePoll = () => {
//     const [question, setQuestion] = React.useState('');
//     const [options, setOptions] = React.useState(['', '']);

//     const handleOptionChange = (index, value) => {
//         const newOptions = [...options];
//         newOptions[index] = value;
//         setOptions(newOptions);
//     };

//     const addOption = () => {
//         setOptions([...options, '']);
//     };

//     const removeOption = (index) => {
//         const newOptions = options.filter((_, i) => i !== index);
//         setOptions(newOptions);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!question.trim() || options.some(option => !option.trim())) {
//             alert("Please fill in all fields.");
//             return;
//         }
//         try {
//             await axios.post('http://localhost:5000/api/polls/create', {
//                 question,
//                 options
//             });
//              setQuestion('');
//             setOptions(['', '']);
//         } catch (error) {
//             console.error("Error creating poll:", error);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-100 px-4 py-10">
//       <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
//         <h2 className="text-3xl font-bold text-indigo-600 text-center mb-8">Create a New Poll</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Poll Question</label>
//             <input
//               type="text"
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               placeholder="Enter your poll question"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//             />
//           </div>

//           <div className="space-y-4">
//             {options.map((option, idx) => (
//               <div key={idx} className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={option}
//                   onChange={(e) => handleOptionChange(idx, e.target.value)}
//                   placeholder={`Option ${idx + 1}`}
//                   required
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
//                 />
//                 {options.length > 2 && (
//                   <button
//                     type="button"
//                     onClick={() => removeOption(idx)}
//                     className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-between items-center">
//             <button
//               type="button"
//               onClick={addOption}
//               className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
//             >
//               Add Option
//             </button>

//             <button
//               type="submit"
//               className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
//             >
//               Create Poll
//             </button>
//           </div>

//           {message && <p className="text-center text-indigo-600 mt-4">{message}</p>}
//         </form>
//       </div>
//     </div>
//     );
// };

// export default CreatePoll;


import React from 'react';
import axios from "axios";

const CreatePoll = () => {
  const [question, setQuestion] = React.useState('');
  const [options, setOptions] = React.useState(['', '']);
  const [message, setMessage] = React.useState(''); // ✅ added
  const [isError, setIsError] = React.useState(false); // optional

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!question.trim() || options.some(option => !option.trim())) {
      setMessage("Please fill in all fields.");
      setIsError(true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/polls/create', {
        question,
        options
      });

      setQuestion('');
      setOptions(['', '']);
      setMessage("✅ Poll created successfully!");
    } catch (error) {
      console.error("Error creating poll:", error);
      setMessage("❌ Failed to create poll. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-8">Create a New Poll</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the Position"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-4">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addOption}
              className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
            >
              Add Option
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Create Poll
            </button>
          </div>

          {message && (
            <p
              className={`text-center mt-4 font-medium ${
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
