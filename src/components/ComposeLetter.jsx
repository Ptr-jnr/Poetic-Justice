import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ComposeLetter = ({ onSend, onCancel }) => {
    const [content, setContent] = useState('');
    // Recipient is now handled automatically by App.jsx
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        if (!content.trim()) return;
        setIsSending(true);

        // Simulate "folding" time before actually sending
        setTimeout(() => {
            onSend({
                content,
                // recipient is set in App.jsx
                date,
                title: date
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
                backgroundColor: 'rgba(253, 251, 247, 0.85)',
                padding: '60px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                backgroundImage: `url('./paper_texture.jpg')`,
                backgroundSize: 'cover',
                border: '1px solid #c2a685',
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
                    <h2 style={{
                        fontSize: '2.5rem',
                        marginBottom: '40px',
                        color: 'var(--color-text)',
                        borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
                        paddingBottom: '10px'
                    }}>
                        To My Beloved,
                    </h2>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Pour your heart out here..."
                        autoFocus
                        style={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                            fontSize: '2.5rem',
                            lineHeight: '1.6',
                            fontFamily: 'var(--font-letter)',
                            resize: 'none',
                            minHeight: '400px',
                            color: 'var(--color-text)',
                            padding: '10px 0'
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '25px',
                        marginTop: '40px',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={onCancel}
                            style={{
                                fontSize: '1rem',
                                opacity: 0.4,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '0.4'}
                        >
                            Discard
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#a63e2d' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            disabled={!content.trim()}
                            style={{
                                fontSize: '1.2rem',
                                padding: '12px 40px',
                                backgroundColor: 'var(--color-accent)',
                                color: '#fff',
                                borderRadius: '2px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                boxShadow: '0 4px 15px rgba(138, 51, 36, 0.3)',
                                opacity: content.trim() ? 1 : 0.4,
                                cursor: content.trim() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Send
                        </motion.button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default ComposeLetter;
