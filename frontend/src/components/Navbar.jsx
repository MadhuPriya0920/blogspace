import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const getAvatar = (name) => name ? name.charAt(0).toUpperCase() : '?';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{
          color: '#e94560',
          fontSize: '1.5rem',
          fontWeight: '800',
          textDecoration: 'none',
          letterSpacing: '0.5px',
          flexShrink: 0,
        }}>
          BlogSpace
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}
          className="desktop-nav"
        >
          <Link to="/" style={{
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: isActive('/') ? '700' : '500',
            color: isActive('/') ? '#e94560' : '#6b7280',
            textDecoration: 'none',
            backgroundColor: isActive('/') ? '#fff0f3' : 'transparent',
            transition: 'all 0.15s',
          }}>
            Home
          </Link>

          {user && (
            <>
              <Link to="/create" style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: isActive('/create') ? '700' : '500',
                color: isActive('/create') ? '#e94560' : '#6b7280',
                textDecoration: 'none',
                backgroundColor: isActive('/create') ? '#fff0f3' : 'transparent',
                transition: 'all 0.15s',
              }}>
                Write
              </Link>
              <Link to="/myposts" style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: isActive('/myposts') ? '700' : '500',
                color: isActive('/myposts') ? '#e94560' : '#6b7280',
                textDecoration: 'none',
                backgroundColor: isActive('/myposts') ? '#fff0f3' : 'transparent',
                transition: 'all 0.15s',
              }}>
                My Stories
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {user ? (
            <>
              {/* Write button (prominent) */}
              <button
                onClick={() => navigate('/create')}
                style={{
                  padding: '0.5rem 1.1rem',
                  backgroundColor: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(233,69,96,0.3)',
                }}
                onMouseEnter={e => { e.target.style.backgroundColor = '#d63651'; }}
                onMouseLeave={e => { e.target.style.backgroundColor = '#e94560'; }}
              >
                + Write
              </button>

              {/* Avatar dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#e94560',
                    color: '#fff',
                    border: '2px solid #fde8ec',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: dropdownOpen ? '0 0 0 3px rgba(233,69,96,0.2)' : 'none',
                  }}
                >
                  {getAvatar(user.name)}
                </button>

                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99,
                      }}
                    />
                    {/* Dropdown */}
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                      border: '1px solid #f0f0f0',
                      minWidth: '200px',
                      zIndex: 100,
                      overflow: 'hidden',
                    }}>
                      {/* User info */}
                      <div style={{
                        padding: '1rem 1.2rem',
                        borderBottom: '1px solid #f3f4f6',
                        backgroundColor: '#fafafa',
                      }}>
                        <p style={{ fontWeight: '700', color: '#111827', margin: 0, fontSize: '0.9rem' }}>
                          {user.name}
                        </p>
                        <p style={{ color: '#9ca3af', margin: '2px 0 0', fontSize: '0.78rem' }}>
                          {user.email}
                        </p>
                        {user.role === 'admin' && (
                          <span style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            backgroundColor: '#e94560',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            padding: '1px 7px',
                            borderRadius: '10px',
                          }}>
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Menu items */}
                      {[
                        { label: 'My Stories', path: '/myposts', icon: '📚' },
                        { label: 'Write New Story', path: '/create', icon: '✍️' },
                      ].map(item => (
                        <button
                          key={item.path}
                          onClick={() => { navigate(item.path); setDropdownOpen(false); }}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1.2rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#374151',
                            fontSize: '0.88rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}

                      <div style={{ borderTop: '1px solid #f3f4f6' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1.2rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#e94560',
                            fontSize: '0.88rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff0f3'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link to="/login" style={{
                padding: '0.5rem 1rem',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: '600',
                borderRadius: '8px',
                transition: 'color 0.15s',
              }}>
                Sign In
              </Link>
              <Link to="/register" style={{
                padding: '0.5rem 1.1rem',
                backgroundColor: '#e94560',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: '700',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(233,69,96,0.3)',
                transition: 'all 0.2s',
              }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;