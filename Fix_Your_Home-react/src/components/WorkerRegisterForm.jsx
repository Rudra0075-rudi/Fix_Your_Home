// src/components/WorkerRegisterForm.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function WorkerRegisterForm() {
  const auth = useAuth();
  const setAuth = auth?.setAuth;

  const [servicesOptions, setServicesOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    password: '',
    password_confirmation: '',
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/available-services').then((res) => {
      setServicesOptions(res.data);
    });
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (photo) data.append('photo', photo);
    selectedServices.forEach((s) => data.append('services[]', s));

    try {
      const res = await axios.post('/api/register/worker', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (setAuth && res.data.user && res.data.token) {
        setAuth(res.data.user, res.data.token);
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
    <form onSubmit={onSubmit} style={styles.form}>
      <h2 style={styles.title}>Worker Sign Up</h2>

      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.field}>
        <label style={styles.label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
          required
          style={styles.input}
          placeholder="01XXXXXXXXX"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={onChange}
          style={{ ...styles.input, minHeight: '70px', resize: 'vertical' }}
          placeholder="Describe your experience and skills"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="photo">
          Photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0] || null)}
          style={styles.fileInput}
        />
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Services</span>
        <div style={styles.servicesGrid}>
          {servicesOptions.map((service) => (
            <label key={service} style={styles.serviceChip}>
              <input
                type="checkbox"
                style={{ display: 'none' }}
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />
              <span
                style={{
                  ...styles.serviceChipInner,
                  ...(selectedServices.includes(service)
                    ? styles.serviceChipInnerActive
                    : {}),
                }}
              >
                {service}
              </span>
            </label>
          ))}
        </div>
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
          onChange={onChange}
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
          onChange={onChange}
          required
          style={styles.input}
          placeholder="Re-enter your password"
        />
      </div>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Creating worker…' : 'Register as Worker'}
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
  fileInput: {
    fontSize: '13px',
  },
  errorText: {
    margin: '0 0 10px',
    fontSize: '13px',
    color: '#b91c1c',
  },
  servicesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  serviceChip: {
    margin: 0,
  },
  serviceChipInner: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    fontSize: '12px',
    color: '#4b5563',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  serviceChipInnerActive: {
    backgroundImage: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    color: '#f9fafb',
    borderColor: 'transparent',
    boxShadow: '0 6px 14px rgba(14, 165, 233, 0.4)',
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
    backgroundImage: 'linear-gradient(135deg, #f59e0b, #eab308)',
    boxShadow: '0 10px 22px rgba(234, 179, 8, 0.4)',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease',
  },
};
