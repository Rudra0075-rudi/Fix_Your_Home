// src/components/UserRegisterForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserRegisterForm() {
  const auth = useAuth();
  const setAuth = auth?.setAuth;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/register/user', form);
      if (setAuth && response.data.user && response.data.token) {
        setAuth(response.data.user, response.data.token);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.status === 422 && err.response.data?.errors) {
        const firstField = Object.keys(err.response.data.errors)[0];
        setError(err.response.data.errors[firstField][0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>User Sign Up</h2>

      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.field}>
        <label style={styles.label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Your full name"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="you@example.com"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="01XXXXXXXXX"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Enter your password"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="password_confirmation">
          Confirm Password
        </label>
        <input
          id="password_confirmation"
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Re-enter your password"
        />
      </div>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Creating account…' : 'Register as User'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    marginTop: '4px',
    padding: '18px 18px 20px',
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 16px rgba(15, 23, 42, 0.12)',
  },
  title: {
    margin: 0,
    marginBottom: '12px',
    fontSize: '22px',
    fontWeight: 700,
    color: '#111827',
  },
  field: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#4b5563',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  },
  errorText: {
    margin: '0 0 10px',
    fontSize: '13px',
    color: '#b91c1c',
  },
  button: {
    marginTop: '4px',
    width: '100%',
    border: 'none',
    borderRadius: '999px',
    padding: '9px 14px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#f9fafb',
    cursor: 'pointer',
    backgroundImage: 'linear-gradient(135deg, #16a34a, #22c55e)',
    boxShadow: '0 10px 22px rgba(34, 197, 94, 0.4)',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease',
  },
};
