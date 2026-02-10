'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TermsAcceptanceProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
  required?: boolean;
}

export default function TermsAcceptance({ accepted, onChange, required = true }: TermsAcceptanceProps) {
  const handleChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
      <input
        type="checkbox"
        id="terms-acceptance"
        checked={accepted}
        onChange={(e) => handleChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        required={required}
      />
      <label htmlFor="terms-acceptance" className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Acepto los{' '}
        <Link 
          href="/legal/terms" 
          className="text-primary hover:underline font-medium"
          target="_blank"
        >
          Términos y Condiciones
        </Link>
        . Los NFTs son certificados conmemorativos digitales, no inversiones.
      </label>
    </div>
  );
}