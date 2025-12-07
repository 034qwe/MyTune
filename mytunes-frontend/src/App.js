import React, { useState, useEffect } from 'react';
import { Music, User, Album, Heart, MessageCircle, Plus, Upload, LogOut, Menu, X, Send, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('music');
  const [music, setMusic] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [threads, setThreads] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchMusic();
      fetchAlbums();
      fetchThreads();
      checkCreator();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/users/me/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkCreator = async () => {
    try {
      const res = await fetch(`${API_URL}/core/mymusic/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setCreator(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMusic = async () => {
    try {
      const res = await fetch(`${API_URL}/core/music/`);
      const data = await res.json();
      setMusic(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch(`${API_URL}/core/albums/`);
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchThreads = async () => {
    try {
      const res = await fetch(`${API_URL}/comm/threads/`);
      const data = await res.json();
      setThreads(data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCreator(null);
    localStorage.removeItem('token');
  };

  if (!token) {
    return <AuthPage setToken={setToken} />;
  }

  return (
    <div className="min-h-screen xp-desktop">
      <header className="xp-taskbar">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="xp-start-button">
              <Music className="w-5 h-5 text-white inline mr-2" />
              <span className="font-bold text-white">MyTunes</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-2">
            <button onClick={() => setCurrentPage('music')} className={`xp-nav-button ${currentPage === 'music' ? 'xp-nav-button-active' : ''}`}>
              Music
            </button>
            <button onClick={() => setCurrentPage('albums')} className={`xp-nav-button ${currentPage === 'albums' ? 'xp-nav-button-active' : ''}`}>
              Albums
            </button>
            <button onClick={() => setCurrentPage('community')} className={`xp-nav-button ${currentPage === 'community' ? 'xp-nav-button-active' : ''}`}>
              Community
            </button>
            {!creator && (
              <button onClick={() => setCurrentPage('become-creator')} className={`xp-nav-button ${currentPage === 'become-creator' ? 'xp-nav-button-active' : ''}`}>
                Become Creator
              </button>
            )}
            {creator && (
              <button onClick={() => setCurrentPage('upload')} className={`xp-nav-button ${currentPage === 'upload' ? 'xp-nav-button-active' : ''}`}>
                Upload
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-white hidden md:block font-bold">{user?.username}</span>
            <button onClick={logout} className="xp-button-small">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="xp-window">
          <div className="xp-window-title">
            <span className="font-bold">
              {currentPage === 'music' && '🎵 All Music'}
              {currentPage === 'albums' && '💿 Albums'}
              {currentPage === 'community' && '💬 Community'}
              {currentPage === 'become-creator' && '⭐ Become Creator'}
              {currentPage === 'upload' && '📤 Upload Track'}
            </span>
            <div className="xp-window-controls">
              <span className="xp-control">_</span>
              <span className="xp-control">□</span>
              <span className="xp-control">✕</span>
            </div>
          </div>
          <div className="xp-window-content">
            {currentPage === 'music' && <MusicPage music={music} token={token} />}
            {currentPage === 'albums' && <AlbumsPage albums={albums} token={token} fetchAlbums={fetchAlbums} />}
            {currentPage === 'community' && <CommunityPage threads={threads} token={token} fetchThreads={fetchThreads} user={user} />}
            {currentPage === 'become-creator' && <BecomeCreatorPage token={token} setCreator={setCreator} setCurrentPage={setCurrentPage} />}
            {currentPage === 'upload' && <UploadPage token={token} albums={albums} fetchMusic={fetchMusic} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const AuthPage = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/auth/token/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.auth_token) {
          localStorage.setItem('token', data.auth_token);
          setToken(data.auth_token);
        } else {
          setError('Invalid credentials');
        }
      } else {
        const res = await fetch(`${API_URL}/auth/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          setIsLogin(true);
          setError('Account created! Please login.');
        } else {
          const data = await res.json();
          setError(data.username?.[0] || data.password?.[0] || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen xp-desktop flex items-center justify-center p-4">
      <div className="xp-window" style={{ width: '400px' }}>
        <div className="xp-window-title">
          <span className="font-bold">🎵 MyTunes Login</span>
          <div className="xp-window-controls">
            <span className="xp-control">_</span>
            <span className="xp-control">□</span>
            <span className="xp-control">✕</span>
          </div>
        </div>
        <div className="xp-window-content">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Music className="w-12 h-12 text-blue-700" />
            <h1 className="text-3xl font-bold text-blue-900">MyTunes</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">Username:</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="xp-input"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">Password:</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="xp-input"
              />
            </div>
            
            {error && (
              <div className="xp-message xp-message-error">
                {error}
              </div>
            )}

            <button onClick={handleSubmit} className="xp-button w-full">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>

          <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-blue-700 hover:text-blue-900 font-bold text-sm underline">
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

const BecomeCreatorPage = ({ token, setCreator, setCurrentPage }) => {
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nickname || !description) {
      setMessage('❌ Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('description', description);
    if (icon) {
      formData.append('icon', icon);
    }

    try {
      const res = await fetch(`${API_URL}/core/creatoradd/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Token ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ You are now a creator!');
        setCreator(true);
        setTimeout(() => {
          setCurrentPage('upload');
          window.location.reload();
        }, 1500);
      } else {
        let errorMsg = '❌ ';
        if (data.detail) {
          errorMsg += data.detail;
        } else if (data.nickname) {
          errorMsg += `Nickname: ${data.nickname[0]}`;
        } else if (data.description) {
          errorMsg += `Description: ${data.description[0]}`;
        } else {
          errorMsg += 'Error creating creator profile';
        }
        setMessage(errorMsg);
      }
    } catch (err) {
      setMessage('❌ Connection error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="xp-panel">
        <label className="block text-sm font-bold mb-2 text-gray-700">Nickname: *</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Your creator name"
          className="xp-input"
          disabled={loading}
        />
      </div>

      <div className="xp-panel">
        <label className="block text-sm font-bold mb-2 text-gray-700">Description: *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about yourself and your music"
          rows="4"
          className="xp-input"
          disabled={loading}
        />
      </div>

      <div className="xp-panel">
        <label className="block text-sm font-bold mb-2 text-gray-700">Profile Icon (optional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIcon(e.target.files[0])}
          className="xp-file-input"
          disabled={loading}
        />
        {icon && (
          <p className="text-sm text-gray-700 mt-2">📷 Selected: {icon.name}</p>
        )}
      </div>

      {message && (
        <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="xp-button w-full"
      >
        {loading ? 'Creating...' : '⭐ Become Creator'}
      </button>
    </div>
  );
};

const UploadPage = ({ token, albums, fetchMusic }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [tune, setTune] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!tune) {
      setMessage('❌ Please select an audio file');
      return;
    }

    if (!albumId) {
      setMessage('❌ Please select an album');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('album', albumId);
    formData.append('tune', tune);

    try {
      const res = await fetch(`${API_URL}/core/music/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
        body: formData
      });

      if (res.ok) {
        setMessage('✅ Track uploaded successfully!');
        setTitle('');
        setDescription('');
        setTune(null);
        document.querySelector('input[type="file"]').value = '';
        fetchMusic();
      } else {
        const data = await res.json();
        setMessage('❌ Upload failed: ' + JSON.stringify(data));
      }
    } catch (err) {
      setMessage('❌ Connection error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="xp-panel">
        <label className="block text-sm font-bold mb-2 text-gray-700">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="xp-input"
        />
      </div>

      <div className="xp-panel">
        <label className="block text-sm font-bold mb-2 text-gray-700">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="xp-input"
        />
      </div>

      <div className="xp-panel">
        <label className="block text-sm font-bold mb-2 text-gray-700">Album:</label>
        <select
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="xp-input"
        >
          <option value="">Select Album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>{album.name}</option>
          ))}
        </select>
      </div>

      <div className="xp-panel">
        <label className="block text-sm font-bold mb-2 text-gray-700">Audio File:</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setTune(e.target.files[0])}
          className="xp-file-input"
        />
      </div>

      {message && (
        <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleUpload}
        className="xp-button w-full"
      >
        📤 Upload Track
      </button>
    </div>
  );
};

const MusicPage = ({ music }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {music.map((track) => (
        <div key={track.id} className="xp-panel">
          <h3 className="text-lg font-bold text-blue-900 mb-2">{track.title}</h3>
          <p className="text-gray-700 mb-3 text-sm">{track.description}</p>
          <div className="space-y-2">
            <span className="text-xs text-gray-600 block">Album ID: {track.album}</span>
            {track.category && track.category.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {track.category.map((cat, i) => (
                  <span key={i} className="xp-badge">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <audio controls className="w-full mt-2">
              <source src={`${API_URL}${track.tune}`} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      ))}
    </div>
  );
};

const AlbumsPage = ({ albums, token, fetchAlbums }) => {
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumCover, setAlbumCover] = useState(null);
  const [message, setMessage] = useState('');

  const createAlbum = async () => {
    if (!albumName) {
      setMessage('❌ Please enter album name');
      return;
    }

    const formData = new FormData();
    formData.append('name', albumName);
    if (albumCover) {
      formData.append('cover_album', albumCover);
    }

    try {
      const res = await fetch(`${API_URL}/core/albums/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
        body: formData
      });

      if (res.ok) {
        setMessage('✅ Album created!');
        setAlbumName('');
        setAlbumCover(null);
        setShowCreateAlbum(false);
        fetchAlbums();
      } else {
        const data = await res.json();
        setMessage('❌ ' + (data.detail || 'Error creating album'));
      }
    } catch (err) {
      setMessage('❌ Connection error');
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setShowCreateAlbum(!showCreateAlbum)}
          className="xp-button"
        >
          ➕ New Album
        </button>
      </div>

      {showCreateAlbum && (
        <div className="xp-panel mb-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Album name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              className="xp-input"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAlbumCover(e.target.files[0])}
              className="xp-file-input"
            />
            {message && (
              <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>
                {message}
              </div>
            )}
            <button
              onClick={createAlbum}
              className="xp-button w-full"
            >
              Create Album
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div key={album.id} className="xp-panel">
            {album.cover_album && (
              <img 
                src={`${API_URL}${album.cover_album}`} 
                alt={album.name} 
                className="w-full h-32 object-cover mb-3 border-2 border-gray-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <h3 className="text-lg font-bold text-blue-900 mb-1">{album.name}</h3>
            <p className="text-gray-600 text-sm mb-2">📅 {new Date(album.create_time).toLocaleDateString()}</p>
            <div className="space-y-1">
              <p className="text-gray-700 text-sm font-bold">Tracks:</p>
              {album.tracks && album.tracks.length > 0 ? (
                album.tracks.map((track, i) => (
                  <p key={i} className="text-gray-700 text-xs">• {track}</p>
                ))
              ) : (
                <p className="text-gray-500 text-xs italic">No tracks yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommunityPage = ({ threads, token, fetchThreads, user }) => {
  const [showNewThread, setShowNewThread] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadText, setThreadText] = useState('');
  const [message, setMessage] = useState('');
  const [expandedThread, setExpandedThread] = useState(null);

  const createThread = async () => {
    if (!threadTitle || !threadText) {
      setMessage('❌ Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/comm/threads/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: threadTitle, text: threadText })
      });

      if (res.ok) {
        setMessage('✅ Thread created!');
        setThreadTitle('');
        setThreadText('');
        setShowNewThread(false);
        fetchThreads();
      } else {
        setMessage('❌ Failed to create thread');
      }
    } catch (err) {
      setMessage('❌ Connection error');
    }
  };

  const likeThread = async (threadId) => {
    try {
      const res = await fetch(`${API_URL}/comm/ThreadLike/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ where: threadId })
      });

      if (res.ok) {
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <button
          onClick={() => setShowNewThread(!showNewThread)}
          className="xp-button"
        >
          ➕ New Thread
        </button>
      </div>

      {showNewThread && (
        <div className="xp-panel mb-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">Title:</label>
              <input
                type="text"
                placeholder="Thread title"
                value={threadTitle}
                onChange={(e) => setThreadTitle(e.target.value)}
                className="xp-input"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">Message:</label>
              <textarea
                placeholder="What's on your mind?"
                value={threadText}
                onChange={(e) => setThreadText(e.target.value)}
                rows="4"
                className="xp-input"
              />
            </div>
            {message && (
              <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>
                {message}
              </div>
            )}
            <button
              onClick={createThread}
              className="xp-button w-full"
            >
              Create Thread
            </button>
          </div>
        </div>
      )}

      {threads.map((thread) => (
        <div key={thread.id} className="xp-panel">
          <h3 className="text-lg font-bold text-blue-900 mb-2">{thread.title}</h3>
          <p className="text-gray-700 text-sm mb-3">{thread.text}</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <button
              onClick={() => likeThread(thread.id)}
              className="xp-button-small flex items-center gap-1"
            >
              <Heart className="w-3 h-3" />
              {thread.likes}
            </button>
            <button
              onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
              className="xp-button-small flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              {thread.comments?.length || 0}
            </button>
          </div>
          {expandedThread === thread.id && (
            <ThreadComments threadId={thread.id} token={token} comments={thread.comments} fetchThreads={fetchThreads} />
          )}
        </div>
      ))}
    </div>
  );
};

const ThreadComments = ({ threadId, token, comments, fetchThreads }) => {
  const [comment, setComment] = useState('');

  const postComment = async () => {
    if (!comment) return;

    try {
      const res = await fetch(`${API_URL}/comm/comments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment, about_w: threadId })
      });

      if (res.ok) {
        setComment('');
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 pl-6 space-y-3 border-l-4 border-blue-300">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && postComment()}
          className="xp-input text-xs"
          style={{ fontSize: '12px' }}
        />
        <button
          onClick={postComment}
          className="xp-button-small"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>

      {comments && comments.map((c, i) => (
        <div key={i} className="xp-panel text-xs" style={{ padding: '8px' }}>
          <p className="text-gray-700">{c}</p>
        </div>
      ))}
    </div>
  );
};

export default App;