import React from 'react';
import { motion } from 'framer-motion';

const ShoeBox = ({ letters, onSelectLetter, selectedLetterId, onCompose, activeTab, setActiveTab, username, onSignOut, onOpenSecurity }) => {
    return (
        <div className="shoebox-container" style={{
            width: '320px',
            backgroundColor: 'var(--color-shoebox)',
            color: 'var(--color-shoebox-text)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset -5px 0 20px rgba(0,0,0,0.6), 10px 0 30px rgba(0,0,0,0.4)',
            zIndex: 10,
            position: 'relative',
            height: '100%',
            borderRight: '2px solid #221a12',
            backgroundImage: `
                radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0),
                linear-gradient(to right, rgba(0,0,0,0.2), transparent 50px)
            `,
            backgroundSize: '4px 4px, 100% 100%',
            transform: 'perspective(1200px) rotateY(1deg)',
            transformOrigin: 'left center'
        }}>
            {/* Box Lid Effect (Physical Top) */}
            <div style={{
                padding: '40px 20px 25px 20px',
                borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
                background: 'linear-gradient(to bottom, #453728, #3a2e20)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                position: 'relative',
                zIndex: 2
            }}>
                {/* Decorative Gold Latch/Handle */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '6px',
                    backgroundColor: 'var(--color-gold)',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4)',
                    border: '1px solid rgba(0,0,0,0.2)',
                    opacity: 0.8
                }}></div>

                <h2 style={{
                    fontSize: '2.2rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2rem',
                    color: 'var(--color-gold)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    margin: '10px 0 0 0',
                    fontFamily: 'serif'
                }}>
                    Keepsakes
                </h2>

                {/* Controls */}
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#a63e2d' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCompose()}
                        style={{
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            padding: '10px 25px',
                            borderRadius: '2px',
                            fontSize: '1rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer'
                        }}
                    >
                        New Letter +
                    </motion.button>
                </div>

                {/* Tabs (Physical Switch feel) */}
                <div style={{
                    display: 'flex',
                    marginTop: '30px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '4px',
                    padding: '4px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}>
                    <div
                        onClick={() => setActiveTab('inbox')}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '8px',
                            cursor: 'pointer',
                            opacity: activeTab === 'inbox' ? 1 : 0.4,
                            backgroundColor: activeTab === 'inbox' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                            borderRadius: '2px',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: activeTab === 'inbox' ? 'var(--color-gold)' : 'inherit',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Received
                    </div>
                    <div
                        onClick={() => setActiveTab('sent')}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '8px',
                            cursor: 'pointer',
                            opacity: activeTab === 'sent' ? 1 : 0.4,
                            backgroundColor: activeTab === 'sent' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                            borderRadius: '2px',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: activeTab === 'sent' ? 'var(--color-gold)' : 'inherit',
                            transition: 'all 0.3s ease'
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
                padding: '25px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                boxShadow: 'inset 0 20px 30px -10px rgba(0,0,0,0.7), inset 0 -20px 30px -10px rgba(0,0,0,0.7)',
                margin: '0 5px'
            }}>
                {letters.length === 0 && (
                    <div style={{ textAlign: 'center', opacity: 0.3, marginTop: '40px' }}>
                        <p style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>The box is empty...</p>
                    </div>
                )}

                {letters.map((letter, index) => (
                    <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectLetter(letter)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        style={{
                            padding: '20px',
                            backgroundColor: selectedLetterId === letter.id ? '#fdfbf7' : 'rgba(253, 251, 247, 0.8)',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: selectedLetterId === letter.id
                                ? '0 10px 20px rgba(0,0,0,0.3), inset 0 0 10px rgba(197, 160, 89, 0.1)'
                                : '0 4px 8px rgba(0,0,0,0.2)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            overflow: 'hidden',
                            color: '#2c241b' // Dark text for paper
                        }}
                    >
                        {/* Envelope Flap Effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            height: '4px',
                            background: 'linear-gradient(to right, rgba(197, 160, 89, 0.3), transparent, rgba(197, 160, 89, 0.3))'
                        }}></div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {letter.is_read === false && activeTab === 'inbox' && (
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-accent)',
                                    boxShadow: '0 0 5px rgba(138, 51, 36, 0.5)'
                                }}></div>
                            )}
                        </div>
                        <h3 style={{
                            fontSize: '1.2rem',
                            margin: '5px 0',
                            color: selectedLetterId === letter.id ? 'var(--color-accent)' : '#2c241b',
                            fontFamily: 'serif',
                            fontWeight: 'bold'
                        }}>
                            {letter.date}
                        </h3>
                        <p style={{
                            opacity: 0.5,
                            fontSize: '0.9rem',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontStyle: 'italic'
                        }}>
                            {letter.content.substring(0, 40)}...
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* User Profile / Logout (Physical Label feel) */}
            <div style={{
                padding: '20px',
                borderTop: '1px solid rgba(197, 160, 89, 0.2)',
                background: 'linear-gradient(to bottom, #3a2e20, #2c241b)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(197, 160, 89, 0.15)',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-gold)',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                    }}>
                        {username?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{
                            margin: 0,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            opacity: 0.5
                        }}>
                            Box Owner
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: '1rem',
                            color: 'var(--color-gold)',
                            fontFamily: 'serif'
                        }}>
                            {username}
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ backgroundColor: 'rgba(197, 160, 89, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenSecurity}
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        color: 'rgba(197, 160, 89, 0.6)',
                        borderRadius: '2px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Change Cipher
                </motion.button>

                <motion.button
                    whileHover={{ backgroundColor: 'rgba(197, 160, 89, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSignOut}
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        color: 'rgba(197, 160, 89, 0.6)',
                        borderRadius: '2px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Seal & Depart
                </motion.button>
            </div>
        </div >
    );
};


export default ShoeBox;
