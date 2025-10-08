import { useState, useEffect } from 'react';
import { Card, Typography, Grid, Box, LinearProgress } from '@wishlabs/shared';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export default function SimulationMetrics() {
  const [metrics, setMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    networkLatency: 12,
    activeConnections: 3,
  });

  const [activityData, setActivityData] = useState([
    { time: '00:00', activity: 20 },
    { time: '01:00', activity: 15 },
    { time: '02:00', activity: 10 },
    { time: '03:00', activity: 8 },
    { time: '04:00', activity: 12 },
    { time: '05:00', activity: 18 },
    { time: '06:00', activity: 35 },
    { time: '07:00', activity: 65 },
    { time: '08:00', activity: 80 },
    { time: '09:00', activity: 75 },
    { time: '10:00', activity: 70 },
    { time: '11:00', activity: 68 },
    { time: '12:00', activity: 72 },
    { time: '13:00', activity: 78 },
    { time: '14:00', activity: 75 },
    { time: '15:00', activity: 70 },
    { time: '16:00', activity: 65 },
    { time: '17:00', activity: 85 },
    { time: '18:00', activity: 90 },
    { time: '19:00', activity: 75 },
    { time: '20:00', activity: 60 },
    { time: '21:00', activity: 45 },
    { time: '22:00', activity: 30 },
    { time: '23:00', activity: 25 },
  ]);

  const [weatherHistory, setWeatherHistory] = useState([
    { time: '00:00', temperature: 18, weather: 'clear' },
    { time: '06:00', temperature: 16, weather: 'clear' },
    { time: '12:00', temperature: 22, weather: 'sunny' },
    { time: '18:00', temperature: 20, weather: 'cloudy' },
    { time: '24:00', temperature: 17, weather: 'rain' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(5, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 5)),
        activeConnections: Math.max(1, Math.min(10, prev.activeConnections + Math.floor((Math.random() - 0.5) * 2))),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <div className="p-6">
        <Typography variant="h6" className="mb-4">
          System Performance
        </Typography>
        
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Box className="space-y-4">
              <Box>
                <Box className="flex justify-between mb-1">
                  <Typography variant="body2">CPU Usage</Typography>
                  <Typography variant="body2">{metrics.cpuUsage.toFixed(1)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.cpuUsage} 
                  color={metrics.cpuUsage > 70 ? 'error' : metrics.cpuUsage > 50 ? 'warning' : 'primary'}
                />
              </Box>
              
              <Box>
                <Box className="flex justify-between mb-1">
                  <Typography variant="body2">Memory Usage</Typography>
                  <Typography variant="body2">{metrics.memoryUsage.toFixed(1)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.memoryUsage} 
                  color={metrics.memoryUsage > 80 ? 'error' : metrics.memoryUsage > 60 ? 'warning' : 'primary'}
                />
              </Box>
              
              <Box>
                <Box className="flex justify-between mb-1">
                  <Typography variant="body2">Network Latency</Typography>
                  <Typography variant="body2">{metrics.networkLatency.toFixed(1)}ms</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(metrics.networkLatency / 50) * 100} 
                  color={metrics.networkLatency > 30 ? 'error' : metrics.networkLatency > 20 ? 'warning' : 'primary'}
                />
              </Box>
              
              <Box>
                <Typography variant="body2">Active Connections: {metrics.activeConnections}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Activity Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Daily Activity Pattern
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Grid>

          {/* Weather History */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Weather History (24h)
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weatherHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
}
