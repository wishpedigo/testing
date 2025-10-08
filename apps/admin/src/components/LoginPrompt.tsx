import { useState } from 'react';
import { signIn } from '@wishlabs/firebase';
import { Button, Card, Typography, Box, TextField } from '@wishlabs/shared';

export default function LoginPrompt() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 max-w-md w-full mx-4">
        <Box className="text-center">
          <Typography variant="h4" component="h1" className="mb-4">
            Paradise Valley Admin
          </Typography>
          <Typography variant="body1" className="mb-6 text-gray-600">
            Sign in to access the admin panel for world generation and simulation management.
          </Typography>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            
            {error && (
              <Typography variant="body2" className="text-red-600">
                {error}
              </Typography>
            )}
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Box>
      </Card>
    </div>
  );
}
