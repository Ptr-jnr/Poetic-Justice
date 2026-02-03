import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ComposeLetter = ({ onSend, onCancel }) => {
    const [content, setContent] = useState('');
    const [recipient, setRecipient] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        if (!content.trim() || !recipient.trim()) return;
        setIsSending(true);

        // Simulate "folding" time before actually sending
        setTimeout(() => {
            onSend({
                content,
                recipient,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                title: "My Longing Heart" // Default title or could add input
            });
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
                width: 'min(90%, 800px)',
                minHeight: '60vh',
                backgroundColor: '#fdfbf7',
                padding: '60px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                backgroundImage: `
            linear-gradient(#e6d0b3 1px, transparent 1px),
            radial-gradient(#e6d0b3 1px, transparent 1px)
        `,
                backgroundSize: '100% 35px, 20px 20px',
                backgroundPosition: '0 1rem, 0 0',
            }}
        >
            {isSending ? (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginTop: '50px'
                }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ fontSize: '4rem' }}
                    >
                        ✉
                    </motion.div>
                    <p style={{ fontSize: '2rem', marginTop: '20px' }}>Sealing with love...</p>
                </div>
            ) : (
                <>
                    <h2 style={{ fontSize: '3rem', marginBottom: '10px', borderBottom: '1px solid #e6dace' }}>New Letter</h2>

                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="To whom is this addressed?"
                        style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid #e6dace',
                            fontSize: '1.8rem',
                            fontFamily: 'var(--font-heading)',
                            marginBottom: '20px',
                            outline: 'none',
                            color: 'var(--color-text)',
                            opacity: 0.8
                        }}
                    />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="My Dearest..."
                        autoFocus
                        style={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                            fontSize: '2.5rem',
                            lineHeight: '1.4',
                            fontFamily: 'var(--font-letter)',
                            resize: 'none',
                            minHeight: '400px',
                            color: 'var(--color-text)'
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '20px',
                        marginTop: '30px',
                        fontFamily: 'sans-serif' // Interface controls can be simpler or kept thematic
                    }}>
                        <button
                            onClick={onCancel}
                            style={{
                                fontSize: '1.2rem',
                                opacity: 0.6,
                                padding: '10px 20px',
                                fontFamily: 'var(--font-heading)'
                            }}
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!content.trim() || !recipient.trim()}
                            style={{
                                fontSize: '1.5rem',
                                padding: '10px 30px',
                                backgroundColor: 'var(--color-accent)',
                                color: '#fff',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-heading)',
                                opacity: (content.trim() && recipient.trim()) ? 1 : 0.5
                            }}
                        >
                            Send Letter
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default ComposeLetter;
