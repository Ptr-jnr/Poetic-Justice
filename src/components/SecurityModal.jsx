import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const SecurityModal = ({ isOpen, onClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError("The ciphers do not match, my dearest.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("The cipher must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError(err.message || "The ink has run dry... Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            width: '400px',
                            backgroundColor: 'var(--color-bg)',
                            backgroundImage: "url('./paper_texture.jpg')",
                            backgroundSize: 'cover',
                            padding: '40px',
                            border: '1px solid var(--color-gold)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                fontSize: '1.2rem',
                                color: 'var(--color-text)',
                                opacity: 0.4,
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{
                            fontSize: '2rem',
                            color: 'var(--color-shoebox)',
                            marginBottom: '10px',
                            textAlign: 'center'
                        }}>
                            Change the Cipher
                        </h2>
                        <p style={{
                            fontSize: '0.9rem',
                            fontStyle: 'italic',
                            opacity: 0.6,
                            textAlign: 'center',
                            marginBottom: '30px'
                        }}>
                            Choose a new secret to protect your correspondence.
                        </p>

                        {error && (
                            <div style={{
                                color: 'var(--color-accent)',
                                fontSize: '0.85rem',
                                marginBottom: '20px',
                                textAlign: 'center',
                                backgroundColor: 'rgba(138, 51, 36, 0.05)',
                                padding: '10px',
                                border: '1px solid rgba(138, 51, 36, 0.1)'
                            }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{
                                color: '#4a7c44',
                                fontSize: '0.85rem',
                                marginBottom: '20px',
                                textAlign: 'center',
                                backgroundColor: 'rgba(74, 124, 68, 0.05)',
                                padding: '10px',
                                border: '1px solid rgba(74, 124, 68, 0.1)'
                            }}>
                                The cipher has been renewed successfully.
                            </div>
                        )}

                        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>New Cipher</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        padding: '10px 0',
                                        fontSize: '1.1rem',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(44, 36, 27, 0.2)',
                                        backgroundColor: 'transparent',
                                        outline: 'none',
                                        color: 'var(--color-text)'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>Confirm Cipher</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        padding: '10px 0',
                                        fontSize: '1.1rem',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(44, 36, 27, 0.2)',
                                        backgroundColor: 'transparent',
                                        outline: 'none',
                                        color: 'var(--color-text)'
                                    }}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: '#a63e2d' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || success}
                                style={{
                                    marginTop: '10px',
                                    backgroundColor: 'var(--color-accent)',
                                    color: 'white',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    borderRadius: '2px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    cursor: (loading || success) ? 'wait' : 'pointer',
                                    opacity: (loading || success) ? 0.7 : 1
                                }}
                            >
                                {loading ? "Updating..." : "Seal the New Cipher"}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SecurityModal;
