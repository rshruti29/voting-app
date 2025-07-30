import { useParams } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from './Authcontext';
import {BarChart, ResponsiveContainer, Bar, XAxis,Tooltip } from 'recharts';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const Details = () => {
const {poll, setPoll} = useState(null);
const {id} = useParams();
const [selectedOption, setSelectedOption] = useState(null);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchPoll= async () => {
        try {
            const response = await axios.get(`http://localhost:5000/poll/${id}`);
            setPoll(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching poll details:", error);
            setMessage("Failed to load poll details.");
            setLoading(false);
        } }
        fetchPoll();

        return socket.on("voteUpdate", (updatedPoll) => {
            if (updatedPoll._id === id) {
                setPoll(updatedPoll);
            }
        });

        return () => {
            socket.off("voteUpdate");
        };

}, [id]);

const handleVote = async () => {
    if (selectedOption === null) {
        alert("Please select an option to vote.");
        return
    }
    const userId = user ? user.id : null;
    if (!userId) {
        alert("You must be logged in to vote.");
        return;
    }

    try {
        await axios.post(`http://localhost:5000/api/polls/${id}/vote`, {
            optionIndex: selectedOption,    
            userId: userId
        })
        
        setMessage("Vote cast successfully!");
    }
    catch (error) {
        console.error("Error casting vote:", error);
        setMessage("Failed to cast vote. Please try again later.");
    }
}
    
  if(loading){
    return <div>Loading poll details...</div>;
  }
  if(!poll){
    return <div>{message || "Poll not found."}</div>;
  }

  const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">{poll.question}</h1>

        <div className="space-y-6">
          {poll.options.map((option, index) => {
            const percentage = totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0;

            return (
              <div key={index} className="border rounded-xl p-4 shadow-sm">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pollOption"
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                    className="accent-indigo-600"
                  />
                  <span className="text-gray-700 font-medium">
                    {option.text} — <span className="text-sm text-gray-500">{percentage}% ({option.votes} votes)</span>
                  </span>
                </label>

                <div className="w-full bg-gray-200 h-3 rounded mt-2 overflow-hidden">
                  <div
                    className="h-full rounded bg-indigo-500 transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            onClick={handleVote}
            disabled={voted}
          >
            {voted ? "Thank you for voting!" : "Vote"}
          </button>
        </div>

        {message && <p className="text-center text-sm text-indigo-700 mt-3">{message}</p>}

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Results Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={poll.options.map(option => ({
                name: option.text,
                votes: option.votes,
                percentage: totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#5A67D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


export default Details;