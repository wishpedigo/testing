import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Typography, Box, Alert, Button, Card } from '@wishlabs/shared';
import { signIn } from '@wishlabs/firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-16">
      <Card>
        <Typography variant="h4" component="h1" gutterBottom className="text-center">
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" className="text-center mb-6">
          Sign in to access your account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />

          <Box className="mt-6">
            <Button
              fullWidth
              variant="primary"
              type="submit"
              disabled={loading}
              size="large"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </form>

        <Box className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 hover:underline">
            Forgot password?
          </Link>
        </Box>

        <Box className="mt-4 text-center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;

