import { useState } from 'react';
import { supabase } from '../supabaseClient';

function PasswordReset({ setView }) { 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // Set the redirect to the root of the application
      // This makes the flow more reliable
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      
      if (error) throw error;
      
      console.log('Password reset requested:', data);
      setMessage('Password reset instructions sent to your email!');
    } catch (error) {
      console.error('Reset error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <button 
          onClick={() => setView('auth')} 
          className="back-button"
          aria-label="Back to sign in"
        >
          ← Back
        </button>
        <h1>Reset Password</h1>
      </div>
      
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      
      <form onSubmit={handleResetPassword}>
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
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Send Reset Instructions'}
        </button>
      </form>
      
      <p>
        <button className="link-button" onClick={() => setView('auth')}>
          Back to Sign In
        </button>
      </p>
    </div>
  );

}

export default PasswordReset;