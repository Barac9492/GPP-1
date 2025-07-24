import React, { useEffect, useState } from 'react';

const AnimatedHero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  
  const words = [
    { text: 'Trade.', color: 'text-red-600' },
    { text: 'Treasure.', color: 'text-yellow-600' },
    { text: 'Triumph.', color: 'text-green-600' },
    { text: 'Tariff-dodge.', color: 'text-purple-600' },
    { text: 'Tech-bargain.', color: 'text-blue-600' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="text-center mb-16">
      <div className="hero-animation mb-8">
        <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
          T is for Trump, Tariff, Tech,
        </div>
        <div className="text-5xl md:text-6xl font-bold h-20 flex items-center justify-center">
          {words.map((word, index) => (
            <span
              key={index}
              className={`absolute transition-all duration-500 ${
                index === currentWord 
                  ? `opacity-100 transform translate-y-0 ${word.color}` 
                  : 'opacity-0 transform translate-y-4'
              }`}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          😂 Don't let Tariffs Trump your wallet! In a world where Trump's tariffs turn K-beauty into goldmines for US buyers and US tech into steals for Koreans, our AI spots the juiciest arbitrage deals.
        </p>
        <p className="text-lg text-slate-600 mb-8">
          Hedge inflation, score 20-50% savings, and laugh all the way to the bank. Solo-powered by AI—no humans, just pure profit plays!
        </p>
      </div>
    </div>
  );
};

export default AnimatedHero; 