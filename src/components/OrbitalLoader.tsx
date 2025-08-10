
import React, { useEffect, useRef } from 'react';

interface OrbitalLoaderProps {
  size?: number;
  className?: string;
}

const OrbitalLoader: React.FC<OrbitalLoaderProps> = ({ size = 400, className = "" }) => {
  const lettersRef = useRef<(SVGTextElement | null)[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const letters = lettersRef.current.filter(Boolean) as SVGTextElement[];
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 4;
    let angle = 0;

    const animate = () => {
      angle += 0.01;
      letters.forEach((el, i) => {
        const offset = i * 0.3;
        const x = centerX + radius * Math.cos(angle - offset);
        const y = centerY + radius * Math.sin(angle - offset);
        el.setAttribute('x', x.toString());
        el.setAttribute('y', y.toString());
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        style={{ width: size, height: size }}
        className="font-orbitron"
      >
        {/* Center point */}
        <circle cx={size / 2} cy={size / 2} r="2" fill="white" />
        
        {/* Orbiting letters */}
        {['T', 'R', 'E', 'N', 'D', 'L', 'Y'].map((letter, index) => (
          <text
            key={index}
            ref={(el) => { lettersRef.current[index] = el; }}
            x={size / 2}
            y={size / 4}
            fill="white"
            fontSize="24"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              textShadow: '0 0 10px #fff',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
            }}
          >
            {letter}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default OrbitalLoader;
