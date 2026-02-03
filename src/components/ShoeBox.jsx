import React from 'react';
import { motion } from 'framer-motion';

const ShoeBox = ({ letters, onSelectLetter, selectedLetterId, onCompose, activeTab, setActiveTab }) => {
    return (
        <div className="shoebox-container" style={{
            width: '320px',
            backgroundColor: 'var(--color-shoebox)',
            color: 'var(--color-shoebox-text)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: ' inset -10px 0 20px rgba(0,0,0,0.5), 5px 0 15px rgba(0,0,0,0.3)',
            zIndex: 10,
            position: 'relative',
            height: '100%',
        }}>
            {/* Box Lid Effect (Visual Top) */}
            <div style={{
                padding: '30px 20px 20px 20px',
                borderBottom: '2px solid rgba(0,0,0,0.2)',
                background: 'linear-gradient(to bottom, #5e4b35, #4a3b2a)',
                boxShadow: '0 5px 10px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{
                    fontSize: '3rem',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    margin: 0
                }}>
                    Keepsakes
                </h2>

                {/* Controls */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        onClick={() => onCompose()}
                        style={{
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            padding: '8px 15px',
                            borderRadius: '4px',
                            fontSize: '1.2rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        Write New ✎
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', marginTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div
                        onClick={() => setActiveTab('inbox')}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '10px',
                            cursor: 'pointer',
                            opacity: activeTab === 'inbox' ? 1 : 0.5,
                            borderBottom: activeTab === 'inbox' ? '2px solid var(--color-accent)' : 'none',
                            fontSize: '1.2rem'
                        }}
                    >
                        Received
                    </div>
                    <div
                        onClick={() => setActiveTab('sent')}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '10px',
                            cursor: 'pointer',
                            opacity: activeTab === 'sent' ? 1 : 0.5,
                            borderBottom: activeTab === 'sent' ? '2px solid var(--color-accent)' : 'none',
                            fontSize: '1.2rem'
                        }}
                    >
                        Sent
                    </div>
                </div>
            </div>

            {/* Scrollable List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                {letters.length === 0 && (
                    <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20px' }}>
                        <p>No letters yet...</p>
                    </div>
                )}

                {letters.map((letter, index) => (
                    <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelectLetter(letter)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: '15px',
                            backgroundColor: selectedLetterId === letter.id ? '#6b543a' : 'rgba(255,255,255,0.05)',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: selectedLetterId === letter.id ? 'inset 0 0 10px rgba(0,0,0,0.3)' : 'none',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Envelope stripe effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '4px', height: '100%',
                            backgroundColor: index % 2 === 0 ? '#8a3324' : '#2c241b',
                            opacity: 0.8
                        }} />

                        <div style={{ paddingLeft: '10px' }}>
                            <h3 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', lineHeight: 1 }}>{letter.date}</h3>
                            <p style={{ opacity: 0.8, fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-handwriting)' }}>
                                {letter.title}
                            </p>
                            {/* Visual indicator for sent items */}
                            {letter.isSent && <span style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase' }}>Sent</span>}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom texture/branding */}
            <div style={{
                padding: '15px',
                textAlign: 'center',
                opacity: 0.4,
                fontSize: '0.9rem',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                Est. 1782
            </div>
        </div>
    );
};

export default ShoeBox;
