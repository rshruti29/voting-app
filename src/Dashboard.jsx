// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Link } from 'react-router-dom'

// const Dashboard = () => {
//   const[polls, setPolls] = useState([])

//   useEffect(() => {
//     const fetchPolls = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/polls');
//         setPolls(response.data)
//       } catch (error) {
//         console.error('Error fetching polls:', error)
//       }
//     }
//     fetchPolls()
//   }, [])


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-100 px-6 py-12">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">All Polls</h1>

//         {polls.length === 0 ? (
//           <p className="text-center text-gray-600 text-lg">No polls available</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {polls.map((poll) => (
//               <Link
//                 to={`/poll/${poll.id}`}
//                 key={poll.id}
//                 className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition hover:-translate-y-1 border border-gray-100"
//               >
//                 <h2 className="text-lg font-semibold text-indigo-600">{poll.question}</h2>
//                 <p className="text-sm text-gray-500 mt-2">Click to view and vote</p>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )}

// export default Dashboard


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [polls, setPolls] = useState([]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-100 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">All Polls</h1>

        {polls.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No polls available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <Link
                to={`/poll/${poll._id}`} // Fixed: was poll.id
                key={poll._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition hover:-translate-y-1 border border-gray-100"
              >
                <h2 className="text-lg font-semibold text-indigo-600">{poll.question}</h2>
                <p className="text-sm text-gray-500 mt-2">Click to view and vote</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
