import { useEffect, useRef } from 'react';

interface FragmentShaderCanvasProps {
  height?: number;
  className?: string;
}

const FragmentShaderCanvas = ({ 
  height = 600, 
  className
}: FragmentShaderCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const cleanupRef = useRef<(() => void) | null>(null);

  // Load whimsical Google Font (Indie Flower)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    const vertexShaderSource = `#version 300 es

in vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

    const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform float iGravity; // Gravity strength based on how long mouse stays still
uniform float iSecondSpiral; // Strength of second spiral center at mouse (0.0 to 1.0)

out vec4 fragColor;

#define PI 3.14159265359

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // Mouse interaction - displace pixels based on mouse position (gravity accumulates over time)
  vec2 mouseDistVec = fragCoord - iMouse;
  float mouseDist = length(mouseDistVec);
  
  // Two-phase gravity effect:
  // Phase 1 (0.0 to 0.6): Expand the gravity influence radius
  // Phase 2 (0.6 to 1.0): Shift the spiral center
  float phase1End = 0.6;
  float phase1Progress = min(1.0, iGravity / phase1End); // 0 to 1 during phase 1
  float phase2Progress = max(0.0, (iGravity - phase1End) / (1.0 - phase1End)); // 0 to 1 during phase 2
  
  // Expand gravity radius during phase 1 (200px to 400px)
  float baseInfluenceDist = 200.0;
  float expandedInfluenceDist = 400.0;
  float mouseInfluenceDist = mix(baseInfluenceDist, expandedInfluenceDist, phase1Progress);
  
  // Gravity strength accumulates - longer mouse stays still = stronger distortion
  // Multiplier increases more slowly during phase 1, faster during phase 2
  float gravityMultiplier = 1.0 + iGravity * 2.0 + phase2Progress * 2.0; // Up to 5x stronger
  
  // Create displacement vector - pixels push away from mouse (scaled by gravity)
  vec2 displacement = vec2(0.0);
  if (mouseDist > 0.0 && mouseDist < mouseInfluenceDist) {
    float strength = 1.0 - (mouseDist / mouseInfluenceDist);
    strength = pow(strength, 2.0); // Falloff curve
    // Push pixels away from mouse (radial push) - scales with gravity
    vec2 dir = normalize(mouseDistVec);
    displacement = dir * strength * 4.0 * gravityMultiplier;
    // Add perpendicular motion for swirling effect - scales with gravity
    vec2 perp = vec2(-dir.y, dir.x);
    displacement += perp * strength * sin(iTime * 3.0 + mouseDist * 0.1) * 2.0 * gravityMultiplier;
  }
  
  // Calculate mouse influence for "becoming real" effect
  float mouseDistForReality = length(fragCoord - iMouse);
  float realityRadius = 250.0; // How far the "becoming real" effect extends
  float realityStrength = 0.0;
  if (mouseDistForReality < realityRadius) {
    realityStrength = 1.0 - (mouseDistForReality / realityRadius);
    realityStrength = pow(realityStrength, 1.5); // Smooth falloff
  }
  
  // Apply displacement before pixelation
  vec2 disturbedCoord = fragCoord + displacement;
  
  // Dynamic pixelation - becomes smoother/more detailed when hovering (more "real")
  // Near mouse: smaller pixels (more detail), far from mouse: larger pixels (digital/blocky)
  float basePixelSize = 4.0; // More pixels overall (smaller = more pixels)
  float smoothPixelSize = 1.0; // Even more detailed near mouse
  float pixelSize = mix(basePixelSize, smoothPixelSize, realityStrength);
  
  vec2 pixelCoord = floor(disturbedCoord / pixelSize) * pixelSize;
  vec2 uv = (pixelCoord - iResolution.xy/2.)/iResolution.y;

  vec2 uv0 = uv;

  // Dynamic scale - becomes more detailed when hovering (more "real")
  float baseScale = 40.0; // More grid detail overall
  float detailedScale = 100.0; // Much more detail near mouse
  float scale = mix(baseScale, detailedScale, realityStrength);
  
  // Mouse interaction - warp the grid shape itself (gravity accumulates over time)
  vec2 mouseUV = (iMouse - iResolution.xy/2.)/iResolution.y;
  vec2 gridWarp = vec2(0.0);
  float mouseDistUV = length(uv - mouseUV);
  float warpRadius = 0.6; // How far the warp extends
  float baseWarpStrength = 0.08; // Base grid distortion
  float warpStrength = baseWarpStrength * gravityMultiplier; // Scales with gravity
  
  if (mouseDistUV < warpRadius) {
    float warpFactor = 1.0 - (mouseDistUV / warpRadius);
    warpFactor = pow(warpFactor, 1.5); // Falloff curve
    
    // Create bulge/distortion effect - expand grid outward from mouse (scales with gravity)
    vec2 dirFromMouse = normalize(uv - mouseUV);
    
    // Radial expansion (bulge effect) - scales with gravity
    gridWarp = dirFromMouse * warpFactor * warpStrength;
    
    // Add swirling/twisting to the grid - scales with gravity
    vec2 perpDir = vec2(-dirFromMouse.y, dirFromMouse.x);
    float swirlAmount = sin(iTime * 2.0 + length(uv) * 5.0) * 0.5 + 0.5;
    gridWarp += perpDir * warpFactor * warpStrength * swirlAmount * 0.2 * gravityMultiplier;
    
    // Create pinch effect - grid compresses toward mouse - scales with gravity
    gridWarp -= dirFromMouse * warpFactor * warpStrength * 0.15 * gravityMultiplier;
  }
  
  // Apply grid warping to UV coordinates
  vec2 warpedUV = uv + gridWarp;
  
  // Create square grid by quantizing to integers on warped coordinates
  vec2 gridUV = floor(warpedUV * scale) / scale;
  float row = gridUV.x * scale;
  float ln = gridUV.y * scale;

  // Mouse interaction - create glow effect near mouse
  float mouseGlow = 1.0 - smoothstep(0.0, 0.5, mouseDistUV); // Glow radius
  float mouseInfluence = mouseGlow * 0.5; // Intensity of mouse effect

  // Create pattern based on square grid (using warped UV for spiral)
  float m = .15;
  
  // Calculate spiral from original center
  float angle1 = atan(warpedUV.x, warpedUV.y) + iTime + mouseInfluence * 2.0;
  float r1 = m/PI*angle1;
  float spiralDist1 = length(warpedUV) - r1;
  
  // Calculate second spiral from mouse position (same concept as original, just different center)
  // Use the exact same calculation as the original spiral, just with UV relative to mouse
  vec2 mouseRelativeUV = warpedUV - mouseUV;
  float angle2 = atan(mouseRelativeUV.x, mouseRelativeUV.y) + iTime + mouseInfluence * 2.0;
  float r2 = m/PI*angle2;
  float spiralDist2 = length(mouseRelativeUV) - r2;
  
  // Blend between original spiral (center) and second spiral (mouse) based on iSecondSpiral strength
  float spiralDist = mix(spiralDist1, spiralDist2, iSecondSpiral);
  spiralDist = mod(spiralDist - m, 2.*m) - m;
  float stripe = step(0.0, abs(spiralDist) - m * 0.3);
  
  // Create square-based pattern - mouse affects animation speed
  float squarePattern = mod(row + ln * 2.0 + iTime * (5.0 + mouseInfluence * 5.0), 4.0);
  float squareValue = floor(squarePattern);
  
  // Combine stripe with square grid using hard edges (no smoothstep)
  float pattern = step(0.5, stripe) * step(1.0, squareValue);

  vec3 bgCol = vec3(0.08, 0.05, 0.12);
  
  // All pixels use the same color
  vec3 col = vec3(0.21, 0.14, 0.27); // Single purple color for all pixels

  // Add mouse glow - brighten and shift colors near mouse
  col = mix(col, col * 1.5 + vec3(0.1, 0.05, 0.15), mouseGlow * 0.6);

  // Hard pixelated edges - use step instead of smooth blending
  float finalPattern = step(0.3, pattern + stripe * 0.5 + mouseInfluence * 0.3);
  vec3 finalCol = mix(bgCol, col, finalPattern);
  
  fragColor = vec4(finalCol, 1);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
      return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positions = [
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0,
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iMouseLocation = gl.getUniformLocation(program, 'iMouse');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const iGravityLocation = gl.getUniformLocation(program, 'iGravity');
    const iSecondSpiralLocation = gl.getUniformLocation(program, 'iSecondSpiral');

    function resizeCanvas() {
      if (!canvas || !gl) return;
      // Use full width of viewport for marketing page
      const containerWidth = window.innerWidth;
      canvas.width = containerWidth;
      canvas.height = height || Math.floor(containerWidth * 0.6); // Default to 60% aspect ratio if no height specified
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver to watch for container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (canvas.parentElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(canvas.parentElement);
    }
    
    resizeCanvas(); // Initial resize

    let mouseX = -1000; // Start far away so no effect until mouse hovers
    let mouseY = -1000;
    
    // Gravity tracking - accumulate strength based on how long mouse is in the section (hovering)
    let hoverStartTime = 0; // When mouse first entered/hovered
    let gravityStrength = 0.0;
    const maxGravityTime = 8.0; // seconds - max time to reach full gravity
    const gravityDecayRate = 0.98; // Per frame - how fast gravity decays when mouse leaves

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = canvas.height - (event.clientY - rect.top);
      
      // Start tracking hover time if not already started
      if (hoverStartTime === 0) {
        hoverStartTime = performance.now() * 0.001;
      }
      
      mouseX = x;
      mouseY = y;
    };

    const handleMouseEnter = () => {
      // Mouse entered canvas - start tracking hover time
      hoverStartTime = performance.now() * 0.001;
    };

    const handleMouseLeave = () => {
      mouseX = -1000; // Move mouse far away when not hovering
      mouseY = -1000;
      hoverStartTime = 0; // Reset hover timer
      // Don't reset second spiral - let it decay naturally
      isMouseDown = false;
      mouseDownStartTime = 0;
    };
    
    // Second spiral tracking - accumulates when mouse button is held down
    let isMouseDown = false;
    let mouseDownStartTime = 0;
    let secondSpiralStrength = 0.0;
    const maxSecondSpiralTime = 5.0; // seconds - time to fully form second spiral
    const secondSpiralDecayRate = 0.97; // Per frame - how fast it decays when released

    const handleMouseDown = (event: MouseEvent) => {
      if (!canvas) return;
      isMouseDown = true;
      mouseDownStartTime = performance.now() * 0.001;
      // Keep mouse position updated
      handleMouseMove(event);
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      mouseDownStartTime = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    // Also handle mouseup outside canvas
    window.addEventListener('mouseup', handleMouseUp);

    function render() {
      if (!canvas || !gl) return;
      
      const now = performance.now() * 0.001;
      
      // Continuously accumulate gravity based on hover time (how long mouse is in section)
      if (hoverStartTime > 0 && mouseX !== -1000 && mouseY !== -1000) {
        const hoverTime = now - hoverStartTime;
        gravityStrength = Math.min(1.0, hoverTime / maxGravityTime);
      } else if (mouseX === -1000 || mouseY === -1000) {
        // Mouse left - decay gravity
        gravityStrength *= gravityDecayRate;
      }
      
      // Accumulate second spiral strength when mouse button is held down
      if (isMouseDown && mouseDownStartTime > 0 && mouseX !== -1000 && mouseY !== -1000) {
        const timeHeld = now - mouseDownStartTime;
        secondSpiralStrength = Math.min(1.0, timeHeld / maxSecondSpiralTime);
      } else {
        // Decay second spiral when button is released
        secondSpiralStrength *= secondSpiralDecayRate;
      }
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      // Dark purple background to lower contrast with spiral
      gl.clearColor(0.08, 0.05, 0.12, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (iResolutionLocation) {
        gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      }
      if (iMouseLocation) {
        gl.uniform2f(iMouseLocation, mouseX, mouseY);
      }
      if (iTimeLocation) {
        gl.uniform1f(iTimeLocation, performance.now() * 0.001);
      }
      if (iGravityLocation) {
        gl.uniform1f(iGravityLocation, gravityStrength);
      }
      if (iSecondSpiralLocation) {
        gl.uniform1f(iSecondSpiralLocation, secondSpiralStrength);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    }

    animationFrameRef.current = requestAnimationFrame(render);

    // Cleanup function
    let resizeObserverRef: ResizeObserver | null = resizeObserver;
    cleanupRef.current = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      if (resizeObserverRef) {
        resizeObserverRef.disconnect();
      }
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [height]);

  return (
    <div style={{ width: '100%', display: 'block' }}>
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: height ? `${height}px` : 'auto' }}
    />
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '12px 12px',
          backgroundColor: 'rgb(54, 36, 69)', // Exact purple color from FragmentShaderCanvas: vec3(0.21, 0.14, 0.27)
          color: 'rgb(20, 13, 31)', // Exact dark purple background from FragmentShaderCanvas: vec3(0.08, 0.05, 0.12)
          fontFamily: '"Indie Flower", cursive, sans-serif',
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          borderRadius: '8px',
        }}
      >
        Only for the curious
      </div>
    </div>
  );
};

export default FragmentShaderCanvas;

