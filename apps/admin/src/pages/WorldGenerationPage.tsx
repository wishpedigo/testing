import { useState } from 'react';
import { Container, Typography, Card, Grid, Button, Box, Alert, CircularProgress } from '@wishlabs/shared';
import WorldGenerationForm from '@admin/components/WorldGenerationForm';

export default function WorldGenerationPage() {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGenerate = async (params: any) => {
    setGenerating(true);
    setMessage(null);
    
    try {
      // TODO: Call admin API to generate world
      console.log('Generating world with params:', params);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ type: 'success', text: 'World generated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate world. Please try again.' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        World Generation
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        Create new worlds for Paradise Valley with advanced procedural generation parameters.
      </Typography>

      {message && (
        <Alert severity={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Generation Parameters
              </Typography>
              <WorldGenerationForm 
                onGenerate={handleGenerate}
                disabled={generating}
              />
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Generation Status
              </Typography>
              {generating ? (
                <Box className="text-center py-4">
                  <CircularProgress />
                  <Typography variant="body2" className="mt-2">
                    Generating world...
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" className="text-gray-600">
                  Ready to generate a new world. Configure the parameters and click "Generate World".
                </Typography>
              )}
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
