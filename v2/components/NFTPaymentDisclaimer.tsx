'use client';

import { useState } from 'react';

interface NFTPaymentDisclaimerProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
  amount?: string;
}

export default function NFTPaymentDisclaimer({ accepted, onChange, amount = '29' }: NFTPaymentDisclaimerProps) {
  const handleChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <div className="border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <span className="text-amber-600 dark:text-amber-400">⚠️</span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
            Información Importante
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
            El pago de <strong>${amount}</strong> corresponde a servicios tecnológicos de certificación digital. 
            La creación del NFT no garantiza su venta ni valor económico futuro.
          </p>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="nft-payment-disclaimer"
              checked={accepted}
              onChange={(e) => handleChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              required
            />
            <label 
              htmlFor="nft-payment-disclaimer" 
              className="text-sm text-amber-800 dark:text-amber-200 font-medium"
            >
              Entiendo que este es un servicio digital sin garantías de retorno
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}