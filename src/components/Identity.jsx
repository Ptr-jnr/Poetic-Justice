import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Identity = ({ onIdentify }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onIdentify(name.trim());
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--color-bg)',
            backgroundImage: `
          radial-gradient(#e6d0b3 1px, transparent 1px),
          radial-gradient(#e6d0b3 1px, transparent 1px)
      `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    padding: '60px',
                    backgroundColor: '#fdfbf7',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '90%',
                    border: '1px solid #e6dace'
                }}
            >
                <h1 style={{ fontSize: '4rem', marginBottom: '10px' }}>Who goes there?</h1>
                <p style={{ fontSize: '1.5rem', marginBottom: '40px', opacity: 0.7 }}>
                    Enter your name to begin your correspondence.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name..."
                        style={{
                            padding: '15px',
                            fontSize: '2rem',
                            fontFamily: 'var(--font-heading)',
                            border: 'none',
                            borderBottom: '2px solid var(--color-shoebox)',
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            outline: 'none'
                        }}
                    />

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        style={{
                            marginTop: '20px',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '1.5rem',
                            borderRadius: '50px',
                            opacity: name.trim() ? 1 : 0.5,
                            transition: 'opacity 0.3s'
                        }}
                    >
                        Enter Website
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Identity;
