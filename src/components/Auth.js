import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Auth({ setView, error: externalError }) { 
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(externalError || '');

  // Set error from external source if provided
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);
  
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
        if (isSignUp) {
          // Sign up
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (error) throw error;
          setMessage('Check your email for the confirmation link!');
        } else {
          // Sign in - simplified approach without checking for deleted status
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          // Auth status will be checked in App.js
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

  };
  
  return (
    <div className="auth-container">
      <div className="auth-header">
        <button 
          onClick={() => setView('landing')} 
          className="back-button"
          aria-label="Back to home"
        >
          ← Back
        </button>
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      </div>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      
      <form onSubmit={handleAuth}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      
      <p>
        {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
        <button className="link-button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
      
      {!isSignUp && (
        <p>
          <button className="link-button" onClick={() => setView('reset')}>
            Forgot your password?
          </button>
        </p>
      )}
    </div>
  );
  
}

export default Auth;







    
