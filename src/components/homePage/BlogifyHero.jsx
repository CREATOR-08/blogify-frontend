import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

export default function BlogifyHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const uiRef = useRef(null);

  useEffect(() => {
    // Inject the real handwritten script font directly into the page head dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // --- SEQUENTIAL WRITING & TOPICS CONFIG ---
    const phrases = [
      "Write about world.",
      "Write about life.",
      "Write about others.",
      "Write about you.",
      "Blogify."
    ];

    const topicsList = [
      "⚡ Tech", "✈️ Travel", "🎨 Design", "🧠 AI", 
      "🍳 Food", "🍿 Movies", "🎵 Music", "💼 Business"
    ];

    // Core Animation Tracking States
    const canvasState = {
      openProgress: 0,
      currentPhraseIndex: 0,
      charCount: 0,
      topicsVelocityMultiplier: 1, // Will scale to 0 when "Blogify" completes to freeze background topics
      isFinished: false
    };

    // Instantiate Blogging Topic Data Models radiating from the center core
    const topics = topicsList.map((text, i) => {
      const angle = (i / topicsList.length) * Math.PI * 2 + Math.random() * 0.4;
      return {
        text,
        angle,
        // Radiating outward speeds
        speed: Math.random() * 0.4 + 0.3,
        distance: 0, // Starts completely hidden behind the dark slate frame box
        opacity: 0,
        scale: 0.6
      };
    });

    // --- MASTER CINEMATIC TIMELINE (GSAP) ---
    const masterTimeline = gsap.timeline();

    // Step 1: Expand the dark slate canvas open
    masterTimeline.to(canvasState, {
      openProgress: 1,
      duration: 1.2,
      ease: "power4.inOut"
    });

    // Step 2: Loop and type out each text thought line
    phrases.forEach((phrase, index) => {
      const isLast = index === phrases.length - 1;

      // Animate custom text characters metrics sequentially
      masterTimeline.to(canvasState, {
        charCount: phrase.length,
        duration: phrase.length * 0.08, // Premium writing cadence
        ease: "none",
        onUpdate: () => {
          // Slowly reveal and push background topic nodes outward during the initial writing loops
          if (!isLast) {
            topics.forEach((t) => {
              t.distance += t.speed * 0.8;
              t.opacity = Math.min(0.4, t.distance * 0.003);
              t.scale = Math.min(1, 0.6 + t.distance * 0.002);
            });
          }
        }
      });

      if (!isLast) {
        masterTimeline.to({}, { duration: 1.1 }); // Short pause to absorb phrase

        // Clean clear for the next quote block
        masterTimeline.to(canvasState, {
          charCount: 0,
          duration: 0.1,
          onComplete: () => {
            canvasState.currentPhraseIndex = index + 1;
          }
        });
      } else {
        // Final Step: "Blogify." arrives. Instantly freeze background items smoothly.
        masterTimeline.to(canvasState, {
          topicsVelocityMultiplier: 0, // Force vector calculations to zero
          duration: 0.5,
          onComplete: () => {
            canvasState.isFinished = true;
            // Bring up navigation control buttons
            gsap.to(uiRef.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
          }
        });
      }
    });

    // --- CORE RENDERING ENGINE LOOP ---
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 40;

      const maxCanvasWidth = Math.min(width * 0.85, 580);
      const canvasHeight = maxCanvasWidth * 0.52;
      const finalExpandedWidth = maxCanvasWidth * canvasState.openProgress;

      // 1. Update and Render Pop-Out Blogging Topics Behind the Canvas Frame
      topics.forEach((t) => {
        // Only progress the location vector if animation multiplier hasn't frozen things out
        t.distance += t.speed * canvasState.topicsVelocityMultiplier;
        
        const tx = cx + Math.cos(t.angle) * t.distance;
        const ty = cy + Math.sin(t.angle) * t.distance;

        // Soft fade treatment as they branch outward into peripheral spaces
        if (t.distance > 40) {
          t.opacity = Math.min(0.35, (t.distance - 40) * 0.003);
          t.scale = Math.min(1, 0.6 + t.distance * 0.002);
        }

        ctx.save();
        ctx.globalAlpha = t.opacity;
        ctx.translate(tx, ty);
        ctx.scale(t.scale, t.scale);

        // Modern Glass Capsule Container Pill for tag lines
        ctx.fillStyle = 'rgba(30, 41, 59, 0.3)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        const txtWidth = ctx.measureText(t.text).width + 24;
        
        ctx.beginPath();
        ctx.roundRect(-txtWidth / 2, -14, txtWidth, 28, 20);
        ctx.fill();
        ctx.stroke();

        // Print Tag Text Content
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'normal 500 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.text, 0, 1);
        ctx.restore();
      });

      // 2. Core Dark Gray Container Backdrop Shadows
      ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
      ctx.shadowColor = canvasState.isFinished ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = canvasState.isFinished ? 60 : 35;
      
      ctx.beginPath();
      ctx.roundRect(
        cx - (finalExpandedWidth / 2) - 4, 
        cy - (canvasHeight / 2) - 4, 
        finalExpandedWidth + 8, 
        canvasHeight + 8, 
        14
      );
      ctx.fill();
      ctx.shadowBlur = 0; 

      // 3. Dark Slate Premium Monolithic Canvas Core Surface
      ctx.fillStyle = '#0f172a'; 
      ctx.strokeStyle = '#1e293b'; 
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(cx - (finalExpandedWidth / 2), cy - (canvasHeight / 2), finalExpandedWidth, canvasHeight, 12);
      ctx.fill();
      ctx.stroke();

      // 4. Render Unified Real Writing Font Layer Across Center
      if (canvasState.openProgress > 0.9) {
        const fullPhrase = phrases[canvasState.currentPhraseIndex];
        const activeTextSubstring = fullPhrase.substring(0, Math.floor(canvasState.charCount));

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (fullPhrase === "Blogify.") {
          // Bold luxury logotype font variant alignment
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 52px sans-serif';
          if (width < 640) ctx.font = '700 38px sans-serif';
        } else {
          // Utilizing newly loaded Google Caveat handwriting scripts vector map references
          ctx.fillStyle = '#e2e8f0'; 
          ctx.font = '700 34px "Caveat", cursive';
          if (width < 640) ctx.font = '700 24px "Caveat", cursive';
        }

        ctx.fillText(activeTextSubstring, cx, cy);

        // Active ink pen cursor ticker
        if (Math.floor(Date.now() / 180) % 2 === 0 && canvasState.charCount < fullPhrase.length) {
          const textMetricWidth = ctx.measureText(activeTextSubstring).width;
          ctx.fillStyle = '#38bdf8'; 
          ctx.fillRect(cx + (textMetricWidth / 2) + 6, cy - 14, 2.5, 28);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      masterTimeline.kill();
      gsap.killTweensOf("*");
      link.remove(); // Clean styling nodes from head
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#020617] text-slate-100"
    >
      {/* 60FPS Hardware Accelerated Core Canvas Element */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none" 
      />

      {/* Buttons Overlay Group */}
      <div 
        ref={uiRef} 
        className="absolute bottom-16 z-10 flex flex-col items-center gap-6 max-w-xl text-center px-6 opacity-0 translate-y-4 will-change-transform"
      >
      

        <div className="flex gap-12 items-center justify-center mt-8">
          <button 
            onClick={() => navigate('/readblog')}
            className="group px-7 py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-white text-slate-950 transition-all duration-200 hover:bg-slate-100 active:scale-95 shadow-xl shadow-sky-500/5"
          >
            <span className="flex items-center gap-1.5">
              Explore Reads
              <svg className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>

          <button 
            onClick={() => navigate('/editor')}
            className="px-7 py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase text-slate-300 transition-all duration-200 bg-slate-900/90 border border-slate-800 backdrop-blur-md hover:border-slate-700 hover:bg-slate-850 hover:text-white active:scale-95"
          >
            Open Editor
          </button>
        </div>
      </div>
    </div>
  );
}