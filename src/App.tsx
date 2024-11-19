import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Sun as SunIcon,
  Moon as MoonIcon,
  Bot as BotIcon
} from 'lucide-react';


import { useOccurrences } from './useOccurrences';
import { MapMarker } from './MapMarker';

const Dashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeInterval, setActiveInterval] = useState('12h');
  const [isHeatmap, setIsHeatmap] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const intervals = ['1h', '3h', '12h', '1d', '3d', '1sem', 'custom'];

  // Fetch
  const { occurrences, isLoading, error } = useOccurrences();

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={`container ${isDarkMode ? 'dark' : ''}`}>
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
          </a>

          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
            <span>{isDarkMode ? 'Tema Claro' : 'Tema Escuro'}</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Ocorrências</h3>
          <div className="value">--</div>
        </div>
        <div className="stat-card">
          <h3>Total de Localizações</h3>
          <div className="value">--</div>
        </div>
        <div className="stat-card">
          <h3>Média de Confiabilidade</h3>
          <div className="value">--</div>
        </div>
        <div className="stat-card">
          <h3>Usuários Ativos</h3>
          <div className="value">--</div>
        </div>

        <div className="button-group">
          {intervals.map(interval => (
            <button
              key={interval}
              className={activeInterval === interval ? 'selected' : ''}
              onClick={() => setActiveInterval(interval)}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="view-switch absolute z-[1000] top-2 right-2 flex items-center space-x-2">
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

        <div style={{ height: '100vh', width: '100%' }}>
          <MapContainer
            center={[-23.55052, -46.633308]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {occurrences.map((occurrence) => (
              <MapMarker
                key={occurrence.occId}
                occurrence={occurrence}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;