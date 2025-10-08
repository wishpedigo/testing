import { useState } from 'react';
import { Box, TextField, Slider, Button, Typography, Grid, Select, MenuItem } from '@wishlabs/shared';

interface GenerationParams {
  name: string;
  gridWidth: number;
  gridHeight: number;
  seed?: number;
  terrainDensity: {
    water: number;
    road: number;
    grass: number;
  };
  buildingDensity: number;
  buildingTypeRatios: {
    house: number;
    shop: number;
    community: number;
  };
  citizenCount: number;
  personalityDistribution: {
    openness: [number, number];
    conscientiousness: [number, number];
    extraversion: [number, number];
    agreeableness: [number, number];
    neuroticism: [number, number];
  };
}

interface WorldGenerationFormProps {
  onGenerate: (params: GenerationParams) => void;
  disabled?: boolean;
}

export default function WorldGenerationForm({ onGenerate, disabled }: WorldGenerationFormProps) {
  const [params, setParams] = useState<GenerationParams>({
    name: 'New Paradise Valley',
    gridWidth: 50,
    gridHeight: 50,
    seed: undefined,
    terrainDensity: {
      water: 0.1,
      road: 0.2,
      grass: 0.7,
    },
    buildingDensity: 0.3,
    buildingTypeRatios: {
      house: 0.6,
      shop: 0.3,
      community: 0.1,
    },
    citizenCount: 20,
    personalityDistribution: {
      openness: [0.3, 0.7],
      conscientiousness: [0.3, 0.7],
      extraversion: [0.3, 0.7],
      agreeableness: [0.3, 0.7],
      neuroticism: [0.3, 0.7],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(params);
  };

  const updateParam = (key: string, value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedParam = (parentKey: string, childKey: string, value: any) => {
    setParams(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey as keyof GenerationParams],
        [childKey]: value,
      },
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Settings */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Basic Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="World Name"
              value={params.name}
              onChange={(e) => updateParam('name', e.target.value)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Seed (optional)"
              type="number"
              value={params.seed || ''}
              onChange={(e) => updateParam('seed', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Box>

      <hr className="my-6" />

      {/* Grid Size */}
      <Box>
        <Typography variant="h6" className="mb-4">
          Grid Size
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography className="mb-2">Width: {params.gridWidth}</Typography>
            <Slider
              value={params.gridWidth}
              onChange={(value) => updateParam('gridWidth', value)}
              min={20}
              max={200}
              step={10}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className="mb-2">Height: {params.gridHeight}</Typography>
            <Slider
              value={params.gridHeight}
              onChange={(value) => updateParam('gridHeight', value)}
              min={20}
              max={200}
              step={10}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Box>

      <hr className="my-6" />

      {/* Terrain Density */}
      <Box>
        <Typography variant="h6" className="mb-4">
          Terrain Density
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography className="mb-2">Water: {(params.terrainDensity.water * 100).toFixed(0)}%</Typography>
            <Slider
              value={params.terrainDensity.water}
              onChange={(value) => updateNestedParam('terrainDensity', 'water', value)}
              min={0}
              max={0.5}
              step={0.05}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="mb-2">Roads: {(params.terrainDensity.road * 100).toFixed(0)}%</Typography>
            <Slider
              value={params.terrainDensity.road}
              onChange={(value) => updateNestedParam('terrainDensity', 'road', value)}
              min={0}
              max={0.5}
              step={0.05}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="mb-2">Grass: {(params.terrainDensity.grass * 100).toFixed(0)}%</Typography>
            <Slider
              value={params.terrainDensity.grass}
              onChange={(value) => updateNestedParam('terrainDensity', 'grass', value)}
              min={0}
              max={1}
              step={0.05}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Box>

      <hr className="my-6" />

      {/* Building Settings */}
      <Box>
        <Typography variant="h6" className="mb-4">
          Building Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography className="mb-2">Building Density: {(params.buildingDensity * 100).toFixed(0)}%</Typography>
            <Slider
              value={params.buildingDensity}
              onChange={(value) => updateParam('buildingDensity', value)}
              min={0.1}
              max={0.8}
              step={0.05}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className="mb-2">Citizen Count: {params.citizenCount}</Typography>
            <Slider
              value={params.citizenCount}
              onChange={(value) => updateParam('citizenCount', value)}
              min={5}
              max={100}
              step={5}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        
        <Typography variant="subtitle2" className="mt-4 mb-2">
          Building Type Ratios
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography className="mb-2">Houses: {(params.buildingTypeRatios.house * 100).toFixed(0)}%</Typography>
            <Slider
              value={params.buildingTypeRatios.house}
              onChange={(value) => updateNestedParam('buildingTypeRatios', 'house', value)}
              min={0}
              max={1}
              step={0.1}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="mb-2">Shops: {(params.buildingTypeRatios.shop * 100).toFixed(0)}%</Typography>
            <Slider
              value={params.buildingTypeRatios.shop}
              onChange={(value) => updateNestedParam('buildingTypeRatios', 'shop', value)}
              min={0}
              max={1}
              step={0.1}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="mb-2">Community: {(params.buildingTypeRatios.community * 100).toFixed(0)}%</Typography>
            <Slider
              value={params.buildingTypeRatios.community}
              onChange={(value) => updateNestedParam('buildingTypeRatios', 'community', value)}
              min={0}
              max={1}
              step={0.1}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Box>

      <hr className="my-6" />

      {/* Personality Distribution */}
      <Box>
        <Typography variant="h6" className="mb-4">
          Personality Distribution
        </Typography>
        <Typography variant="body2" className="mb-4 text-gray-600">
          Set the range for each Big Five personality trait (min, max values)
        </Typography>
        {Object.entries(params.personalityDistribution).map(([trait, [min, max]]) => (
          <Box key={trait} className="mb-4">
            <Typography className="mb-2">
              {trait.charAt(0).toUpperCase() + trait.slice(1)}: {min.toFixed(1)} - {max.toFixed(1)}
            </Typography>
            <Box className="px-2">
              <Slider
                value={[min, max]}
                onChange={(value) => updateNestedParam('personalityDistribution', trait, value)}
                min={0}
                max={1}
                step={0.1}
                valueLabelDisplay="auto"
                disabled={disabled}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Box className="text-center pt-4">
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={disabled}
          className="min-w-[200px]"
        >
          Generate World
        </Button>
      </Box>
    </Box>
  );
}
