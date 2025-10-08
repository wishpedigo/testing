import { useState, useEffect } from 'react';
import { Container, Typography, Card, Grid, Button, Box, Select, MenuItem, TextField, Alert } from '@wishlabs/shared';
import WorldSelector from '@admin/components/WorldSelector';

export default function DataToolsPage() {
  const [selectedWorld, setSelectedWorld] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
  const [query, setQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    if (!selectedWorld) {
      setMessage({ type: 'error', text: 'Please select a world to export.' });
      return;
    }

    setExporting(true);
    setMessage(null);

    try {
      // TODO: Call admin API to export data
      console.log('Exporting world:', selectedWorld, 'format:', exportFormat);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ type: 'success', text: `World data exported as ${exportFormat.toUpperCase()}` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) {
      setMessage({ type: 'error', text: 'Please enter a query.' });
      return;
    }

    try {
      // TODO: Execute custom query
      console.log('Executing query:', query);
      setMessage({ type: 'success', text: 'Query executed successfully. Results displayed below.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Query failed. Please check your syntax.' });
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        Data Tools
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        Export world data, execute custom queries, and manage database statistics.
      </Typography>

      {message && (
        <Alert severity={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* World Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                World Selection
              </Typography>
              <WorldSelector 
                value={selectedWorld}
                onChange={setSelectedWorld}
              />
            </div>
          </Card>
        </Grid>

        {/* Export Tools */}
        <Grid item xs={12} md={6}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Export Data
              </Typography>
              <Box className="space-y-4">
                <Select
                  value={exportFormat}
                  label="Export Format"
                  onChange={(value) => setExportFormat(value)}
                  fullWidth
                >
                  <MenuItem value="json">JSON</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="xml">XML</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  onClick={handleExport}
                  disabled={exporting || !selectedWorld}
                  fullWidth
                >
                  <span className="mr-1">📥</span>
                  {exporting ? 'Exporting...' : 'Export World Data'}
                </Button>
              </Box>
            </div>
          </Card>
        </Grid>

        {/* Custom Query */}
        <Grid item xs={12}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Custom Query
              </Typography>
              <Box className="space-y-4">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Query"
                  placeholder="Enter your custom query here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleQuery}
                  disabled={!query.trim()}
                >
                  <span className="mr-1">🔍</span>
                  Execute Query
                </Button>
              </Box>
            </div>
          </Card>
        </Grid>

        {/* Database Statistics */}
        <Grid item xs={12}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Database Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="text-center p-4 bg-gray-50 rounded">
                    <Typography variant="h4" className="text-primary-600">
                      3
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Total Worlds
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="text-center p-4 bg-gray-50 rounded">
                    <Typography variant="h4" className="text-primary-600">
                      30
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Total Citizens
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="text-center p-4 bg-gray-50 rounded">
                    <Typography variant="h4" className="text-primary-600">
                      15
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Total Buildings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="text-center p-4 bg-gray-50 rounded">
                    <Typography variant="h4" className="text-primary-600">
                      2.1MB
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Database Size
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
