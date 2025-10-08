import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Typography, Box, Alert, Button, Card, LinkText } from '@wishlabs/shared';
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
      <Card
        title="Login"
      >
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />

          <Box className="mt-6 flex justify-end">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              size="sm"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
          </Box>
        </form>

        <Box className="mt-4 text-center">
          <Link to="/forgot-password">
            <LinkText>Forgot password?</LinkText>
          </Link>
        </Box>

        <Box className="mt-4 text-center">
          <Typography variant="body2">
            Don't have an account?{' '}
      
          </Typography>
          <Link to="/signup">
              <LinkText>Sign Up</LinkText>
            </Link>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;

