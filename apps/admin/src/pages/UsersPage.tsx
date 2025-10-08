import { useState, useEffect } from 'react';
import { Container, Typography, Card, Box, TextField, Select, MenuItem, Chip } from '@wishlabs/shared';
import CitizenTable from '@admin/components/CitizenTable';

export default function UsersPage() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');

  useEffect(() => {
    // TODO: Load citizens from API
    const mockCitizens = [
      { id: 1, name: 'Alex', age: 28, mood: 'happy', activity: 'walking', position: { x: 10, y: 15 } },
      { id: 2, name: 'Sam', age: 34, mood: 'neutral', activity: 'idle', position: { x: 5, y: 8 } },
      { id: 3, name: 'Jordan', age: 22, mood: 'unhappy', activity: 'working', position: { x: 20, y: 12 } },
    ];
    
    setTimeout(() => {
      setCitizens(mockCitizens);
      setLoading(false);
    }, 1000);
  }, []);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'success';
      case 'neutral': return 'info';
      case 'unhappy': return 'error';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
    { 
      field: 'mood', 
      headerName: 'Mood', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getMoodColor(params.value) as any}
          size="small"
        />
      )
    },
    { field: 'activity', headerName: 'Activity', width: 150 },
    { 
      field: 'position', 
      headerName: 'Position', 
      width: 120,
      renderCell: (params) => `(${params.value.x}, ${params.value.y})`
    },
  ];

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        Citizens Management
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        View and manage all citizens in the current world.
      </Typography>

      <Card>
        <div className="p-6">
          <Box className="mb-4 flex gap-4">
            <TextField
              label="Search citizens"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              className="min-w-[200px]"
            />
            <Select
              value={moodFilter}
              label="Mood Filter"
              onChange={(value) => setMoodFilter(value)}
              className="min-w-[120px]"
            >
              <MenuItem value="all">All Moods</MenuItem>
              <MenuItem value="happy">Happy</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
              <MenuItem value="unhappy">Unhappy</MenuItem>
            </Select>
          </Box>

          <CitizenTable 
            citizens={citizens}
            loading={loading}
            searchTerm={searchTerm}
            moodFilter={moodFilter}
          />
        </div>
      </Card>
    </Container>
  );
}
