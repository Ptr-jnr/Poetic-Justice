import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabaseClient';
import ShoeBox from './components/ShoeBox';
import Letter from './components/Letter';
import ComposeLetter from './components/ComposeLetter';
import AuthScreen from './components/AuthScreen';
import SecurityModal from './components/SecurityModal';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null); // The "Romantic Name" from profiles table
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState('read'); // 'read' | 'compose'
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'sent'
  const [showSecurityModal, setShowSecurityModal] = useState(false);

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

    // Logic: Peter writes to Merciful, Merciful writes to Peter
    let recipient = null;
    if (username === 'Peter') recipient = 'Merciful';
    else if (username === 'Merciful') recipient = 'Peter';
    else {
      // Fallback for any other user (though we only expect these two)
      recipient = 'Peter';
    }

    const letterPayload = {
      title: newLetterData.title,
      content: newLetterData.content,
      date: newLetterData.date,
      sender_name: username,
      recipient_name: recipient,
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
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: "url('./paper_texture.jpg')",
        backgroundSize: 'cover'
      }}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: '8rem', marginBottom: '20px', filter: 'sepia(0.5)' }}
        >
          🪶
        </motion.div>
        <p style={{
          fontSize: '1.5rem',
          fontFamily: 'serif',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.6
        }}>
          Unrolling the Parchment...
        </p>
      </div>
    );
  }

  if (!session || !username) {
    return <AuthScreen />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      {/* Background Depth Decor */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.2,
        overflow: 'hidden'
      }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: '2px',
              height: '40px',
              backgroundColor: 'var(--color-gold)',
              filter: 'blur(2px)',
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      <ShoeBox
        letters={visibleLetters}
        onSelectLetter={(l) => { setViewMode('read'); setSelectedLetter(l); }}
        selectedLetterId={selectedLetter?.id}
        onCompose={() => { setViewMode('compose'); setSelectedLetter(null); }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        username={username}
        onSignOut={() => supabase.auth.signOut()}
        onOpenSecurity={() => setShowSecurityModal(true)}
      />

      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: 'var(--color-bg)',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Top-align for scrolling
        overflowY: 'auto',
        padding: '60px 0' // Vertical padding for parchment breathing room
      }}>
        {viewMode === 'compose' ? (
          <ComposeLetter
            onSend={handleSendLetter}
            onCancel={() => setViewMode('read')}
          />
        ) : (
          <Letter letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
        )}
      </div>

      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
    </div>
  );
}

export default App;
