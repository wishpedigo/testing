import { useState } from 'react';
import { Container, Typography, Box, Button, Card, TextField, Alert, LinkText } from '@wishlabs/shared';
import { signIn, signUp } from '@wishlabs/firebase';

const LoginPrompt = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-16">
      <Card
        title="Login"
      >
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Box className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : ('Log In')}
              </Button>
            </Box>
          </Box>
        </form>

        <Box className="mt-4 text-center">
          <a href={import.meta.env.VITE_DASH_URL+'/forgot-password' || 'http://localhost:5174/forgot-password'}>
            <LinkText>Forgot password?</LinkText>
          </a>
        </Box>

        <Box className="text-center mt-4">
          Don't have an account?{' '}
          <a 
            href={import.meta.env.VITE_DASH_URL+'/signup' || 'http://localhost:5174/signup'} 
            className="text-blue-600 hover:text-blue-800 underline font-mono"
          >
            <LinkText>Sign up</LinkText>
          </a>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPrompt;

