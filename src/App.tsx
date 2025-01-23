import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Sun as SunIcon,
  Moon as MoonIcon,
  Bot as BotIcon
} from 'lucide-react';


import { useOccurrences } from './hooks/useOccurrences';
import { MapMarker } from './components/MapMarker';

import { MapHeatmap } from './components/Heatmap';

import { RectangleMap } from './components/RectangleMap';

const Dashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });
  const [activeInterval, setActiveInterval] = useState('');
  const [isHeatmap, setIsHeatmap] = useState(() => {
    const savedView = localStorage.getItem('isHeatmap');
    return savedView ? JSON.parse(savedView) : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('isHeatmap', JSON.stringify(isHeatmap));
  }, [isHeatmap]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const intervals = ['1h', '3h', '12h', '1d', '3d', '1sem', '1mes'];

  // Fetch
  const { occurrences, locations, users, isLoading, error, fetchOccurrencesByInterval, updateDataByInterval } = useOccurrences();

  useEffect(() => {
    const interval = setInterval(() => updateDataByInterval(activeInterval), 10 * 60 * 1000); // 10 minutos
    return () => clearInterval(interval);
  }, [activeInterval, updateDataByInterval]);

  const handleIntervalClick = (interval: string) => {
    setActiveInterval(interval);
    fetchOccurrencesByInterval(interval);
  };

  const avgReliability = (occurrences.reduce((acc, curr) =>
    acc + curr.reliability, 0) / occurrences.length).toFixed(1);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header">
        <h1>Dashboard de Ocorrências</h1>
        <p>Visualização em tempo real de ocorrências e localizações</p>

        <div className="flex items-center space-x-2">
          <a
            href="https://t.me/prontaBot?start=start"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <BotIcon />
            <span>Bot</span>
          </a>

          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
          >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
            <span>{isDarkMode ? 'Tema Escuro' : 'Tema Claro'}</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Ocorrências</h3>
          <div className="value">{occurrences ? occurrences.length : "--"}</div>
        </div>
        <div className="stat-card">
          <h3>Total de Localizações</h3>
          <div className="value">{locations ? locations.length : "--"}</div>
        </div>
        <div className="stat-card">
          <h3>Média de Confiabilidade</h3>
          <div className="value">{occurrences ? avgReliability : "--"}</div>
        </div>
        <div className="stat-card">
          <h3>Usuários Ativos</h3>
          <div className="value">{users ? users : "--"}</div>
        </div>

        <div className="button-group">
          {intervals.map(interval => (
            <button
              key={interval}
              className={activeInterval === interval ? 'selected' : ''}
              onClick={() => handleIntervalClick(interval)}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer
            center={[-22.862065, -47.0528789]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <RectangleMap
              locations={locations}
            />

            <div className="leaflet-top leaflet-right">
              <div className="view-switch leaflet-control">
                <span>Markers</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isHeatmap}
                    onChange={() => setIsHeatmap(!isHeatmap)}
                  />
                  <span className="slider"></span>
                </label>
                <span>Heatmap</span>
              </div>
            </div>

            {isHeatmap ? (<MapHeatmap
              occurrences={occurrences}
            />) : (occurrences.map((occurrence) => (
              <MapMarker
                key={occurrence.occId}
                occurrence={occurrence}
              />
            )))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;