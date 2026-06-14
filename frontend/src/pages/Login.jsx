import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            letterSpacing: '0.5px',
          }}>
            BlogSpace
          </Link>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Sign in to your account
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
            Welcome back 👋
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.45rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Email Address
              </label>
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

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.45rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={inputStyle('password')}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
              />
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
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
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
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#e94560',
              fontWeight: '700',
              textDecoration: 'none',
            }}>
              Create one free
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          color: '#475569',
          fontSize: '0.78rem',
          marginTop: '1.5rem',
        }}>
          By signing in, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;