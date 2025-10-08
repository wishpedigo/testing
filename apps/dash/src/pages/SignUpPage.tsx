import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Typography, Box, Alert, Button, Card, LinkText } from '@wishlabs/shared';
import { signUp } from '@wishlabs/firebase';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-16">
      <Card title="Create Account">
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Display Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            margin="normal"
          />
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
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Box>
        </form>

        <Box className="mt-4 text-center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login">
              <LinkText>Sign In</LinkText>
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};


export default SignUpPage;