import React, { useState } from 'react';

function Task({ task, onToggleCompleted, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(task.description);
  const [editingSubTaskId, setEditingSubTaskId] = useState(null);
  const [subTaskEdits, setSubTaskEdits] = useState({});

  const handleSubTaskEdit = (id, description) => {
    setEditingSubTaskId(id);
    setSubTaskEdits({ ...subTaskEdits, [id]: description });
  };

  const handleSubTaskSave = (id) => {
    if (subTaskEdits[id].trim() === '') {
      alert('Sub-task description cannot be empty.');
      return;
    }
    onUpdate(task.id, subTaskEdits[id], true, id);
    setEditingSubTaskId(null);
    setSubTaskEdits({});
  };

  const handleSubTaskChange = (id, value) => {
    setSubTaskEdits({ ...subTaskEdits, [id]: value });
  };

  const handleToggleCompleted = (subTaskId) => {
    onToggleCompleted(task.id, subTaskId);
  };

  const handleDelete = () => {
    onDelete(task.id, false, null);
  };

  const handleSubTaskDelete = (subTaskId) => {
    onDelete(subTaskId, true, task.id);
  };

  const handleUpdate = (newDescription) => {
    onUpdate(task.id, newDescription, false, null);
  };

  return (
    <div className={`task ${task.isCompleted ? 'completed' : ''}`}>
      <input type="checkbox" checked={task.isCompleted} onChange={() => onToggleCompleted(task.id, null)} />
      {isEditing ? (
        <>
          <input
            type="text"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
          />
          <button onClick={() => {
              onUpdate(task.id, editInput, false);
              setIsEditing(false);
          }}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{task.description}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
      {task.subTasks && task.subTasks.map(subTask => (
        <div key={subTask.id} className={`subtask ${subTask.isCompleted ? 'completed' : ''}`}>
          <input
            type="checkbox"
            checked={subTask.isCompleted}
            onChange={() => handleToggleCompleted(subTask.id)}
          />
          {editingSubTaskId === subTask.id ? (
            <>
              <input
                type="text"
                value={subTaskEdits[subTask.id] || subTask.description}
                onChange={(e) => handleSubTaskChange(subTask.id, e.target.value)}
              />
              <button onClick={() => handleSubTaskSave(subTask.id)}>Save</button>
            </>
          ) : (
            <>
              <span>{subTask.description}</span>
              <button onClick={() => handleSubTaskEdit(subTask.id, subTask.description)}>Edit</button>
            </>
          )}
          <button onClick={() => handleSubTaskDelete(subTask.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Task;
