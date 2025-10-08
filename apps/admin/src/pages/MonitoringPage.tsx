import { useState, useEffect } from 'react';
import { Container, Typography, Card, Grid, Box, Chip } from '@wishlabs/shared';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import SimulationMetrics from '@admin/components/SimulationMetrics';

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState({
    fps: 30,
    citizenCount: 10,
    activeWorld: 'Paradise Valley',
    weather: 'sunny',
    temperature: 22,
  });

  const [moodData, setMoodData] = useState([
    { name: 'Happy', value: 6, color: '#10b981' },
    { name: 'Neutral', value: 3, color: '#3b82f6' },
    { name: 'Unhappy', value: 1, color: '#ef4444' },
  ]);

  const [fpsHistory, setFpsHistory] = useState([
    { time: '00:00', fps: 30 },
    { time: '00:01', fps: 29 },
    { time: '00:02', fps: 31 },
    { time: '00:03', fps: 30 },
    { time: '00:04', fps: 28 },
  ]);

  useEffect(() => {
    // TODO: Connect to WebSocket for real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fps: 28 + Math.random() * 4,
        temperature: 20 + Math.random() * 10,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        Real-time Monitoring
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        Monitor simulation performance and citizen activity in real-time.
      </Typography>

      <Grid container spacing={3}>
        {/* Current Status */}
        <Grid item xs={12}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Current Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                  <Box className="text-center">
                    <Typography variant="h4" className="text-primary-600">
                      {metrics.fps.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      FPS
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Box className="text-center">
                    <Typography variant="h4" className="text-primary-600">
                      {metrics.citizenCount}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Citizens
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="text-center">
                    <Typography variant="h6">
                      {metrics.activeWorld}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Active World
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Box className="text-center">
                    <Chip 
                      label={metrics.weather} 
                      color="primary" 
                      variant="outlined"
                    />
                    <Typography variant="body2" className="text-gray-600 mt-1">
                      Weather
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Box className="text-center">
                    <Typography variant="h4" className="text-primary-600">
                      {metrics.temperature.toFixed(0)}°C
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Temperature
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Card>
        </Grid>

        {/* FPS Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Simulation FPS
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fpsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="fps" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>

        {/* Mood Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <div className="p-6">
              <Typography variant="h6" className="mb-4">
                Citizen Mood Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>

        {/* Detailed Metrics */}
        <Grid item xs={12}>
          <SimulationMetrics />
        </Grid>
      </Grid>
    </Container>
  );
}
