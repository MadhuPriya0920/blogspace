import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast.success(`Welcome to BlogSpace, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: `2px solid ${focused === name ? '#e94560' : '#e5e7eb'}`,
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    backgroundColor: '#fafafa',
    boxShadow: focused === name ? '0 0 0 4px rgba(233,69,96,0.08)' : 'none',
    color: '#111',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.45rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{
            color: '#e94560',
            fontSize: '2rem',
            fontWeight: '800',
            textDecoration: 'none',
          }}>
            BlogSpace
          </Link>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Join thousands of writers
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.3rem',
          }}>
            Create your account ✨
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
            Start writing and sharing your ideas today
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                style={inputStyle('name')}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputStyle('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                style={inputStyle('password')}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Account Type</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{
                  ...inputStyle('role'),
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
                onFocus={() => setFocused('role')}
                onBlur={() => setFocused('')}
              >
                <option value="user">✍️ Writer (User)</option>
                <option value="admin">🛡️ Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.9rem',
                backgroundColor: loading ? '#f3a0ae' : '#e94560',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.3px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(233,69,96,0.35)',
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.backgroundColor = '#d63651'; e.target.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { if (!loading) { e.target.style.backgroundColor = '#e94560'; e.target.style.transform = 'translateY(0)'; }}}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.5rem 0',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e94560', fontWeight: '700', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{
          textAlign: 'center',
          color: '#475569',
          fontSize: '0.78rem',
          marginTop: '1.5rem',
        }}>
          By registering, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Register;