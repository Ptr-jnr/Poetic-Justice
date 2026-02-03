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
                <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>
                    {isLogin ? "Welcome Back" : "Join the Registry"}
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.7 }}>
                    {isLogin ? "Enter your credentials to retrieve your letters." : "Create your identity to begin corresponding."}
                </p>

                {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        style={{
                            padding: '15px',
                            fontSize: '1.2rem',
                            fontFamily: 'sans-serif',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                        }}
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={{
                            padding: '15px',
                            fontSize: '1.2rem',
                            fontFamily: 'sans-serif',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                        }}
                    />

                    {!isLogin && (
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your Romantic Name (e.g. Juliet)"
                            required
                            style={{
                                padding: '15px',
                                fontSize: '1.2rem',
                                fontFamily: 'sans-serif',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                            }}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '10px',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: loading ? 'wait' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.3s'
                        }}
                    >
                        {loading ? "Processing..." : (isLogin ? "Enter" : "Register")}
                    </button>
                </form>

                <p style={{ marginTop: '20px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Need to register? Sign up here." : "Already have a name? Login here."}
                </p>

            </motion.div>
        </div>
    );
};

export default AuthScreen;
