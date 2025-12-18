// src/components/LoginForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginForm() {
  const auth = useAuth();
  const setAuth = auth?.setAuth;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/login', form);
      if (setAuth && res.data.user && res.data.token) {
        setAuth(res.data.user, res.data.token);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <h2 style={styles.title}>Login</h2>

      {error && (
        <p style={styles.errorText}>
          {error}
        </p>
      )}

      <div style={styles.field}>
        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          style={styles.input}
          placeholder="you@example.com"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          style={styles.input}
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Signing in…' : 'Login'}
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
    backgroundImage: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    boxShadow: '0 10px 22px rgba(37, 99, 235, 0.45)',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease',
  },
};
