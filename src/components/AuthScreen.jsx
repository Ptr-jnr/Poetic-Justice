import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

const AuthScreen = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Romantic Name
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // LOGIN
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // User session handled by onAuthStateChange in App.jsx
            } else {
                // SIGNUP
                // 1. Sign up user
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (authError) throw authError;

                // 2. Create Profile (Manually linking uuid to username)
                if (authData.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([{ id: authData.user.id, username: username }]);

                    if (profileError) {
                        console.error("Profile creation failed:", profileError);
                        // Optional: cleaning up the user if profile fails would be good, but trickier here.
                        throw new Error("Failed to create profile name. " + profileError.message);
                    }
                }
                alert("Registration successful! You may now sign in.");
                setIsLogin(true); // Switch to login after signup
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
            backgroundImage: `url('./paper_texture.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    padding: '60px',
                    backgroundColor: 'rgba(253, 251, 247, 0.9)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '90%',
                    border: '1px solid #c2a685',
                    borderRadius: '2px'
                }}
            >
                <h1 style={{
                    fontSize: '3rem',
                    marginBottom: '10px',
                    color: 'var(--color-shoebox)',
                    letterSpacing: '0.05em'
                }}>
                    {isLogin ? "Deeply Missed" : "Begin the Journey"}
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    marginBottom: '40px',
                    opacity: 0.5,
                    fontStyle: 'italic'
                }}>
                    {isLogin ? "Reunite with your shared memories." : "Create your identity to begin your correspondence."}
                </p>

                {error && <div style={{ color: 'var(--color-accent)', marginBottom: '25px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        style={{
                            padding: '12px 0',
                            fontSize: '1.1rem',
                            border: 'none',
                            borderBottom: '1px solid rgba(44, 36, 27, 0.2)',
                            backgroundColor: 'transparent',
                            outline: 'none',
                            color: 'var(--color-text)',
                            transition: 'border-bottom 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderBottom = '1px solid var(--color-gold)'}
                        onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(44, 36, 27, 0.2)'}
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={{
                            padding: '12px 0',
                            fontSize: '1.1rem',
                            border: 'none',
                            borderBottom: '1px solid rgba(44, 36, 27, 0.2)',
                            backgroundColor: 'transparent',
                            outline: 'none',
                            color: 'var(--color-text)',
                            transition: 'border-bottom 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderBottom = '1px solid var(--color-gold)'}
                        onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(44, 36, 27, 0.2)'}
                    />

                    {!isLogin && (
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your Romantic Name (e.g. Juliet)"
                            required
                            style={{
                                padding: '12px 0',
                                fontSize: '1.1rem',
                                border: 'none',
                                borderBottom: '1px solid rgba(44, 36, 27, 0.2)',
                                backgroundColor: 'transparent',
                                outline: 'none',
                                color: 'var(--color-text)',
                                transition: 'border-bottom 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderBottom = '1px solid var(--color-gold)'}
                            onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(44, 36, 27, 0.2)'}
                        />
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#a63e2d' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '20px',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            padding: '15px',
                            fontSize: '1.1rem',
                            borderRadius: '2px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            boxShadow: '0 4px 15px rgba(138, 51, 36, 0.3)',
                            cursor: loading ? 'wait' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Approaching..." : (isLogin ? "Enter the Registry" : "Register Name")}
                    </motion.button>
                </form>

                <p style={{ marginTop: '20px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Need to register? Sign up here." : "Already have a name? Login here."}
                </p>

            </motion.div>
        </div>
    );
};

export default AuthScreen;
