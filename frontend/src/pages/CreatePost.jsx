import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const categories = ['Technology', 'Travel', 'Food', 'Health', 'Business', 'Lifestyle', 'Education', 'Other'];

const CreatePost = () => {
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: 'Technology', coverImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.excerpt || !form.category) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/posts', form);
      toast.success('Post published successfully!');
      navigate(`/post/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
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

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← Back
            </button>
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '0.3rem',
          }}>
            Write a new story ✍️
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
            Share your ideas with the world
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
          <form onSubmit={handleSubmit}>

            {/* Cover Image Preview */}
            {form.coverImage && (
              <div style={{ marginBottom: '1.5rem' }}>
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                  }}
                  onError={e => e.target.style.display = 'none'}
                />
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: '1.4rem' }}>
              <label style={labelStyle}>Post Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Write an attention-grabbing title..."
                required
                style={{ ...inputStyle('title'), fontSize: '1.1rem', fontWeight: '600' }}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* Excerpt */}
            <div style={{ marginBottom: '1.4rem' }}>
              <label style={labelStyle}>Short Excerpt *</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Write a short summary that appears on the post card (1-2 sentences)..."
                required
                rows={2}
                style={{
                  ...inputStyle('excerpt'),
                  resize: 'vertical',
                  lineHeight: '1.6',
                }}
                onFocus={() => setFocused('excerpt')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* Category + Cover Image row */}
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

            {/* Content */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Full Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your full story here... Share your knowledge, experiences, and ideas."
                required
                rows={14}
                style={{
                  ...inputStyle('content'),
                  resize: 'vertical',
                  lineHeight: '1.8',
                  fontSize: '0.97rem',
                }}
                onFocus={() => setFocused('content')}
                onBlur={() => setFocused('')}
              />
              <p style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                {form.content.split(' ').filter(Boolean).length} words
                · ~{Math.max(1, Math.ceil(form.content.split(' ').filter(Boolean).length / 200))} min read
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                {loading ? 'Publishing...' : '🚀 Publish Story'}
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

        {/* Tips Card */}
        <div style={{
          backgroundColor: '#fff8f9',
          border: '1px solid #fde8ec',
          borderRadius: '12px',
          padding: '1.2rem 1.5rem',
          marginTop: '1.5rem',
        }}>
          <p style={{ color: '#e94560', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            ✦ Writing Tips
          </p>
          <ul style={{ color: '#6b7280', fontSize: '0.83rem', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
            <li>Keep your title under 60 characters for best readability</li>
            <li>The excerpt is shown on post cards — make it compelling</li>
            <li>Use a high-quality image URL for the cover (Unsplash works great)</li>
            <li>Aim for at least 300 words for a meaningful article</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CreatePost;