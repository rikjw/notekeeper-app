import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsRecoveryMode(true);
    }
    
    // Listen for the password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
        // Update the user's password
        const { data, error } = await supabase.auth.updateUser({
          password: password
        });
        
        if (error) throw error;
        
        console.log('Password updated:', data);
        setMessage('Password updated successfully! You can now sign in with your new password.');
        setPassword('');
        setConfirmPassword('');
        
        // Sign out to force re-login with new password
        await supabase.auth.signOut();
        
        // Clear the hash from the URL to prevent issues with future logins
        if (isRecoveryMode && window.history.replaceState) {
          window.history.replaceState(null, null, window.location.pathname);
        }
      } catch (error) {
        console.error('Update error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    return(
        <div className="auth-container"> 
            <h1>Update Password</h1>
      
            {isRecoveryMode && !message && (
                <p className="message">Please enter your new password below.</p>
            )}
            
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}    

            <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    autoComplete="new-password"
                />
                </div>
        
                <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    autoComplete="new-password"
                />
                </div>
        
                <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form> 

             {message && (
                <p className="mt-4">
                <button 
                    onClick={() => {
                    // Sign out the user if they're signed in
                    supabase.auth.signOut();
                    // Redirect to sign-in page by reloading
                    window.location.href = '/';
                    }} 
                    className="link-button"
                >
                    Return to Sign In
                </button>
                </p>
        )}               
                          
        </div>

    );   

}

export default UpdatePassword;