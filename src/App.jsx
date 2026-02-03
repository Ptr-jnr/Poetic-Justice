import { useState, useEffect } from 'react';
import ShoeBox from './components/ShoeBox';
import Letter from './components/Letter';
import ComposeLetter from './components/ComposeLetter';
import './index.css';

// Initial dummy data
const INITIAL_INBOX = [
  {
    id: 1,
    title: "The First Glimpse",
    date: "June 14th, 1782",
    content: "The days grow long without you. I find myself staring at the horizon, wondering if the wind that brushes my cheek has touched yours. Every sunset brings the promise of another dawn closer to our reunion."
  },
  {
    id: 2,
    title: "A Midnight Thought",
    date: "July 2nd, 1782",
    content: "Each moment apart feels like an eternity. The moon shines bright tonight, and I take comfort knowing we sleep under the same sky, though separated by miles of earth and sea."
  },
  {
    id: 3,
    title: "The Promise",
    date: "August 10th, 1782",
    content: "I shall return to you before the first snow falls. Hold fast to our memories, for they are the bridge that connects our souls until my arms can hold you once more."
  }
];

function App() {
  const [viewMode, setViewMode] = useState('read'); // 'read' | 'compose'
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'sent'

  // State for letters
  const [inboxLetters, setInboxLetters] = useState(() => {
    const saved = localStorage.getItem('pj_inbox');
    return saved ? JSON.parse(saved) : INITIAL_INBOX;
  });

  const [sentLetters, setSentLetters] = useState(() => {
    const saved = localStorage.getItem('pj_sent');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pj_inbox', JSON.stringify(inboxLetters));
  }, [inboxLetters]);

  useEffect(() => {
    localStorage.setItem('pj_sent', JSON.stringify(sentLetters));
  }, [sentLetters]);

  const handleComposeClick = () => {
    setViewMode('compose');
    setSelectedLetter(null);
  };

  const handleSendLetter = (newLetterData) => {
    const newLetter = {
      id: Date.now(),
      ...newLetterData,
      isSent: true
    };

    setSentLetters(prev => [newLetter, ...prev]);
    setViewMode('read');
    setActiveTab('sent');
    setSelectedLetter(newLetter);
  };

  const handleSelectLetter = (letter) => {
    setViewMode('read');
    setSelectedLetter(letter);
  };

  const visibleLetters = activeTab === 'inbox' ? inboxLetters : sentLetters;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ShoeBox
        letters={visibleLetters}
        onSelectLetter={handleSelectLetter}
        selectedLetterId={selectedLetter?.id}
        onCompose={handleComposeClick}
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
