import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const categories = ['All', 'Technology', 'Travel', 'Food', 'Health', 'Business', 'Lifestyle', 'Education', 'Other'];

const getAvatar = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const readTime = (content) => {
  const words = content?.split(' ').length || 0;
  return Math.max(1, Math.ceil(words / 200));
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
        setFiltered(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, category, posts]);

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: 'rgba(233,69,96,0.15)',
            color: '#e94560',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            ✦ Internship Project
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: '800',
            color: '#fff',
            lineHeight: '1.2',
            marginBottom: '1rem',
          }}>
            Ideas worth sharing,<br />
            <span style={{ color: '#e94560' }}>stories worth reading.</span>
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '2rem',
          }}>
            A place to read, write, and deepen your understanding of the world.
          </p>

          {/* Search Bar */}
          <div style={{
            position: 'relative',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            <span style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '1.1rem',
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search posts, topics, authors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 2.8rem',
                borderRadius: '50px',
                border: 'none',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8e8e8',
        position: 'sticky',
        top: '64px',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          gap: '0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '1rem 1.2rem',
                border: 'none',
                borderBottom: category === cat ? '2px solid #e94560' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: category === cat ? '#e94560' : '#6b7280',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: category === cat ? '600' : '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Results count */}
        {!loading && (
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {filtered.length} {filtered.length === 1 ? 'story' : 'stories'} {category !== 'All' ? `in ${category}` : 'available'}
          </p>
        )}

        {loading ? (
          /* Skeleton loader */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{ height: '200px', backgroundColor: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px', marginBottom: '0.8rem', width: '30%' }} />
                  <div style={{ height: '18px', backgroundColor: '#f3f4f6', borderRadius: '6px', marginBottom: '0.5rem' }} />
                  <div style={{ height: '18px', backgroundColor: '#f3f4f6', borderRadius: '6px', width: '70%', marginBottom: '1rem' }} />
                  <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px', width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: '#374151', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No stories found</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
              {search ? `No results for "${search}"` : `No posts in ${category} yet.`}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map(post => (
              <article
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                onMouseEnter={() => setHoveredCard(post._id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: hoveredCard === post._id
                    ? '0 12px 40px rgba(0,0,0,0.12)'
                    : '0 1px 4px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  transform: hoveredCard === post._id ? 'translateY(-4px)' : 'translateY(0)',
                  border: '1px solid #f0f0f0',
                }}
              >
                {/* Cover Image */}
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={e => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: `linear-gradient(135deg, 
                      hsl(${post._id?.charCodeAt(0) * 3 % 360}, 60%, 25%), 
                      hsl(${post._id?.charCodeAt(1) * 5 % 360}, 70%, 40%))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                  }}>
                    {post.category === 'Technology' ? '💻' :
                     post.category === 'Travel' ? '✈️' :
                     post.category === 'Food' ? '🍜' :
                     post.category === 'Health' ? '💪' :
                     post.category === 'Business' ? '📈' :
                     post.category === 'Education' ? '📚' : '✍️'}
                  </div>
                )}

                <div style={{ padding: '1.25rem' }}>
                  {/* Category */}
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#fff0f3',
                    color: '#e94560',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: '0.65rem 0 0.4rem',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.55',
                    marginBottom: '1.1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.excerpt}
                  </p>

                  {/* Author row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '0.9rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {/* Avatar */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#e94560',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        flexShrink: 0,
                      }}>
                        {getAvatar(post.author?.name)}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                          {post.author?.name}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: 0 }}>
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      backgroundColor: '#f9fafb',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}>
                      {readTime(post.content)} min read
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;