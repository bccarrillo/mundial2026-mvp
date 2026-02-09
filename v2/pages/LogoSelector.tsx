'use client';

import { useState } from 'react';
import '../globals.css';
import BackButton from '../components/BackButton';
import LogoVariant from '../components/LogoVariant';
import PaginationDots from '../components/PaginationDots';

export default function LogoSelector() {
  const [currentVariant, setCurrentVariant] = useState(3); // Start at variant 4 (0-indexed)
  const totalVariants = 6;

  const nextVariant = () => {
    setCurrentVariant((prev) => (prev + 1) % totalVariants);
  };

  const prevVariant = () => {
    setCurrentVariant((prev) => (prev - 1 + totalVariants) % totalVariants);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-white dark:bg-background-dark overflow-hidden max-w-md mx-auto">
      {/* iOS Style Header */}
      <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between">
        <BackButton />
        <h2 className="text-[#181111] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Variant {currentVariant + 1} of {totalVariants}
        </h2>
      </div>

      {/* Main Logo Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full flex justify-center py-8">
          <LogoVariant variant={currentVariant + 1} isActive={true} />
        </div>

        {/* Description */}
        <div className="max-w-xs text-center">
          <p className="text-[#555555] dark:text-gray-400 text-sm font-normal leading-relaxed">
            Digital NFT-inspired design featuring host nation colors in a precision pixel-art style.{' '}
            <span className="text-primary font-bold">Red</span>,{' '}
            <span className="text-mexico-green font-bold">Green</span>, and{' '}
            <span className="text-usa-blue font-bold">Blue</span> accents represent Canada, Mexico, and the USA.
          </p>
        </div>

        {/* Swipe Navigation (Touch Areas) */}
        <div className="absolute inset-0 flex">
          <button 
            className="flex-1 opacity-0" 
            onClick={prevVariant}
            aria-label="Previous variant"
          />
          <button 
            className="flex-1 opacity-0" 
            onClick={nextVariant}
            aria-label="Next variant"
          />
        </div>
      </div>

      {/* Pagination Dots */}
      <PaginationDots total={totalVariants} current={currentVariant} />

      {/* Action Buttons */}
      <div className="px-6 pb-12 flex flex-col gap-3">
        <button className="bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-primary/20 active:scale-[0.98]">
          Select This Design
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 text-[#181111] dark:text-white font-medium py-4 rounded-xl transition-colors active:scale-[0.98]">
          Save Draft
        </button>
      </div>
    </div>
  );
}