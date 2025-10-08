import { useState } from 'react';
import { Box, Chip, IconButton, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@wishlabs/shared';

interface Citizen {
  id: number;
  name: string;
  age: number;
  mood: string;
  activity: string;
  position: { x: number; y: number };
  needs?: {
    hunger: number;
    sleep: number;
    social: number;
    hygiene: number;
    fun: number;
  };
  personality?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

interface CitizenTableProps {
  citizens: Citizen[];
  loading: boolean;
  searchTerm: string;
  moodFilter: string;
}

export default function CitizenTable({ citizens, loading, searchTerm, moodFilter }: CitizenTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'success';
      case 'neutral': return 'info';
      case 'unhappy': return 'error';
      default: return 'default';
    }
  };

  const filteredCitizens = citizens.filter(citizen => {
    const matchesSearch = citizen.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = moodFilter === 'all' || citizen.mood === moodFilter;
    return matchesSearch && matchesMood;
  });

  if (loading) {
    return (
      <Box className="flex justify-center py-8">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Name</TableCell>
          <TableCell>Age</TableCell>
          <TableCell>Mood</TableCell>
          <TableCell>Activity</TableCell>
          <TableCell>Position</TableCell>
          <TableCell>Needs</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredCitizens.map((citizen) => (
          <>
            <TableRow key={citizen.id} hover>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => toggleRow(citizen.id)}
                >
                  {expandedRows.has(citizen.id) ? '▼' : '▶'}
                </IconButton>
              </TableCell>
              <TableCell>{citizen.name}</TableCell>
              <TableCell>{citizen.age}</TableCell>
              <TableCell>
                <Chip 
                  label={citizen.mood} 
                  color={getMoodColor(citizen.mood) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>{citizen.activity}</TableCell>
              <TableCell>({citizen.position.x}, {citizen.position.y})</TableCell>
              <TableCell>
                {citizen.needs && (
                  <Box className="flex gap-1">
                    <Chip 
                      label={`H:${citizen.needs.hunger.toFixed(0)}`} 
                      size="small" 
                      variant="outlined"
                      color={citizen.needs.hunger < 30 ? 'error' : citizen.needs.hunger < 70 ? 'warning' : 'success'}
                    />
                    <Chip 
                      label={`S:${citizen.needs.sleep.toFixed(0)}`} 
                      size="small" 
                      variant="outlined"
                      color={citizen.needs.sleep < 30 ? 'error' : citizen.needs.sleep < 70 ? 'warning' : 'success'}
                    />
                  </Box>
                )}
              </TableCell>
            </TableRow>
            {expandedRows.has(citizen.id) && (
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                  <Box className="py-4">
                    <Typography variant="h6" className="mb-4">
                      Detailed Information
                    </Typography>
                    
                    {citizen.needs && (
                      <Box className="mb-4">
                        <Typography variant="subtitle2" className="mb-2">
                          Needs
                        </Typography>
                        <Box className="flex gap-2 flex-wrap">
                          <Chip 
                            label={`Hunger: ${citizen.needs.hunger.toFixed(1)}`} 
                            color={citizen.needs.hunger < 30 ? 'error' : citizen.needs.hunger < 70 ? 'warning' : 'success'}
                          />
                          <Chip 
                            label={`Sleep: ${citizen.needs.sleep.toFixed(1)}`} 
                            color={citizen.needs.sleep < 30 ? 'error' : citizen.needs.sleep < 70 ? 'warning' : 'success'}
                          />
                          <Chip 
                            label={`Social: ${citizen.needs.social.toFixed(1)}`} 
                            color={citizen.needs.social < 30 ? 'error' : citizen.needs.social < 70 ? 'warning' : 'success'}
                          />
                          <Chip 
                            label={`Hygiene: ${citizen.needs.hygiene.toFixed(1)}`} 
                            color={citizen.needs.hygiene < 30 ? 'error' : citizen.needs.hygiene < 70 ? 'warning' : 'success'}
                          />
                          <Chip 
                            label={`Fun: ${citizen.needs.fun.toFixed(1)}`} 
                            color={citizen.needs.fun < 30 ? 'error' : citizen.needs.fun < 70 ? 'warning' : 'success'}
                          />
                        </Box>
                      </Box>
                    )}

                    {citizen.personality && (
                      <Box>
                        <Typography variant="subtitle2" className="mb-2">
                          Personality (Big Five)
                        </Typography>
                        <Box className="flex gap-2 flex-wrap">
                          <Chip 
                            label={`Openness: ${citizen.personality.openness.toFixed(2)}`} 
                            variant="outlined"
                          />
                          <Chip 
                            label={`Conscientiousness: ${citizen.personality.conscientiousness.toFixed(2)}`} 
                            variant="outlined"
                          />
                          <Chip 
                            label={`Extraversion: ${citizen.personality.extraversion.toFixed(2)}`} 
                            variant="outlined"
                          />
                          <Chip 
                            label={`Agreeableness: ${citizen.personality.agreeableness.toFixed(2)}`} 
                            variant="outlined"
                          />
                          <Chip 
                            label={`Neuroticism: ${citizen.personality.neuroticism.toFixed(2)}`} 
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
}
