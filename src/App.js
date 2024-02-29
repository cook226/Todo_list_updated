import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Task from './Components/Task';
import TaskInputForm from './Components/TaskInputForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // Adding filter state

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (description, subTasks = []) => { // Ensure subTasks default to []
    const newTask = { id: uuidv4(), description, isCompleted: false, subTasks };
    setTasks([...tasks, newTask]);
  };

  const toggleCompletion = (taskId, subTaskId = null) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (subTaskId) {
          const updatedSubTasks = task.subTasks.map(subTask => {
            if (subTask.id === subTaskId) {
              return { ...subTask, isCompleted: !subTask.isCompleted };
            }
            return subTask;
          });
          return { ...task, subTasks: updatedSubTasks };
        }
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    }));
  };

  const deleteTask = (id, isSubTask, parentId) => {
    if (isSubTask) {
      setTasks(tasks.map(task => task.id === parentId ? {
        ...task, subTasks: task.subTasks.filter(subTask => subTask.id !== id)
      } : task));
    } else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const updateTask = (id, newDescription, isSubTask, parentId) => {
    if (isSubTask) {
      setTasks(tasks.map(task => task.id === parentId ? {
        ...task, subTasks: task.subTasks.map(subTask => subTask.id === id ? { ...subTask, description: newDescription } : subTask)
      } : task));
    } else {
      setTasks(tasks.map(task => task.id === id ? { ...task, description: newDescription } : task));
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.isCompleted;
    if (filter === 'incomplete') return !task.isCompleted;
    return true;
  });

  return (
    <div className="App">
      <TaskInputForm onAddTask={addTask} />
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>
      {filteredTasks.map(task => (
        <Task
          key={task.id}
          task={task}
          onToggleCompleted={toggleCompletion}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      ))}
    </div>
  );
}

export default App;
