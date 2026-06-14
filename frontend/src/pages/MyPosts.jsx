import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
});

const readTime = (content) => Math.max(1, Math.ceil((content?.split(' ').length || 0) / 200));

const getAvatar = (name) => name ? name.charAt(0).toUpperCase() : '?';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchMyPosts = async () => {
      try {
        const { data } = await api.get('/posts/user/myposts');
        setPosts(data);
      } catch (err) {
        toast.error('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [user, navigate]);

  const handleDelete = async (postId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this post permanently?')) return;
    setDeletingId(postId);
    try {
      await api.delete('/posts/' + postId);
      setPosts(posts.filter(p => p._id !== postId));
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (postId, e) => {
    e.stopPropagation();
    navigate('/edit/' + postId);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</div>
          <p>Loading your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        padding: '3rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Author Avatar */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e94560',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '800',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
            }}>
              {getAvatar(user?.name)}
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.2rem' }}>
                Your writing dashboard
              </p>
              <h1 style={{
                color: '#fff',
                fontSize: '1.8rem',
                fontWeight: '800',
                margin: 0,
              }}>
                {user?.name}'s Stories
              </h1>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => navigate('/create')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(233,69,96,0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.backgroundColor = '#d63651'; e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.target.style.backgroundColor = '#e94560'; e.target.style.transform = 'translateY(0)'; }}
              >
                + Write New Story
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'Total Stories', value: posts.length },
              { label: 'Total Words', value: posts.reduce((acc, p) => acc + (p.content?.split(' ').length || 0), 0).toLocaleString() },
              { label: 'Avg Read Time', value: posts.length ? Math.round(posts.reduce((acc, p) => acc + readTime(p.content), 0) / posts.length) + ' min' : '0 min' },
            ].map(stat => (
              <div key={stat.label}>
                <p style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
                  {stat.value}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✍️</div>
            <h3 style={{ color: '#111827', fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              No stories yet
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              You haven't written anything yet. Start sharing your ideas!
            </p>
            <button
              onClick={() => navigate('/create')}
              style={{
                padding: '0.8rem 2rem',
                backgroundColor: '#e94560',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(233,69,96,0.3)',
              }}
            >
              Write your first story
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map((post, index) => (
              <div
                key={post._id}
                onClick={() => navigate('/post/' + post._id)}
                onMouseEnter={() => setHoveredCard(post._id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.2rem',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  boxShadow: hoveredCard === post._id
                    ? '0 8px 30px rgba(0,0,0,0.1)'
                    : '0 2px 8px rgba(0,0,0,0.05)',
                  border: hoveredCard === post._id
                    ? '1px solid #fde8ec'
                    : '1px solid #f0f0f0',
                  transition: 'all 0.2s ease',
                  transform: hoveredCard === post._id ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {/* Index number */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#fff0f3',
                  color: '#e94560',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  flexShrink: 0,
                }}>
                  {index + 1}
                </div>

                {/* Cover thumbnail */}
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: '#fff0f3',
                      color: '#e94560',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}>
                      {post.category}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      {readTime(post.content)} min read
                    </span>
                    <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>·</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: '0 0 0.3rem',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {post.title}
                  </h3>

                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    margin: 0,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {post.excerpt}
                  </p>
                </div>

                {/* Actions */}
                <div
                  style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleEdit(post._id, e)}
                    onMouseEnter={() => setHoveredBtn('edit-' + post._id)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      padding: '7px 14px',
                      backgroundColor: hoveredBtn === 'edit-' + post._id ? '#e5e7eb' : '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(post._id, e)}
                    disabled={deletingId === post._id}
                    onMouseEnter={() => setHoveredBtn('del-' + post._id)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      padding: '7px 14px',
                      backgroundColor: hoveredBtn === 'del-' + post._id ? '#e94560' : '#fff0f3',
                      color: hoveredBtn === 'del-' + post._id ? '#fff' : '#e94560',
                      border: '1px solid #fde8ec',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: deletingId === post._id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                      opacity: deletingId === post._id ? 0.6 : 1,
                    }}
                  >
                    {deletingId === post._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;