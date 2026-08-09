import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutGaugeProps {
  score: number; // 0 - 100
  label?: string;
  size?: number;
}

export const DonutGauge: React.FC<DonutGaugeProps> = ({
  score,
  label = 'TRUST SCORE',
  size = 180
}) => {
  const isSafe = score >= 85;
  const primaryColor = isSafe ? '#00F2FE' : '#FF2E93';
  const glowColor = isSafe ? 'rgba(0, 242, 254, 0.3)' : 'rgba(255, 46, 147, 0.3)';
  const trackColor = '#131A29';

  const data = {
    labels: ['Trust Level', 'Risk Level'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [primaryColor, trackColor],
        borderColor: [primaryColor, 'rgba(255, 255, 255, 0.05)'],
        borderWidth: 2,
        cutout: '80%',
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#0B0F19',
        titleColor: '#00F2FE',
        bodyColor: '#ffffff',
        borderColor: primaryColor,
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`
        }
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div 
        className="relative flex items-center justify-center transition-all duration-500 rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: `0 0 30px ${glowColor}`
        }}
      >
        <Doughnut data={data} options={options} />
        
        {/* Center Text HUD Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span 
            className="font-orbitron font-extrabold tracking-tighter"
            style={{
              fontSize: `${Math.round(size * 0.24)}px`,
              color: primaryColor,
              textShadow: `0 0 15px ${primaryColor}`
            }}
          >
            {score}%
          </span>
          <span className="text-[10px] uppercase font-mono-code tracking-widest text-slate-400 mt-0.5">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
