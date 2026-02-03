import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ShoeBox from './components/ShoeBox';
import Letter from './components/Letter';
import ComposeLetter from './components/ComposeLetter';
import AuthScreen from './components/AuthScreen';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null); // The "Romantic Name" from profiles table
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState('read'); // 'read' | 'compose'
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'sent'

  const [letters, setLetters] = useState([]);

  // Handle Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setUsername(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (data) setUsername(data.username);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch letters on load (only if we have a username)
  useEffect(() => {
    if (!username) return;

    const fetchLetters = async () => {
      // Fetch letters where I am the recipient OR I am the sender
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .or(`recipient_name.eq.${username},sender_name.eq.${username}`)
        .order('created_at', { ascending: false });

      if (data) setLetters(data);
    };

    fetchLetters();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('public:letters')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'letters' }, (payload) => {
        // Only add if relevant to me
        const newLetter = payload.new;
        if (newLetter.recipient_name === username || newLetter.sender_name === username) {
          setLetters((prev) => [newLetter, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  const handleSendLetter = async (newLetterData) => {
    if (!username) return;

    // Optimistic update (optional, but good for UX)
    // Actually, let's just push to DB and let the subscription update the UI
    const letterPayload = {
      title: newLetterData.title,
      content: newLetterData.content,
      date: newLetterData.date,
      sender_name: username,
      recipient_name: newLetterData.recipient,
      is_read: false
    };

    const { error } = await supabase.from('letters').insert([letterPayload]);

    if (error) {
      console.error('Error sending letter:', error);
      alert(`Failed to send letter: ${error.message || error.error_description || "Network error"}`);
    } else {
      setViewMode('read');
      setActiveTab('sent');
      // We don't need to manually update state because the subscription will catch our own insert!
    }
  };

  // Filter letters based on active tab and identity
  const visibleLetters = letters.filter(l => {
    if (activeTab === 'inbox') {
      return l.recipient_name === username;
    } else {
      return l.sender_name === username;
    }
  });

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Parchment...</div>;
  }

  if (!session || !username) {
    return <AuthScreen />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ShoeBox
        letters={visibleLetters}
        onSelectLetter={(l) => { setViewMode('read'); setSelectedLetter(l); }}
        selectedLetterId={selectedLetter?.id}
        onCompose={() => { setViewMode('compose'); setSelectedLetter(null); }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        username={username}
      />

      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: 'var(--color-bg)',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {viewMode === 'compose' ? (
          <ComposeLetter
            onSend={handleSendLetter}
            onCancel={() => setViewMode('read')}
          />
        ) : (
          <Letter letter={selectedLetter} />
        )}
      </div>

      {/* Logout Button (Small aesthetic implementation) */}
      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'var(--color-accent)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default App;
