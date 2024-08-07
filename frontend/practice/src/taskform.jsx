import React, { useState, useEffect } from 'react';
import axios from './axios';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    task_name: '',
    task_description: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4024/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4024/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { task_name, task_description } = taskData;

      const response = await axios.put(`http://localhost:4024/api/tasks/${editing}`, { task_name, task_description }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(tasks.map(task => task.task_id === editing ? response.data : task));

      setEditing(null);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (task_id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4024/api/tasks/${task_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.task_id !== task_id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditing(task.task_id);
    setTaskData({ task_name: task.task_name, task_description: task.task_description });
  };

  const handleFormSubmit = (e) => {
    if (editing) {
      handleUpdate(e);
    } else {
      handleCreate(e);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>{editing ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="task_name"
            placeholder="Task Name"
            value={taskData.task_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="task_description"
            placeholder="Task Description"
            value={taskData.task_description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>
            {editing ? 'Confirm Edit' : 'Create Task'}
          </button>
        </form>
      </div>
      <div style={styles.taskList}>
        <h3 style={styles.subtitle}>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul style={styles.taskListItems}>
            {tasks.map(task => (
              <li key={task.task_id} style={styles.taskItem}>
                <h4 style={styles.taskTitle}>{task.task_name}</h4>
                <p style={styles.taskDescription}>{task.task_description}</p>
                <div style={styles.taskActions}>
                  <button onClick={() => startEditing(task)} style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(task.task_id)} style={styles.deleteButton}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9'
  },
  form: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
    textAlign: 'center'
  },
  subtitle: {
    marginBottom: '15px',
    fontSize: '20px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  },
  taskList: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  taskListItems: {
    listStyleType: 'none',
    padding: '0'
  },
  taskItem: {
    marginBottom: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: '#fafafa'
  },
  taskTitle: {
    margin: '0',
    fontSize: '18px',
    color: '#333'
  },
  taskDescription: {
    margin: '5px 0',
    fontSize: '16px',
    color: '#666'
  },
  taskActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px'
  },
  editButton: {
    backgroundColor: '#007BFF',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  }
};

export default Task;
