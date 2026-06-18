import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Grow Your Voice",
    description:
      "Blogging helps you turn your ideas into content that people remember. Share stories, tips and videos to grow your audience.",
  },
  {
    title: "Build Credibility",
    description:
      "A consistent blog shows your expertise and creates trust. Blogging makes it easier for readers to find your work and follow your journey.",
  },
  {
    title: "Create Lasting Impact",
    description:
      "Every published post becomes searchable and shareable. Your insights keep working for you long after you hit publish.",
  },
];

const Advantages = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Reveal heading and cards cleanly on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });

    tl.fromTo(
      sectionRef.current.querySelector('h2'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    ).fromTo(
      cardsRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power2.out" 
      },
      "-=0.6"
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-32 bg-[#020617] text-white overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* Flat White Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-20 tracking-tight text-white">
          Advantages of <span className="text-slate-400">Blogging</span>
        </h2>

        {/* Clean Grid System */}
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={card.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative rounded-3xl p-8 transition-all duration-300 bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/80"
            >
              {/* Minimalist Structural Top Accent Line */}
              <div className="h-[2px] w-12 bg-slate-700 rounded-full mb-6 group-hover:w-16 transition-all duration-300 ease-out" />
              
              {/* Card Title */}
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white transition-all duration-300">
                {card.title}
              </h3>
              
              {/* Card Description */}
              <p className="leading-7 text-slate-400 font-light transition-all duration-300">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;