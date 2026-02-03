import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ShoeBox from './components/ShoeBox';
import Letter from './components/Letter';
import ComposeLetter from './components/ComposeLetter';
import Identity from './components/Identity';
import './index.css';

function App() {
  const [identity, setIdentity] = useState(() => localStorage.getItem('pj_identity'));
  const [viewMode, setViewMode] = useState('read'); // 'read' | 'compose'
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'sent'

  const [letters, setLetters] = useState([]);

  // Persist identity
  useEffect(() => {
    if (identity) {
      localStorage.setItem('pj_identity', identity);
    }
  }, [identity]);

  // Fetch letters on load
  useEffect(() => {
    if (!identity) return;

    const fetchLetters = async () => {
      // Fetch letters where I am the recipient OR I am the sender
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .or(`recipient_name.eq.${identity},sender_name.eq.${identity}`)
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
        if (newLetter.recipient_name === identity || newLetter.sender_name === identity) {
          setLetters((prev) => [newLetter, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [identity]);

  const handleSendLetter = async (newLetterData) => {
    // Optimistic update (optional, but good for UX)
    // Actually, let's just push to DB and let the subscription update the UI
    const letterPayload = {
      title: newLetterData.title,
      content: newLetterData.content,
      date: newLetterData.date,
      sender_name: identity,
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
  // "Inbox" = Letters NOT sent by me (or sent TO me)
  // "Sent" = Letters sent BY me
  const visibleLetters = letters.filter(l => {
    if (activeTab === 'inbox') {
      return l.recipient_name === identity;
    } else {
      return l.sender_name === identity;
    }
  });

  if (!identity) {
    return <Identity onIdentify={setIdentity} />;
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
    </div>
  );
}

export default App;
