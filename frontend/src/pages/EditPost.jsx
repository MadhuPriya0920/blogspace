import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const categories = ['Technology', 'Travel', 'Food', 'Health', 'Business', 'Lifestyle', 'Education', 'Other'];

const EditPost = () => {
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: '', coverImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [focused, setFocused] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        if (data.author._id !== user._id && user.role !== 'admin') {
          toast.error('Not authorized to edit this post');
          navigate('/');
          return;
        }
        setForm({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          category: data.category,
          coverImage: data.coverImage || '',
        });
      } catch {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/posts/${id}`, form);
      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
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
    fontFamily: "'Segoe UI', sans-serif",
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

  if (fetching) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', color: '#6b7280',
              cursor: 'pointer', fontSize: '0.9rem', padding: '4px 0',
              marginBottom: '0.5rem', display: 'block',
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginBottom: '0.3rem' }}>
            Edit your story ✏️
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
            Make changes and republish
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          border: '1px solid #f0f0f0',
        }}>
          {/* Update banner */}
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            ⚠️ You're editing a published post. Changes will go live immediately.
          </div>

          <form onSubmit={handleSubmit}>

            {form.coverImage && (
              <div style={{ marginBottom: '1.5rem' }}>
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  style={{
                    width: '100%', height: '220px', objectFit: 'cover',
                    borderRadius: '10px', border: '2px solid #e5e7eb',
                  }}
                  onError={e => e.target.style.display = 'none'}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.4rem' }}>
              <label style={labelStyle}>Post Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={{ ...inputStyle('title'), fontSize: '1.1rem', fontWeight: '600' }}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused('')}
              />
            </div>

            <div style={{ marginBottom: '1.4rem' }}>
              <label style={labelStyle}>Short Excerpt *</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                required
                rows={2}
                style={{ ...inputStyle('excerpt'), resize: 'vertical', lineHeight: '1.6' }}
                onFocus={() => setFocused('excerpt')}
                onBlur={() => setFocused('')}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.2rem',
              marginBottom: '1.4rem',
            }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{
                    ...inputStyle('category'),
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem',
                  }}
                  onFocus={() => setFocused('category')}
                  onBlur={() => setFocused('')}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Cover Image URL</label>
                <input
                  type="url"
                  name="coverImage"
                  value={form.coverImage}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={inputStyle('coverImage')}
                  onFocus={() => setFocused('coverImage')}
                  onBlur={() => setFocused('')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Full Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={14}
                style={{ ...inputStyle('content'), resize: 'vertical', lineHeight: '1.8', fontSize: '0.97rem' }}
                onFocus={() => setFocused('content')}
                onBlur={() => setFocused('')}
              />
              <p style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                {form.content.split(' ').filter(Boolean).length} words
                · ~{Math.max(1, Math.ceil(form.content.split(' ').filter(Boolean).length / 200))} min read
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  backgroundColor: loading ? '#f3a0ae' : '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(233,69,96,0.3)',
                }}
                onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#d63651'; }}
                onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = '#e94560'; }}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding: '0.9rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.color = '#374151'; }}
                onMouseLeave={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#6b7280'; }}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;