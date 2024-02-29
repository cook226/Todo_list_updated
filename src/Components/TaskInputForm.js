import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function TaskInputForm({ onAddTask }) {
  const [input, setInput] = useState('');
  const [subTasks, setSubTasks] = useState([{ id: uuidv4(), description: '' }]);

  const handleSubTaskChange = (id, value) => {
    setSubTasks(subTasks.map(subTask => subTask.id === id ? { ...subTask, description: value } : subTask));
  };

  const addSubTask = () => {
    // Prevent adding a new sub-task if the last one is empty
    if (subTasks[subTasks.length - 1].description.trim() === '') {
      alert('Please fill in the sub-task before adding a new one.');
      return;
    }
    setSubTasks([...subTasks, { id: uuidv4(), description: '' }]);
  };

  const removeSubTask = (id) => {
    setSubTasks(subTasks.filter(subTask => subTask.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Main task cannot be empty.');
      return;
    }
    // Filter out empty sub-tasks before submitting
    const filteredSubTasks = subTasks.filter(subTask => subTask.description.trim());
    onAddTask(input, filteredSubTasks);
    setInput('');
    // Reset sub-tasks to initial state with one empty field
    setSubTasks([{ id: uuidv4(), description: '' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task"
      />
      <div>
        {subTasks.map((subTask, index) => (
          <div key={subTask.id} style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={subTask.description}
              onChange={(e) => handleSubTaskChange(subTask.id, e.target.value)}
              placeholder={`Sub-task ${index + 1}`}
            />
            <button type="button" onClick={() => removeSubTask(subTask.id)} style={{ marginLeft: '5px' }}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addSubTask} style={{ marginTop: '10px' }}>
          Add Sub-task
        </button>
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>
        Submit
      </button>
    </form>
  );
}

export default TaskInputForm;
