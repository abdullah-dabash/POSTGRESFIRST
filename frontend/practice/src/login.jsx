import React, { useState } from 'react';
import axios from './axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4024/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/tasks');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>Log In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Log In</button>
        </form>
        <div style={styles.signupLink}>
          <p>Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
  },
  form: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    maxWidth: '360px',
    width: '100%',
    textAlign: 'center'
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box'
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
  buttonHover: {
    backgroundColor: '#333'
  },
  signupLink: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#666'
  },
  link: {
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default Login;
