import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { TextField, Button, Box, Container } from '@mui/material';
import './Progress.css';  // Importa el archivo CSS aquí
import { useAuth } from '../../auth/AuthProvider';

const ExerciseHistoryChart = () => {
  const { getAccessToken } = useAuth();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [timeRange, setTimeRange] = useState('MAX');

  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken();
      const response = await fetch('https://fitmaster-backend-production.up.railway.app/exercises/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, [getAccessToken]);

  useEffect(() => {
    const filtered = data.filter(item => item.name.toLowerCase().includes(exerciseName.toLowerCase()));

    const now = new Date();
    const filteredByTimeRange = filtered.filter(item => {
      const itemDate = new Date(item.created_at);
      switch (timeRange) {
        case '7D':
          return (now - itemDate) / (1000 * 60 * 60 * 24) <= 7;
        case '1M':
          return (now - itemDate) / (1000 * 60 * 60 * 24) <= 30;
        case '3M':
          return (now - itemDate) / (1000 * 60 * 60 * 24) <= 90;
        case '1A':
          return (now - itemDate) / (1000 * 60 * 60 * 24) <= 365;
        case 'MAX':
        default:
          return true;
      }
    });
    setFilteredData(filteredByTimeRange);
  }, [exerciseName, timeRange, data]);

  const createChartData = (key, label) => {
    return {
      labels: filteredData.map(item => new Date(item.created_at).toLocaleDateString()),
      datasets: [
        {
          label: label,
          data: filteredData.map(item => item[key]),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  return (
    <main className="content">
      <TextField 
        label="Buscar Ejercicio" 
        variant="outlined" 
        value={exerciseName}
        onChange={e => setExerciseName(e.target.value)}
        fullWidth 
        margin="normal" 
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {['7D', '1M', '3M', '1A', 'MAX'].map(range => (
          <Button key={range} variant={timeRange === range ? 'contained' : 'outlined'} onClick={() => setTimeRange(range)}>
            {range}
          </Button>
        ))}
      </Box>
      <div className="exercises">
        <div className="chart-container">
          <h3>Peso</h3>
          <Chart type="line" data={createChartData('weight', 'Peso')} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h3>Repeticiones</h3>
          <Chart type="line" data={createChartData('reps', 'Repeticiones')} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h3>Series</h3>
          <Chart type="line" data={createChartData('sets', 'Series')} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h3>Duración</h3>
          <Chart type="line" data={createChartData('duration', 'Duración')} options={chartOptions} />
        </div>
      </div>
    </main>
  );
};

export default ExerciseHistoryChart;
