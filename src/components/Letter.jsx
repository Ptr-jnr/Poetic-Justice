import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Letter = ({ letter, onClose }) => {
    if (!letter) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            opacity: 0.15,
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div style={{ fontSize: '15rem', lineHeight: 0.5 }}>🪶</div>
            <h2 style={{ fontSize: '3rem', fontFamily: 'serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Open a Keepsake
            </h2>
        </div>
    );

    return (
        <div style={{
            perspective: '1500px', // Adds depth for 3D transforms
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            minHeight: '100%'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={letter.id}
                    initial={{
                        rotateX: 90, // Start folded flat/invisible
                        rotateZ: -5,
                        opacity: 0,
                        scale: 0.5
                    }}
                    animate={{
                        rotateX: 0,
                        rotateZ: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                            type: "spring",
                            stiffness: 50,
                            damping: 20,
                            mass: 1.5,
                            duration: 1.2
                        }
                    }}
                    exit={{
                        rotateX: -45,
                        opacity: 0,
                        scale: 0.9,
                        transition: { duration: 0.5 }
                    }}
                    style={{
                        width: 'min(90%, 800px)',
                        minHeight: '60vh',
                        backgroundColor: 'rgba(253, 251, 247, 0.85)',
                        padding: '60px',
                        position: 'relative',
                        transformOrigin: 'top center',
                        backgroundImage: `url('./paper_texture.jpg')`,
                        backgroundSize: 'cover',
                        border: '1px solid #c2a685',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Paper Creases/Texture Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.05) 100%)',
                        pointerEvents: 'none',
                        mixBlendMode: 'multiply',
                        opacity: 0.5
                    }}></div>

                    {/* Close Button (Subtle but reachable) */}
                    {onClose && (
                        <motion.button
                            whileHover={{ scale: 1.1, opacity: 1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                fontSize: '1.5rem',
                                color: 'var(--color-text)',
                                opacity: 0.3,
                                zIndex: 10,
                                cursor: 'pointer',
                                padding: '10px'
                            }}
                        >
                            ✕
                        </motion.button>
                    )}


                    <div className="letter-content" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            marginBottom: '40px',
                            borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
                            paddingBottom: '15px'
                        }}>
                            <h2 style={{ fontSize: '2.5rem', color: 'rgba(44, 36, 27, 0.8)' }}>
                                {letter.date}
                            </h2>
                            <span style={{
                                fontSize: '1.4rem',
                                opacity: 0.5,
                                fontStyle: 'italic',
                                letterSpacing: '0.05em'
                            }}>
                                My Dearest,
                            </span>
                        </div>

                        <p style={{
                            fontSize: '2.6rem',
                            lineHeight: '1.6',
                            textAlign: 'left',
                            whiteSpace: 'pre-line',
                            fontFamily: 'var(--font-letter)',
                            color: 'var(--color-text)',
                            margin: 0
                        }}>
                            {letter.content}
                        </p>

                        <div style={{
                            marginTop: '60px',
                            textAlign: 'right',
                            fontSize: '2.5rem',
                            position: 'relative'
                        }}>
                            <p style={{ margin: 0, fontFamily: 'var(--font-letter)' }}>Yours Eternally,</p>
                            <p style={{ margin: '10px 0 0 0', fontSize: '3.5rem', fontFamily: 'var(--font-letter)' }}>
                                {letter.sender_name || "V."}
                            </p>

                            {/* Wax Seal (Thematic signature stamp) */}
                            <div style={{
                                position: 'absolute',
                                left: '0',
                                bottom: '-20px',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-accent)',
                                boxShadow: '0 6px 15px rgba(0,0,0,0.4), inset 0 -4px 10px rgba(0,0,0,0.5), 0 0 5px rgba(138, 51, 36, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '2rem',
                                fontFamily: 'serif',
                                border: '1px solid rgba(0,0,0,0.2)',
                                transform: 'rotate(-15deg)',
                                opacity: 0.9,
                                zIndex: 10
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {letter.sender_name?.[0]?.toUpperCase() || "P"}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Letter;
