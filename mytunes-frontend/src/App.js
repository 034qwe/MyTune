
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Music, User, Album, Heart, MessageCircle, Plus, Upload, LogOut, Menu, X, Send, Trash2, Shield, MessageSquare, Users, ArrowLeft } from 'lucide-react';
const GOOGLE_CLIENT_ID = '380478908778-rfs17kjgg22bodftoe39vnqllmgfeeab.apps.googleusercontent.com';

const API_URL = 'http://localhost:8000';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setUser(data);
    } catch (err) { console.error(err); }
  };

  const checkCreator = async () => {
    try {
      const res = await fetch(`${API_URL}/core/mymusic/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { logout(); return; }
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setCreator(true);
      }
    } catch (err) { console.error(err); }
  };

  const fetchMusic = async () => {
    try {
      const res = await fetch(`${API_URL}/core/music/`);
      const data = await res.json();
      setMusic(data);
    } catch (err) { console.error(err); }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch(`${API_URL}/core/albums/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.status === 401) { logout(); return; }
      if (res.ok) {
        const data = await res.json();
        setAlbums(Array.isArray(data) ? data : []);
      } else {
        setAlbums([]);
      }
    } catch (err) { setAlbums([]); }
  };

  const fetchThreads = async () => {
    try {
      const res = await fetch(`${API_URL}/comm/threads/`);
      const data = await res.json();
      setThreads(data);
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCreator(null);
    localStorage.removeItem('token');
  };

  if (!token) return <AuthPage setToken={setToken} />;

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
          <nav className="hidden md:flex gap-2 flex-wrap">
            <button onClick={() => navigate('/music')} className={`xp-nav-button ${location.pathname === '/music' || location.pathname === '/' ? 'xp-nav-button-active' : ''}`}>Music</button>
            <button onClick={() => navigate('/albums')} className={`xp-nav-button ${location.pathname === '/albums' ? 'xp-nav-button-active' : ''}`}>Albums</button>
            <button onClick={() => navigate('/community')} className={`xp-nav-button ${location.pathname === '/community' ? 'xp-nav-button-active' : ''}`}>Community</button>
            <button onClick={() => navigate('/messages')} className={`xp-nav-button ${location.pathname.startsWith('/messages') ? 'xp-nav-button-active' : ''}`}>
              <MessageSquare className="w-4 h-4 inline mr-1" />Messages
            </button>
            <button onClick={() => navigate('/profile')} className={`xp-nav-button ${location.pathname === '/profile' ? 'xp-nav-button-active' : ''}`}>Profile</button>
            {!creator && (
              <button onClick={() => navigate('/become-creator')} className={`xp-nav-button ${location.pathname === '/become-creator' ? 'xp-nav-button-active' : ''}`}>Become Creator</button>
            )}
            {creator && (
              <button onClick={() => navigate('/upload')} className={`xp-nav-button ${location.pathname === '/upload' ? 'xp-nav-button-active' : ''}`}>Upload</button>
            )}
            {user?.is_staff && (
              <button onClick={() => navigate('/admin')} className={`xp-nav-button ${location.pathname === '/admin' ? 'xp-nav-button-active' : ''}`}>
                <Shield className="w-4 h-4 inline mr-1" />Admin
              </button>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-white hidden md:block font-bold">{user?.username}</span>
            <button onClick={logout} className="xp-button-small"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="xp-window">
          <div className="xp-window-title">
            <span className="font-bold">
              <Routes>
                <Route path="/music" element="🎵 All Music" />
                <Route path="/albums" element="💿 Albums" />
                <Route path="/community" element="💬 Community" />
                <Route path="/messages" element="✉️ Messages" />
                <Route path="/profile" element="👤 My Profile" />
                <Route path="/become-creator" element="⭐ Become Creator" />
                <Route path="/upload" element="📤 Upload Track" />
                <Route path="/admin" element="🛡️ Admin Panel" />
                <Route path="*" element="🎵 MyTunes" />
              </Routes>
            </span>
            <div className="xp-window-controls">
              <span className="xp-control">_</span>
              <span className="xp-control">□</span>
              <span className="xp-control">✕</span>
            </div>
          </div>
          <div className="xp-window-content">
            <Routes>
              <Route path="/" element={<Navigate to="/music" replace />} />
              <Route path="/music" element={<MusicPage music={music} token={token} />} />
              <Route path="/albums" element={<AlbumsPage albums={albums} token={token} fetchAlbums={fetchAlbums} logout={logout} />} />
              <Route path="/community" element={<CommunityPage threads={threads} token={token} fetchThreads={fetchThreads} user={user} logout={logout} />} />
              <Route path="/messages" element={<MessagesPage token={token} user={user} logout={logout} />} />
              <Route path="/profile" element={<ProfilePage token={token} user={user} logout={logout} />} />
              <Route path="/become-creator" element={<BecomeCreatorPage token={token} setCreator={setCreator} navigate={navigate} logout={logout} />} />
              <Route path="/upload" element={<UploadPage token={token} fetchMusic={fetchMusic} logout={logout} />} />
              <Route path="/admin" element={<AdminPage token={token} logout={logout} />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

// ─────────────────────────────────────────────
// MESSAGES PAGE
// ─────────────────────────────────────────────
const MessagesPage = ({ token, user, logout }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoom, setActiveRoom] = useState(null);        // { name, otherUser }
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [wsStatus, setWsStatus] = useState('disconnected'); // 'connecting' | 'connected' | 'disconnected' | 'error'
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) { logout(); return; }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [token]);

  // Fetch all registered users
  // Connect WebSocket when activeRoom changes
  useEffect(() => {
    if (!activeRoom) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setMessages([]);
    setWsStatus('connecting');

    // Load history first
    const loadHistory = async () => {
      try {
        const res = await fetch(
          `${API_URL}/messanger/history/${activeRoom.name}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(
            data.map(msg => ({
              id: msg.id,
              text: msg.text,
              user_email: msg.user.email,
              created_at: msg.created_at,
              isMine: msg.user.email === user?.email,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };

    loadHistory();

    // Then connect WebSocket for live messages
    const ws = new WebSocket(
      `ws://localhost:8000/ws/messanger/${activeRoom.name}/?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('connected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          setMessages(prev => {
            const alreadyExists = prev.some(
              m => m.created_at === data.created_at && m.user_email === data.user_email
            );
            if (alreadyExists) return prev;
            return [...prev, {
              id: Date.now(),
              text: data.message,
              user_email: data.user_email,
              created_at: data.created_at,
              isMine: data.user_email === user?.email,
            }];
          });
        }
      } catch (err) {
        console.error('WS message parse error:', err);
      }
    };

    ws.onerror = () => setWsStatus('error');
    ws.onclose = () => setWsStatus('disconnected');

    return () => { ws.close(); };
  }, [activeRoom]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ message: text }));
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Build a deterministic room name from two user emails
  const getRoomName = (emailA, emailB) => {
    const sorted = [emailA, emailB].sort();
    // Sanitize: replace non-alphanumeric chars with underscores
    return sorted.map(e => e.replace(/[^a-zA-Z0-9]/g, '_')).join('__');
  };

  const openChat = (otherUser) => {
    if (!user?.email) return;
    const roomName = getRoomName(user.email, otherUser.email);
    setActiveRoom({ name: roomName, otherUser });
  };

  const closeChat = () => {
    if (wsRef.current) wsRef.current.close();
    setActiveRoom(null);
    setMessages([]);
    setWsStatus('disconnected');
  };

  const filteredUsers = users.filter(u =>
    u.email !== user?.email &&
    (
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.last_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const statusColors = {
    connected: '#00AA00',
    connecting: '#CC8800',
    disconnected: '#888',
    error: '#CC0000',
  };

  const statusLabels = {
    connected: '🟢 Connected',
    connecting: '🟡 Connecting...',
    disconnected: '⚫ Disconnected',
    error: '🔴 Error',
  };

  // ── Active chat view ──
  if (activeRoom) {
    return (
      <div className="flex flex-col" style={{ height: '600px' }}>
        {/* Chat header */}
        <div className="xp-panel flex items-center gap-3 mb-3" style={{ padding: '10px 14px' }}>
          <button onClick={closeChat} className="xp-button-small flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex-1">
            <span className="font-bold text-blue-900 text-base">
              💬 {activeRoom.otherUser.first_name || activeRoom.otherUser.email}
              {activeRoom.otherUser.last_name ? ` ${activeRoom.otherUser.last_name}` : ''}
            </span>
            <span className="ml-3 text-xs text-gray-500">{activeRoom.otherUser.email}</span>
          </div>
          <span className="text-xs font-bold" style={{ color: statusColors[wsStatus] }}>
            {statusLabels[wsStatus]}
          </span>
        </div>

        {wsStatus === 'error' && (
          <div className="xp-message xp-message-error mb-3">
            ❌ Could not connect to chat. Make sure the WebSocket server is running at ws://localhost:8000.
          </div>
        )}

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto space-y-2 p-3 mb-3"
          style={{
            background: 'linear-gradient(135deg, #F0EFE7 0%, #E8E5D0 100%)',
            border: '2px solid',
            borderColor: '#7F9DB9 #E0E9F5 #E0E9F5 #7F9DB9',
            borderRadius: '3px',
            minHeight: 0,
          }}
        >
          {messages.length === 0 && wsStatus === 'connected' && (
            <div className="text-center text-gray-500 text-sm mt-8">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-400" />
              <p>No messages yet. Say hello! 👋</p>
            </div>
          )}
          {messages.length === 0 && wsStatus === 'connecting' && (
            <div className="text-center text-gray-500 text-sm mt-8">
              <div className="xp-loading mx-auto mb-2"></div>
              <p>Connecting to chat room...</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: '3px',
                  border: '2px solid',
                  ...(msg.isMine
                    ? {
                        background: 'linear-gradient(135deg, #D0E8FF 0%, #B8D8FF 100%)',
                        borderColor: '#7FB8FF #C8E0FF #C8E0FF #7FB8FF',
                      }
                    : {
                        background: 'linear-gradient(135deg, #FEFEFE 0%, #F5F3EA 100%)',
                        borderColor: '#D4D0C8 #FEFEFE #FEFEFE #D4D0C8',
                      }),
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                {!msg.isMine && (
                  <p className="text-xs font-bold text-blue-700 mb-1">{msg.user_email}</p>
                )}
                <p className="text-sm text-gray-800" style={{ wordBreak: 'break-word' }}>{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={wsStatus === 'connected' ? 'Type a message... (Enter to send)' : 'Waiting for connection...'}
            className="xp-input flex-1"
            disabled={wsStatus !== 'connected'}
          />
          <button
            onClick={sendMessage}
            className="xp-button flex items-center gap-2"
            disabled={wsStatus !== 'connected' || !inputText.trim()}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    );
  }

  // ── User list view ──
  return (
    <div className="space-y-4">
      <div className="xp-panel" style={{ padding: '12px 16px' }}>
        <h2 className="text-lg font-bold text-blue-900 mb-1">✉️ Messages</h2>
        <p className="text-sm text-gray-600">Select a user to start a private conversation.</p>
      </div>

      {/* Search */}
      <div className="xp-panel" style={{ padding: '12px 16px' }}>
        <label className="block text-sm font-bold mb-2 text-gray-700">
          <Users className="w-4 h-4 inline mr-1" />Search users:
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="xp-input"
        />
      </div>

      {/* User list */}
      {loadingUsers ? (
        <div className="text-center py-8">
          <div className="xp-loading mx-auto mb-3"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="xp-panel text-center py-8">
          <Users className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600">
            {searchQuery ? 'No users found matching your search.' : 'No other users registered yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="xp-panel flex items-center gap-3 cursor-pointer"
              style={{ padding: '12px' }}
              onClick={() => openChat(u)}
            >
              {/* Avatar */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded flex items-center justify-center font-bold text-white text-lg"
                style={{
                  background: `linear-gradient(135deg, hsl(${(u.id * 47) % 360}, 60%, 45%), hsl(${(u.id * 47 + 40) % 360}, 70%, 35%))`,
                }}
              >
                {(u.first_name?.[0] || u.email[0]).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-blue-900 text-sm truncate">
                  {u.first_name || u.last_name
                    ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                    : u.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                {u.is_staff && (
                  <span className="xp-badge text-xs mt-1 inline-block">Admin</span>
                )}
              </div>

              {/* Chat icon */}
              <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// AUTH PAGE
// ─────────────────────────────────────────────
const AuthPage = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };
    loadGoogleScript();
    return () => {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse, auto_select: false });
      window.google.accounts.id.renderButton(document.getElementById('googleSignInButton'), { theme: 'outline', size: 'large', width: 350, text: 'continue_with' });
    }
  };

  const handleGoogleResponse = async (response) => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/google-auth/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: response.credential }) });
      const data = await res.json();
      if (data.status && data.tokens) { localStorage.setItem('token', data.tokens.access); setToken(data.tokens.access); }
      else setError(data.error || 'Google authentication failed');
    } catch (err) { setError('Connection error during Google authentication'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/api/token/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (data.access) { localStorage.setItem('token', data.access); setToken(data.access); }
        else setError('Invalid credentials');
      } else {
        const res = await fetch(`${API_URL}/api/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        if (res.ok) { setIsLogin(true); setError('Account created! Please login.'); }
        else { const data = await res.json(); setError(data.email?.[0] || data.password?.[0] || data.error || 'Registration failed'); }
      }
    } catch (err) { setError('Connection error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen xp-desktop flex items-center justify-center p-4">
      <div className="xp-window" style={{ width: '400px' }}>
        <div className="xp-window-title">
          <span className="font-bold">🎵 MyTunes Login</span>
          <div className="xp-window-controls"><span className="xp-control">_</span><span className="xp-control">□</span><span className="xp-control">✕</span></div>
        </div>
        <div className="xp-window-content">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Music className="w-12 h-12 text-blue-700" />
            <h1 className="text-3xl font-bold text-blue-900">MyTunes</h1>
          </div>
          <div className="mb-4"><div id="googleSignInButton" className="flex justify-center" style={{ minHeight: '44px' }}></div></div>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-gray-400"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold">OR</span></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">Email:</label>
              <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()} className="xp-input" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">Password:</label>
              <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()} className="xp-input" disabled={loading} />
            </div>
            {error && <div className={`xp-message ${error.includes('created') ? 'xp-message-success' : 'xp-message-error'}`}>{error}</div>}
            <button onClick={handleSubmit} className="xp-button w-full" disabled={loading}>{loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}</button>
          </div>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="w-full mt-4 text-blue-700 hover:text-blue-900 font-bold text-sm underline" disabled={loading}>
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BECOME CREATOR
// ─────────────────────────────────────────────
const BecomeCreatorPage = ({ token, setCreator, navigate, logout }) => {
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nickname || !description) { setMessage('❌ Please fill in all required fields'); return; }
    setLoading(true); setMessage('');
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('description', description);
    if (icon) formData.append('icon', icon);
    try {
      const res = await fetch(`${API_URL}/core/creatoradd/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ You are now a creator!'); setCreator(true);
        setTimeout(() => { navigate('/upload'); window.location.reload(); }, 1500);
      } else {
        setMessage('❌ ' + (data.detail || data.nickname?.[0] || data.description?.[0] || 'Error creating creator profile'));
      }
    } catch (err) { setMessage('❌ Connection error.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Nickname: *</label><input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Your creator name" className="xp-input" disabled={loading} /></div>
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Description: *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about yourself and your music" rows="4" className="xp-input" disabled={loading} /></div>
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Profile Icon (optional):</label><input type="file" accept="image/*" onChange={(e) => setIcon(e.target.files[0])} className="xp-file-input" disabled={loading} />{icon && <p className="text-sm text-gray-700 mt-2">📷 Selected: {icon.name}</p>}</div>
      {message && <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>{message}</div>}
      <button onClick={handleSubmit} disabled={loading} className="xp-button w-full">{loading ? 'Creating...' : '⭐ Become Creator'}</button>
    </div>
  );
};

// ─────────────────────────────────────────────
// UPLOAD PAGE
// ─────────────────────────────────────────────
const UploadPage = ({ token, fetchMusic, logout }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [tune, setTune] = useState(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [myAlbums, setMyAlbums] = useState([]);

  useEffect(() => { fetchCategories(); fetchMyAlbums(); }, []);

  const fetchMyAlbums = async () => {
    try {
      const res = await fetch(`${API_URL}/core/myalbums/`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.status === 401) { logout(); return; }
      if (res.ok) { const data = await res.json(); setMyAlbums(data); }
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/core/categories/`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setCategories(data); }
    } catch (err) { console.error(err); }
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(selectedCategories.includes(catId) ? selectedCategories.filter(id => id !== catId) : [...selectedCategories, catId]);
  };

  const handleUpload = async () => {
    if (!tune) { setMessage('❌ Please select an audio file'); return; }
    if (!albumId) { setMessage('❌ Please select an album'); return; }
    const formData = new FormData();
    formData.append('title', title); formData.append('description', description); formData.append('album', albumId); formData.append('tune', tune);
    selectedCategories.forEach(catId => formData.append('category_ids', catId));
    try {
      const res = await fetch(`${API_URL}/core/music/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (res.status === 401) { logout(); return; }
      if (res.ok) {
        setMessage('✅ Track uploaded successfully!');
        setTitle(''); setDescription(''); setTune(null); setSelectedCategories([]);
        document.querySelector('input[type="file"]').value = '';
        fetchMusic();
      } else { const data = await res.json(); setMessage('❌ Upload failed: ' + JSON.stringify(data)); }
    } catch (err) { setMessage('❌ Connection error'); }
  };

  return (
    <div className="space-y-4">
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="xp-input" /></div>
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Description:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="xp-input" /></div>
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Categories:</label><div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">{categories.length === 0 ? <p className="text-xs text-gray-500">No categories available</p> : categories.map(cat => (<label key={cat.id} className="flex items-center gap-1 text-sm bg-white px-2 py-1 rounded border border-gray-300 cursor-pointer"><input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />{cat.cat_name}</label>))}</div></div>
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Album:</label><select value={albumId} onChange={(e) => setAlbumId(e.target.value)} className="xp-input"><option value="">Select Album</option>{myAlbums.map((album) => (<option key={album.id} value={album.id}>{album.name}</option>))}</select></div>
      <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Audio File:</label><input type="file" accept="audio/*" onChange={(e) => setTune(e.target.files[0])} className="xp-file-input" /></div>
      {message && <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>{message}</div>}
      <button onClick={handleUpload} className="xp-button w-full">📤 Upload Track</button>
    </div>
  );
};

// ─────────────────────────────────────────────
// MUSIC PAGE
// ─────────────────────────────────────────────
const MusicPage = ({ music }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {music.map((track) => (
      <div key={track.id} className="xp-panel">
        <h3 className="text-lg font-bold text-blue-900 mb-2">{track.title}</h3>
        <p className="text-gray-700 mb-3 text-sm">{track.description}</p>
        <div className="space-y-2">
          <span className="text-xs text-gray-600 block">Album ID: {track.album}</span>
          {track.category && track.category.length > 0 && (
            <div className="flex gap-2 flex-wrap">{track.category.map((cat, i) => <span key={i} className="xp-badge">{cat}</span>)}</div>
          )}
          <audio controls className="w-full mt-2"><source src={`${String(track.tune).startsWith('http') ? track.tune : API_URL + track.tune}`} /></audio>
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// ALBUMS PAGE
// ─────────────────────────────────────────────
const AlbumsPage = ({ albums, token, fetchAlbums, logout }) => {
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumCover, setAlbumCover] = useState(null);
  const [release, setRelease] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createAlbum = async () => {
    if (!albumName) { setMessage('❌ Please enter album name'); return; }
    setLoading(true); setMessage('');
    const formData = new FormData();
    formData.append('name', albumName); formData.append('release', release);
    if (albumCover) formData.append('cover_album', albumCover);
    try {
      const res = await fetch(`${API_URL}/core/albums/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (res.status === 401) { logout(); return; }
      if (res.ok) {
        setMessage('✅ Album created!'); setAlbumName(''); setAlbumCover(null); setRelease(false); setShowCreateAlbum(false);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        fetchAlbums();
      } else { const data = await res.json(); setMessage('❌ ' + (data.detail || data.name?.[0] || 'Error creating album')); }
    } catch (err) { setMessage('❌ Connection error'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="mb-4"><button onClick={() => setShowCreateAlbum(!showCreateAlbum)} className="xp-button">➕ New Album</button></div>
      {showCreateAlbum && (
        <div className="xp-panel mb-4">
          <div className="space-y-3">
            <div><label className="block text-sm font-bold mb-1 text-gray-700">Album Name: *</label><input type="text" placeholder="Enter album name" value={albumName} onChange={(e) => setAlbumName(e.target.value)} className="xp-input" disabled={loading} /></div>
            <div><label className="block text-sm font-bold mb-1 text-gray-700">Album Cover:</label><input type="file" accept="image/*" onChange={(e) => setAlbumCover(e.target.files[0])} className="xp-file-input" disabled={loading} />{albumCover && <p className="text-sm text-gray-700 mt-2">📷 Selected: {albumCover.name}</p>}</div>
            <div className="flex items-center gap-2"><input type="checkbox" id="release-checkbox" checked={release} onChange={(e) => setRelease(e.target.checked)} className="w-4 h-4" disabled={loading} /><label htmlFor="release-checkbox" className="text-sm font-bold text-gray-700">Release album publicly</label></div>
            {message && <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>{message}</div>}
            <button onClick={createAlbum} disabled={loading} className="xp-button w-full">{loading ? 'Creating...' : '💿 Create Album'}</button>
          </div>
        </div>
      )}
      {albums.length === 0 ? (
        <div className="xp-panel text-center py-8"><p className="text-gray-600">No albums available yet. Create your first album!</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="xp-panel">
              {album.cover_album && <img src={`${String(album.cover_album).startsWith('http') ? album.cover_album : API_URL + album.cover_album}`} alt={album.name} className="w-full h-48 object-cover mb-3 border-2 border-gray-400" onError={(e) => { e.target.style.display = 'none'; }} />}
              <h3 className="text-lg font-bold text-blue-900 mb-1">{album.name}</h3>
              <p className="text-gray-600 text-sm mb-2">📅 {new Date(album.create_time).toLocaleDateString()}</p>
              {album.release && <span className="xp-badge mb-2 inline-block">🌐 Released</span>}
              <div className="space-y-1 mt-2">
                <p className="text-gray-700 text-sm font-bold">Tracks ({album.tracks?.length || 0}):</p>
                {album.tracks && album.tracks.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {album.tracks.map((track, i) => (
                      <div key={track.id || i} className="border-b border-gray-300 pb-2 last:border-0">
                        <p className="text-gray-700 text-xs">{i + 1}. {track.title}</p>
                        <audio controls className="w-full mt-1" style={{ height: '28px' }}><source src={`${String(track.tune).startsWith('http') ? track.tune : API_URL + track.tune}`} /></audio>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-xs italic">No tracks yet</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// COMMUNITY PAGE
// ─────────────────────────────────────────────
const CommunityPage = ({ threads, token, fetchThreads, user, logout }) => {
  const [showNewThread, setShowNewThread] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadText, setThreadText] = useState('');
  const [message, setMessage] = useState('');
  const [expandedThread, setExpandedThread] = useState(null);

  const createThread = async () => {
    if (!threadTitle || !threadText) { setMessage('❌ Please fill in all fields'); return; }
    try {
      const res = await fetch(`${API_URL}/comm/threads/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: threadTitle, text: threadText }) });
      if (res.status === 401) { logout(); return; }
      if (res.ok) { setMessage('✅ Thread created!'); setThreadTitle(''); setThreadText(''); setShowNewThread(false); fetchThreads(); }
      else setMessage('❌ Failed to create thread');
    } catch (err) { setMessage('❌ Connection error'); }
  };

  const likeThread = async (threadId) => {
    try {
      const res = await fetch(`${API_URL}/comm/ThreadLike/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ where: threadId }) });
      if (res.status === 401) { logout(); return; }
      if (res.ok) fetchThreads();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4"><button onClick={() => setShowNewThread(!showNewThread)} className="xp-button">➕ New Thread</button></div>
      {showNewThread && (
        <div className="xp-panel mb-4">
          <div className="space-y-3">
            <div><label className="block text-sm font-bold mb-1 text-gray-700">Title:</label><input type="text" placeholder="Thread title" value={threadTitle} onChange={(e) => setThreadTitle(e.target.value)} className="xp-input" /></div>
            <div><label className="block text-sm font-bold mb-1 text-gray-700">Message:</label><textarea placeholder="What's on your mind?" value={threadText} onChange={(e) => setThreadText(e.target.value)} rows="4" className="xp-input" /></div>
            {message && <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>{message}</div>}
            <button onClick={createThread} className="xp-button w-full">Create Thread</button>
          </div>
        </div>
      )}
      {threads.map((thread) => (
        <div key={thread.id} className="xp-panel">
          <h3 className="text-lg font-bold text-blue-900 mb-2">{thread.title}</h3>
          <p className="text-gray-700 text-sm mb-3">{thread.text}</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <button onClick={() => likeThread(thread.id)} className="xp-button-small flex items-center gap-1"><Heart className="w-3 h-3" />{thread.likes}</button>
            <button onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)} className="xp-button-small flex items-center gap-1"><MessageCircle className="w-3 h-3" />{thread.comments?.length || 0}</button>
          </div>
          {expandedThread === thread.id && <ThreadComments threadId={thread.id} token={token} comments={thread.comments} fetchThreads={fetchThreads} logout={logout} />}
        </div>
      ))}
    </div>
  );
};

const ThreadComments = ({ threadId, token, comments, fetchThreads, logout }) => {
  const [comment, setComment] = useState('');
  const [likingComment, setLikingComment] = useState(null);

  const postComment = async () => {
    if (!comment) return;
    try {
      const res = await fetch(`${API_URL}/comm/comments/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ comment, about_w: threadId }) });
      if (res.status === 401) { logout(); return; }
      if (res.ok) { setComment(''); fetchThreads(); }
    } catch (err) { console.error(err); }
  };

  const likeComment = async (commentId) => {
    setLikingComment(commentId);
    try {
      const res = await fetch(`${API_URL}/comm/CommentLike/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ where: commentId }) });
      if (res.status === 401) { logout(); return; }
      if (res.ok) fetchThreads();
    } catch (err) { console.error(err); }
    finally { setLikingComment(null); }
  };

  return (
    <div className="mt-4 pl-6 space-y-3 border-l-4 border-blue-300">
      <div className="flex gap-2">
        <input type="text" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && postComment()} className="xp-input text-xs" style={{ fontSize: '12px' }} />
        <button onClick={postComment} className="xp-button-small" title="Send comment"><Send className="w-3 h-3" /></button>
      </div>
      {comments && comments.map((c) => (
        <div key={c.id} className="xp-panel" style={{ padding: '8px' }}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-gray-700 text-xs flex-1">{c.text}</p>
            <button onClick={() => likeComment(c.id)} disabled={likingComment === c.id} className="xp-button-small flex items-center gap-1 flex-shrink-0" style={{ padding: '4px 8px' }}>
              <Heart className="w-3 h-3" fill={c.likes > 0 ? 'currentColor' : 'none'} /><span className="text-xs">{c.likes}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// ADD MUSIC MODAL
// ─────────────────────────────────────────────
const AddMusicModal = ({ token, album, onClose, onSuccess, logout }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tune, setTune] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try { const res = await fetch(`${API_URL}/core/categories/`, { headers: { 'Authorization': `Bearer ${token}` } }); if (res.ok) { const data = await res.json(); setCategories(data); } } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (catId) => setSelectedCategories(selectedCategories.includes(catId) ? selectedCategories.filter(id => id !== catId) : [...selectedCategories, catId]);

  const handleUpload = async () => {
    if (!tune) { setMessage('❌ Please select an audio file'); return; }
    setLoading(true); setMessage('');
    const formData = new FormData();
    formData.append('title', title); formData.append('description', description); formData.append('album', album.id); formData.append('tune', tune);
    selectedCategories.forEach(catId => formData.append('category_ids', catId));
    try {
      const res = await fetch(`${API_URL}/core/music/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (res.status === 401) { logout(); return; }
      if (res.ok) { setMessage('✅ Track uploaded successfully!'); setTimeout(() => { onSuccess(); onClose(); }, 1500); }
      else { const data = await res.json(); setMessage('❌ Upload failed: ' + JSON.stringify(data)); }
    } catch (err) { setMessage('❌ Connection error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="xp-window" style={{ width: '400px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="xp-window-title"><span className="font-bold">📤 Add Music to {album.name}</span><div className="xp-window-controls"><button onClick={onClose} className="xp-control">✕</button></div></div>
        <div className="xp-window-content">
          <div className="space-y-4">
            <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="xp-input" disabled={loading} /></div>
            <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Description:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="xp-input" disabled={loading} /></div>
            <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Categories:</label><div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">{categories.length === 0 ? <p className="text-xs text-gray-500">No categories available</p> : categories.map(cat => (<label key={cat.id} className="flex items-center gap-1 text-sm bg-white px-2 py-1 rounded border border-gray-300 cursor-pointer"><input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />{cat.cat_name}</label>))}</div></div>
            <div className="xp-panel"><label className="block text-sm font-bold mb-2 text-gray-700">Audio File:</label><input type="file" accept="audio/*" onChange={(e) => setTune(e.target.files[0])} className="xp-file-input" disabled={loading} /></div>
            {message && <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>{message}</div>}
            <div className="flex gap-2 justify-end mt-4"><button onClick={onClose} className="xp-button" disabled={loading}>Cancel</button><button onClick={handleUpload} className="xp-button" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────
const ProfilePage = ({ token, user, logout }) => {
  const [loading, setLoading] = useState(true);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [myAlbums, setMyAlbums] = useState([]);
  const [myMusic, setMyMusic] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAlbumForUpload, setSelectedAlbumForUpload] = useState(null);

  useEffect(() => { if (token) fetchProfileData(); }, [token]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const musicRes = await fetch(`${API_URL}/core/mymusic/`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (musicRes.status === 401) { logout(); return; }
      if (musicRes.ok) { const musicData = await musicRes.json(); setMyMusic(Array.isArray(musicData) ? musicData : []); if (musicData.length > 0) setCreatorInfo({ nickname: musicData[0].owner, hasMusic: true }); }
      const albumsRes = await fetch(`${API_URL}/core/myalbums/`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (albumsRes.status === 401) { logout(); return; }
      if (albumsRes.ok) { const albumsData = await albumsRes.json(); setMyAlbums(Array.isArray(albumsData) ? albumsData : []); } else setMyAlbums([]);
    } catch (err) { setMyAlbums([]); setMyMusic([]); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="xp-loading"></div><span className="ml-3 text-gray-700 font-bold">Loading profile...</span></div>;

  const isCreator = myMusic.length > 0 || creatorInfo;

  return (
    <div className="space-y-6">
      <div className="xp-panel">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-lg">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{user?.username || 'User'}</h2>
            {isCreator && creatorInfo && <div className="space-y-1"><span className="xp-badge">⭐ Creator</span>{creatorInfo.nickname && <p className="text-gray-700 text-sm mt-2"><strong>Creator Name:</strong> {creatorInfo.nickname}</p>}</div>}
            {!isCreator && <p className="text-gray-600 text-sm">Music Listener</p>}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="xp-panel" style={{ padding: '12px', background: 'linear-gradient(135deg, #E8F4FF 0%, #D0E8FF 100%)' }}><p className="text-2xl font-bold text-blue-900">{myMusic.length}</p><p className="text-xs text-gray-600">Tracks</p></div>
              <div className="xp-panel" style={{ padding: '12px', background: 'linear-gradient(135deg, #FFE8F4 0%, #FFD0E8 100%)' }}><p className="text-2xl font-bold text-blue-900">{myAlbums.length}</p><p className="text-xs text-gray-600">Albums</p></div>
              <div className="xp-panel" style={{ padding: '12px', background: 'linear-gradient(135deg, #E8FFE8 0%, #D0FFD0 100%)' }}><p className="text-2xl font-bold text-blue-900">{user?.id || 0}</p><p className="text-xs text-gray-600">User ID</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-b-2 border-gray-400 pb-2">
        <button onClick={() => setActiveTab('overview')} className={`xp-nav-button ${activeTab === 'overview' ? 'xp-nav-button-active' : ''}`}>📊 Overview</button>
        <button onClick={() => setActiveTab('music')} className={`xp-nav-button ${activeTab === 'music' ? 'xp-nav-button-active' : ''}`}>🎵 My Music ({myMusic.length})</button>
        <button onClick={() => setActiveTab('albums')} className={`xp-nav-button ${activeTab === 'albums' ? 'xp-nav-button-active' : ''}`}>💿 My Albums ({myAlbums.length})</button>
      </div>
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="xp-panel">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Account Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-300"><span className="font-bold text-gray-700">Username:</span><span className="text-gray-600">{user?.username}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-300"><span className="font-bold text-gray-700">Email:</span><span className="text-gray-600">{user?.email || 'Not provided'}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-300"><span className="font-bold text-gray-700">Account Type:</span><span className="text-gray-600">{isCreator ? '⭐ Creator' : '👤 Listener'}</span></div>
              <div className="flex justify-between py-2"><span className="font-bold text-gray-700">Total Tracks:</span><span className="text-gray-600">{myMusic.length}</span></div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'music' && (
        <div>
          {myMusic.length === 0 ? <div className="xp-panel text-center py-8"><p className="text-gray-600">You haven't uploaded any music yet.</p></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myMusic.map((track) => (
                <div key={track.id} className="xp-panel">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center text-white text-2xl flex-shrink-0">🎵</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-blue-900 truncate">{track.title}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{track.description || 'No description'}</p>
                      {track.category && track.category.length > 0 && <div className="flex gap-1 flex-wrap mb-2">{track.category.map((cat, i) => <span key={i} className="xp-badge text-xs">{cat}</span>)}</div>}
                      <audio controls className="w-full" style={{ height: '32px' }}><source src={`${API_URL}${track.tune}`} type="audio/mpeg" /></audio>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'albums' && (
        <div>
          {myAlbums.length === 0 ? <div className="xp-panel text-center py-8"><p className="text-gray-600">You haven't created any albums yet.</p></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myAlbums.map((album) => (
                <div key={album.id} className="xp-panel">
                  {album.cover_album ? <img src={`${String(album.cover_album).startsWith('http') ? album.cover_album : API_URL + album.cover_album}`} alt={album.name} className="w-full h-40 object-cover mb-3 border-2 border-gray-400 rounded" onError={(e) => { e.target.style.display = 'none'; }} /> : <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-purple-600 mb-3 flex items-center justify-center text-white text-5xl rounded border-2 border-gray-400">💿</div>}
                  <h3 className="text-base font-bold text-blue-900 mb-1">{album.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">📅 {new Date(album.create_time).toLocaleDateString()}</p>
                  {album.release ? <span className="xp-badge text-xs mb-2 inline-block">🌐 Released</span> : <span className="xp-badge text-xs mb-2 inline-block" style={{ background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)', borderColor: '#CC8800' }}>🔒 Private</span>}
                  <div className="mt-3 mb-2"><button onClick={() => setSelectedAlbumForUpload(album)} className="xp-button-small w-full flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Add Music</button></div>
                  <div className="space-y-1 mt-2">
                    <p className="text-xs font-bold text-gray-700">Tracks ({album.tracks?.length || 0}):</p>
                    {album.tracks && album.tracks.length > 0 ? <div className="max-h-32 overflow-y-auto space-y-2">{album.tracks.map((track, i) => <div key={track.id || i} className="border-b border-gray-200 pb-2 last:border-0"><p className="text-xs text-gray-700">{i + 1}. {track.title}</p><audio controls className="w-full mt-1" style={{ height: '24px' }}><source src={`${String(track.tune).startsWith('http') ? track.tune : API_URL + track.tune}`} /></audio></div>)}</div> : <p className="text-xs text-gray-500 italic">No tracks yet</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {selectedAlbumForUpload && <AddMusicModal token={token} album={selectedAlbumForUpload} onClose={() => setSelectedAlbumForUpload(null)} onSuccess={() => { fetchProfileData(); setSelectedAlbumForUpload(null); }} logout={logout} />}
    </div>
  );
};

// ─────────────────────────────────────────────
// ADMIN PAGE
// ─────────────────────────────────────────────
const AdminPage = ({ token, logout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users/`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.status === 401) { logout(); return; }
      if (res.ok) { const data = await res.json(); setUsers(data); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const makeAdmin = async (email) => {
    try {
      const res = await fetch(`${API_URL}/add/admin/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.status === 401) { logout(); return; }
      if (res.ok) { setMessage(`✅ User ${email} is now an admin!`); fetchUsers(); setTimeout(() => setMessage(''), 3000); }
      else setMessage('❌ Failed to add admin');
    } catch (err) { setMessage('❌ Connection error'); }
  };

  return (
    <div className="space-y-4">
      <div className="xp-panel bg-yellow-50"><h2 className="text-xl font-bold text-red-900 mb-2">🛡️ Admin Panel</h2><p className="text-sm text-gray-700">Manage users and permissions. Be careful!</p></div>
      {message && <div className={`xp-message ${message.includes('✅') ? 'xp-message-success' : 'xp-message-error'}`}>{message}</div>}
      {loading ? <div className="xp-loading mx-auto"></div> : (
        <div className="grid gap-4">
          {users.map((u) => (
            <div key={u.id} className="xp-panel flex items-center justify-between">
              <div><p className="font-bold text-blue-900">{u.first_name} {u.last_name}</p><p className="text-sm text-gray-600">{u.email}</p>{u.is_staff && <span className="xp-badge mt-1 inline-block">Admin</span>}</div>
              {!u.is_staff && <button onClick={() => makeAdmin(u.email)} className="xp-button-small text-red-700 border-red-300 hover:bg-red-50">Make Admin</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;