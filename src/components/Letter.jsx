import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Letter = ({ letter }) => {
    if (!letter) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            opacity: 0.4,
            flexDirection: 'column'
        }}>
            <h2 style={{ fontSize: '4rem', color: '#2c241b' }}>Select a memory...</h2>
            <div style={{ fontSize: '10rem', lineHeight: 0.5 }}>✉</div>
        </div>
    );

    return (
        <div style={{
            perspective: '1500px', // Adds depth for 3D transforms
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
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
                        backgroundColor: '#fdfbf7',
                        padding: '60px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)',
                        position: 'relative',
                        transformOrigin: 'top center',
                        backgroundImage: `
                    linear-gradient(#e6d0b3 1px, transparent 1px),
                    radial-gradient(#e6d0b3 1px, transparent 1px)
                `,
                        backgroundSize: '100% 35px, 20px 20px',
                        backgroundPosition: '0 1rem, 0 0',
                        border: '1px solid #e6dace'
                    }}
                >
                    {/* Paper Creases/Texture Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                        pointerEvents: 'none',
                        mixBlendMode: 'overlay'
                    }}></div>

                    {/* Wax Seal (Visual decoration) */}
                    <div style={{
                        position: 'absolute',
                        top: -20, right: 40,
                        width: '60px', height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 -5px 10px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.2)',
                        fontSize: '2rem',
                        fontFamily: 'serif',
                        border: '2px solid rgba(0,0,0,0.1)'
                    }}>
                        ♥
                    </div>

                    <div className="letter-content" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid rgba(44, 36, 27, 0.2)', paddingBottom: '10px' }}>
                            <h2 style={{ fontSize: '3.5rem' }}>{letter.date}</h2>
                            <span style={{ fontSize: '1.5rem', alignSelf: 'flex-end', opacity: 0.6 }}>My Dearest,</span>
                        </div>

                        <p style={{
                            fontSize: '2.5rem', /* Increased for legibility of cursive */
                            lineHeight: '1.4',
                            textAlign: 'justify',
                            whiteSpace: 'pre-line', // Respects newlines in content
                            fontFamily: 'var(--font-letter)'
                        }}>
                            {letter.content}
                        </p>

                        <div style={{ marginTop: '60px', textAlign: 'right', fontSize: '2.5rem' }}>
                            <p style={{ margin: 0 }}>Yours Eternally,</p>
                            <p style={{ margin: '10px 0 0 0', fontSize: '3rem' }}>V.</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Letter;
