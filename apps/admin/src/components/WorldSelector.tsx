import { useState, useEffect } from 'react';
import { Select, MenuItem, Box, Typography, Chip } from '@wishlabs/shared';

interface World {
  id: string;
  name: string;
  isActive: boolean;
  citizenCount: number;
  createdAt: string;
}

interface WorldSelectorProps {
  value: string;
  onChange: (worldId: string) => void;
}

export default function WorldSelector({ value, onChange }: WorldSelectorProps) {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load worlds from API
    const mockWorlds: World[] = [
      {
        id: '1',
        name: 'Paradise Valley',
        isActive: true,
        citizenCount: 10,
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'Mountain View',
        isActive: false,
        citizenCount: 15,
        createdAt: '2024-01-20T14:45:00Z',
      },
      {
        id: '3',
        name: 'Riverside',
        isActive: false,
        citizenCount: 8,
        createdAt: '2024-01-25T09:15:00Z',
      },
    ];

    setTimeout(() => {
      setWorlds(mockWorlds);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Select
        value={value}
        label="Select World"
        onChange={(val) => onChange(val)}
        disabled={loading}
        fullWidth
      >
        {worlds.map((world) => (
          <MenuItem key={world.id} value={world.id}>
            <Box className="flex items-center justify-between w-full">
              <Box>
                <Typography variant="body1">
                  {world.name}
                  {world.isActive && (
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="primary" 
                      className="ml-2"
                    />
                  )}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  {world.citizenCount} citizens • Created {formatDate(world.createdAt)}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
      
      {value && (
        <Box className="mt-2">
          {(() => {
            const selectedWorld = worlds.find(w => w.id === value);
            if (!selectedWorld) return null;
            
            return (
              <Box className="p-3 bg-gray-50 rounded">
                <Typography variant="subtitle2" gutterBottom>
                  World Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Name:</strong> {selectedWorld.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Citizens:</strong> {selectedWorld.citizenCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> {selectedWorld.isActive ? 'Active' : 'Inactive'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {formatDate(selectedWorld.createdAt)}
                </Typography>
              </Box>
            );
          })()}
        </Box>
      )}
    </Box>
  );
}
