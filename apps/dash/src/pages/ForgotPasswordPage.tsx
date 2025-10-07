import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, TextField, Typography, Box, Alert, Button, Card } from '@wishlabs/shared';
import { resetPassword } from '@wishlabs/firebase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-16">
      <Card>
        <Typography variant="h4" component="h1" gutterBottom className="text-center">
          Reset Password
        </Typography>
        <Typography variant="body1" color="text.secondary" className="text-center mb-6">
          Enter your email to receive a password reset link
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4">
            Password reset email sent! Check your inbox.
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

          <Box className="mt-6">
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Box>
        </form>

        <Box className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </Box>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;

