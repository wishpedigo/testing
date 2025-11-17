import { useEffect, useRef } from 'react';

interface SpiralCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

interface Particle {
  progress: number;
  speed: number;
  strokeVariation: number;
}

const SpiralCanvas = ({ width = 800, height = 600, className }: SpiralCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create deep teal background with painted texture
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a1929');
    gradient.addColorStop(1, '#0f1419');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add canvas texture effect
    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalCompositeOperation = 'source-over';

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    const turns = 3;
    const numParticles = 250;

    // Create spiral particles with unique variations for each
    const particles: Particle[] = Array.from({ length: numParticles }, (_, i) => ({
      progress: (i / numParticles) * turns * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.01,
      strokeVariation: Math.random(),
    }));

    let frameCount = 0;

    const animate = () => {
      frameCount++;
      
      // Fade background slightly for trail effect (more subtle)
      ctx.fillStyle = 'rgba(10, 20, 29, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Draw painted spiral with visible brush strokes
      particles.forEach((particle) => {
        // Calculate position on spiral with slight randomness for hand-painted feel
        const radius = (particle.progress / (turns * Math.PI * 2)) * maxRadius;
        const noiseX = (Math.sin(particle.progress * 5 + particle.strokeVariation) * 2);
        const noiseY = (Math.cos(particle.progress * 5 + particle.strokeVariation) * 2);
        const x = centerX + radius * Math.cos(particle.progress) + noiseX;
        const y = centerY + radius * Math.sin(particle.progress) + noiseY;

        // Calculate angle for brush stroke rotation (tangent to spiral)
        const angle = particle.progress + Math.PI / 2 + (particle.strokeVariation - 0.5) * 0.3;
        
        // More varied, chunky brush stroke dimensions
        const baseLength = 15 + Math.sin(particle.progress * 2) * 8;
        const baseWidth = 6 + Math.sin(particle.progress * 3) * 3;
        const strokeLength = baseLength + (particle.strokeVariation - 0.5) * 6;
        const strokeWidth = baseWidth + (particle.strokeVariation - 0.5) * 2;
        
        // Warm coral color with variation
        const colorVariation = Math.sin(particle.progress * 4 + particle.strokeVariation) * 0.2;
        const r = 255;
        const g = 180 + colorVariation * 30;
        const b = 100 + colorVariation * 40;
        const opacity = 0.7 + Math.sin(particle.progress * 3) * 0.2 + (particle.strokeVariation - 0.5) * 0.15;

        // Draw multiple overlapping brush strokes for texture
        const numStrokes = 2 + Math.floor(particle.strokeVariation * 2);
        for (let stroke = 0; stroke < numStrokes; stroke++) {
          const strokeOffset = (stroke - (numStrokes - 1) / 2) * 3;
          const strokeAngle = angle + (stroke - (numStrokes - 1) / 2) * 0.15;
          const strokeOpacity = opacity * (1 - stroke * 0.2);
          
          ctx.save();
          ctx.translate(x + strokeOffset * Math.cos(angle), y + strokeOffset * Math.sin(angle));
          ctx.rotate(strokeAngle);
          
          // Create irregular brush stroke shape (not perfect ellipse)
          ctx.beginPath();
          const points = 8;
          for (let i = 0; i <= points; i++) {
            const t = (i / points) * Math.PI * 2;
            const rx = strokeLength * (1 + Math.sin(t * 3) * 0.1);
            const ry = strokeWidth * (1 + Math.cos(t * 2) * 0.1);
            const px = rx * Math.cos(t);
            const py = ry * Math.sin(t);
            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.closePath();
          
          // Paint-like fill with texture
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${strokeOpacity})`;
          ctx.fill();
          
          // Add some paint texture with slight outline
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${strokeOpacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.restore();
        }

        // Update particle progress
        particle.progress += particle.speed;
        if (particle.progress > turns * Math.PI * 2) {
          particle.progress = 0;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default SpiralCanvas;

