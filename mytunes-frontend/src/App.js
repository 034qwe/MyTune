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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">MyTunes</h1>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <button onClick={() => setCurrentPage('music')} className={`px-4 py-2 rounded-lg transition ${currentPage === 'music' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}>
              Music
            </button>
            <button onClick={() => setCurrentPage('albums')} className={`px-4 py-2 rounded-lg transition ${currentPage === 'albums' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}>
              Albums
            </button>
            <button onClick={() => setCurrentPage('community')} className={`px-4 py-2 rounded-lg transition ${currentPage === 'community' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}>
              Community
            </button>
            {!creator && (
              <button onClick={() => setCurrentPage('become-creator')} className={`px-4 py-2 rounded-lg transition ${currentPage === 'become-creator' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}>
                Become Creator
              </button>
            )}
            {creator && (
              <button onClick={() => setCurrentPage('upload')} className={`px-4 py-2 rounded-lg transition ${currentPage === 'upload' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}>
                Upload
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-gray-300 hidden md:block">{user?.username}</span>
            <button onClick={logout} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition">
              <LogOut className="w-5 h-5 text-gray-300" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-50 backdrop-blur-lg border-t border-white border-opacity-10 px-4 py-4">
            <button onClick={() => { setCurrentPage('music'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white hover:bg-opacity-10 rounded-lg mb-2">
              Music
            </button>
            <button onClick={() => { setCurrentPage('albums'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white hover:bg-opacity-10 rounded-lg mb-2">
              Albums
            </button>
            <button onClick={() => { setCurrentPage('community'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white hover:bg-opacity-10 rounded-lg mb-2">
              Community
            </button>
            {!creator && (
              <button onClick={() => { setCurrentPage('become-creator'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white hover:bg-opacity-10 rounded-lg mb-2">
                Become Creator
              </button>
            )}
            {creator && (
              <button onClick={() => { setCurrentPage('upload'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white hover:bg-opacity-10 rounded-lg">
                Upload
              </button>
            )}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'music' && <MusicPage music={music} token={token} />}
        {currentPage === 'albums' && <AlbumsPage albums={albums} />}
        {currentPage === 'community' && <CommunityPage threads={threads} token={token} fetchThreads={fetchThreads} user={user} />}
        {currentPage === 'become-creator' && <BecomeCreatorPage token={token} setCreator={setCreator} setCurrentPage={setCurrentPage} />}
        {currentPage === 'upload' && <UploadPage token={token} albums={albums} fetchMusic={fetchMusic} />}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Music className="w-12 h-12 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">MyTunes</h1>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-gray-300 hover:text-white transition">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

const BecomeCreatorPage = ({ token, setCreator, setCurrentPage }) => {
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('description', description);
    if (icon) formData.append('icon', icon);

    try {
      const res = await fetch(`${API_URL}/core/creatoradd/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
        body: formData
      });

      if (res.ok) {
        setMessage('✅ You are now a creator!');
        setCreator(true);
        setTimeout(() => {
          setCurrentPage('upload');
        }, 2000);
      } else {
        const data = await res.json();
        setMessage('❌ ' + (data.detail || 'Error creating creator'));
      }
    } catch (err) {
      setMessage('❌ Connection error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Become a Creator</h2>
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Icon (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIcon(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30"
            />
          </div>

          {message && <p className="text-white">{message}</p>}

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            Become Creator
          </button>
        </div>
      </div>
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
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Upload Track</h2>
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Album</label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>{album.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Audio File</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setTune(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30"
            />
          </div>

          {message && <p className="text-white">{message}</p>}

          <button
            onClick={handleUpload}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Track
          </button>
        </div>
      </div>
    </div>
  );
};

const MusicPage = ({ music, token }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">All Music</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {music.map((track) => (
          <div key={track.id} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition">
            <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
            <p className="text-gray-300 mb-4">{track.description}</p>
            <div className="space-y-2">
              <span className="text-sm text-gray-400 block">Album ID: {track.album}</span>
              {track.category && track.category.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {track.category.map((cat, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-600 bg-opacity-50 rounded text-xs text-white">
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
    </div>
  );
};

const AlbumsPage = ({ albums }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Albums</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl overflow-hidden border border-white border-opacity-20 hover:bg-opacity-20 transition">
            {album.cover_album && (
              <img src={`${API_URL}${album.cover_album}`} alt={album.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{album.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{new Date(album.create_time).toLocaleDateString()}</p>
              <div className="space-y-1">
                {album.tracks?.map((track, i) => (
                  <p key={i} className="text-gray-300 text-sm">• {track}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommunityPage = ({ threads, token, fetchThreads, user }) => {
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);

  const createThread = async () => {
    try {
      const res = await fetch(`${API_URL}/comm/threads/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, text })
      });

      if (res.ok) {
        setTitle('');
        setText('');
        setShowCreateThread(false);
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Community</h2>
        <button
          onClick={() => setShowCreateThread(!showCreateThread)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Thread
        </button>
      </div>

      {showCreateThread && (
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 mb-6">
          <input
            type="text"
            placeholder="Thread title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <button
            onClick={createThread}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Post Thread
          </button>
        </div>
      )}

      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread.id}>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-2">{thread.title}</h3>
              <p className="text-gray-300 mb-4">{thread.text}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <button
                  onClick={() => likeThread(thread.id)}
                  className="flex items-center gap-1 hover:text-red-400 transition"
                >
                  <Heart className="w-4 h-4" />
                  {thread.likes}
                </button>
                <button
                  onClick={() => setSelectedThread(selectedThread === thread.id ? null : thread.id)}
                  className="flex items-center gap-1 hover:text-blue-400 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  {thread.comments?.length || 0}
                </button>
                <span>{new Date(thread.time).toLocaleDateString()}</span>
              </div>
            </div>

            {selectedThread === thread.id && (
              <ThreadComments threadId={thread.id} token={token} comments={thread.comments} fetchThreads={fetchThreads} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ThreadComments = ({ threadId, token, comments, fetchThreads }) => {
  const [comment, setComment] = useState('');

  const postComment = async () => {
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
    <div className="ml-8 mt-4 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && postComment()}
          className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={postComment}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {comments && comments.map((c, i) => (
        <div key={i} className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
          <p className="text-gray-300">{c}</p>
        </div>
      ))}
    </div>
  );
};

export default App;