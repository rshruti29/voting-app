import React from 'react';
import axios from "axios";

const CreatePoll = () => {
    const [question, setQuestion] = React.useState('');
    const [options, setOptions] = React.useState(['', '']);

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
        if (!question.trim() || options.some(option => !option.trim())) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/polls/create', {
                question,
                options
            });
            alert("Poll created successfully!");
            setQuestion('');
            setOptions(['', '']);
        } catch (error) {
            console.error("Error creating poll:", error);
        }
    };

    return (
        <div>
            <h2>Create a Poll</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Poll question"
                />
                {options.map((option, idx) => (
                    <div key={idx}>
                        <input
                            type="text"
                            value={option}
                            onChange={e => handleOptionChange(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                        />
                        {options.length > 2 && (
                            <button type="button" onClick={() => removeOption(idx)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addOption}>Add Option</button>
                <button type="submit" className='Submit-button'>Create Poll</button>
            </form>
        </div>
    );
};

export default CreatePoll;
