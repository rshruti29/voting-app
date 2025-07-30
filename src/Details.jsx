import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from './Authcontext';
import {BarChart, ResponsiveContainer} from 'recharts';

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
    <div className="poll-details-container">
        <h1 className="poll-title">{poll.question}</h1>
        <div className="options-container">
            {poll.options.map((option, index) => {
                const percentage =  totalVotes ? ((option.votes / poll.totalVotes) * 100).toFixed(2) : 0;
            return (
                <div key={index} className="option-items">
                    <label>
                        <input
                        type="radio"
                        name="pollOption"
                        value={index}
                        checked={selectedOption === index}
                        onChange={() => setSelectedOption(index)}
                    />
                    {option.text} (Votes: {option.votes}- {percentage}%)
                    </label>

                    <div className="progress-bar">
                        <div className="progress"
                            style={{ width: `${percentage}%`, backgroundColor: '#4caf50' }}
                        ></div>
                    </div>

                    <button className="vote-button" onClick={handleVote}>Vote</button>
                    {message && <p className="message">{message}</p>}

                </div>
                );      
})}
        </div>

        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={poll.options.map((option,index) => ({
                name: option.text,
                votes: option.votes,
                percentage: totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0
            })
            
            )}>
                <CartesianGrid strokeDasharray = '3 3'/>
                <XAxis dataKey="name" />
                <Tooltip/>
                <Legend/>
                <Bar dataKey = "votes" fill="#825678"></Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};


export default Details;