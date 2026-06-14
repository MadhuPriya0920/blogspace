import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const getAvatar = (name) => name ? name.charAt(0).toUpperCase() : '?';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
});

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  if (seconds < 2592000) return Math.floor(seconds / 86400) + 'd ago';
  return formatDate(date);
};

const readTime = (content) => Math.max(1, Math.ceil((content?.split(' ').length || 0) / 200));

const SinglePost = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [focused, setFocused] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get('/posts/' + id),
          api.get('/comments/' + id),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete('/posts/' + id);
      toast.success('Post deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const { data } = await api.post('/comments/' + id, { content: newComment });
      setComments([data, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    setDeleting(commentId);
    try {
      await api.delete('/comments/' + commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setDeleting(null);
    }
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
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📖</div>
          <p style={{ fontSize: '1rem' }}>Loading story...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && post.author?._id === user._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>

      {post.coverImage ? (
        <div style={{ width: '100%', height: '420px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.parentElement.style.display = 'none'; }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
          }} />
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '280px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        }} />
      )}

      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

        {/* Article Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '2.5rem',
          marginTop: '-60px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{
              backgroundColor: '#fff0f3',
              color: '#e94560',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {post.category}
            </span>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
              {readTime(post.content)} min read
            </span>
          </div>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#111827',
            lineHeight: '1.3',
            marginBottom: '1.2rem',
          }}>
            {post.title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #f3f4f6',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#e94560',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: '700',
                flexShrink: 0,
              }}>
                {getAvatar(post.author?.name)}
              </div>
              <div>
                <p style={{ fontWeight: '700', color: '#111827', margin: 0, fontSize: '0.95rem' }}>
                  {post.author?.name}
                </p>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.8rem' }}>
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {(isOwner || isAdmin) && (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {isOwner && (
                  <button
                    onClick={() => navigate('/edit/' + post._id)}
                    style={{
                      padding: '7px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.target.style.backgroundColor = '#e5e7eb'; }}
                    onMouseLeave={e => { e.target.style.backgroundColor = '#f3f4f6'; }}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '7px 16px',
                    backgroundColor: '#fff0f3',
                    color: '#e94560',
                    border: '1px solid #fde8ec',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.target.style.backgroundColor = '#e94560'; e.target.style.color = '#fff'; }}
                  onMouseLeave={e => { e.target.style.backgroundColor = '#fff0f3'; e.target.style.color = '#e94560'; }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p style={{
            fontSize: '1.05rem',
            color: '#4b5563',
            lineHeight: '1.7',
            fontStyle: 'italic',
            borderLeft: '3px solid #e94560',
            paddingLeft: '1.2rem',
            marginBottom: '2rem',
            backgroundColor: '#fff8f9',
            padding: '1rem 1rem 1rem 1.2rem',
            borderRadius: '0 8px 8px 0',
          }}>
            {post.excerpt}
          </p>

          <div style={{
            fontSize: '1.05rem',
            color: '#374151',
            lineHeight: '1.9',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {post.content}
          </div>

          <div style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <span style={{
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
            }}>
              #{post.category}
            </span>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          marginTop: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            Discussion
            <span style={{
              backgroundColor: '#e94560',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '10px',
            }}>
              {comments.length}
            </span>
          </h2>

          {user ? (
            <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#e94560',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {getAvatar(user.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on this story..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: focused ? '2px solid #e94560' : '2px solid #e5e7eb',
                      fontSize: '0.92rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'Segoe UI, sans-serif',
                      lineHeight: '1.5',
                      backgroundColor: '#fafafa',
                      color: '#111',
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.6rem' }}>
                    <button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      style={{
                        padding: '0.6rem 1.4rem',
                        backgroundColor: commentLoading || !newComment.trim() ? '#f3a0ae' : '#e94560',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        cursor: commentLoading || !newComment.trim() ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {commentLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px dashed #d1d5db',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
            }}>
              <p style={{ color: '#6b7280', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                Join the conversation
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Sign in to comment
              </button>
            </div>
          )}

          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
              <p style={{ fontSize: '0.92rem' }}>No comments yet. Be the first!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.map(comment => {
                const canDelete = user && (comment.author?._id === user._id || user.role === 'admin');
                return (
                  <div key={comment._id} style={{
                    display: 'flex',
                    gap: '0.75rem',
                    padding: '1.1rem',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                    border: '1px solid #f3f4f6',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#6366f1',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}>
                      {getAvatar(comment.author?.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#111827' }}>
                            {comment.author?.name}
                          </span>
                          {comment.author?._id === post.author?._id && (
                            <span style={{
                              backgroundColor: '#e94560',
                              color: '#fff',
                              fontSize: '0.65rem',
                              fontWeight: '700',
                              padding: '1px 7px',
                              borderRadius: '10px',
                            }}>
                              Author
                            </span>
                          )}
                          <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            disabled={deleting === comment._id}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#d1d5db',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                            onMouseEnter={e => { e.target.style.color = '#e94560'; }}
                            onMouseLeave={e => { e.target.style.color = '#d1d5db'; }}
                          >
                            {deleting === comment._id ? '...' : 'Delete'}
                          </button>
                        )}
                      </div>
                      <p style={{
                        color: '#374151',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        margin: 0,
                        wordBreak: 'break-word',
                      }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '0.92rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#e94560'; e.target.style.color = '#e94560'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#6b7280'; }}
          >
            Back to all stories
          </button>
        </div>

      </div>
    </div>
  );
};

export default SinglePost;