'use client';

import { useState } from 'react';
import '../globals.css';
import PixelLogo from '../components/PixelLogo';
import FormInput from '../components/FormInput';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Register logic here
    console.log('Register:', { email, password });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center pt-12 pb-8">
        <div className="text-center">
          <PixelLogo size="large" />
          <h1 className="text-3xl font-bold dark:text-white mt-4 mb-2">Memories26</h1>
          <div className="h-1 w-16 bg-primary rounded-full mx-auto"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold dark:text-white mb-2">Crear Cuenta</h2>
          <p className="text-gray-500 dark:text-gray-400">Únete y guarda tus recuerdos del Mundial 2026</p>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <FormInput
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={setEmail}
            icon="@"
          />
          <FormInput
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={setPassword}
            icon="•"
          />
        </div>

        {/* Terms */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Al crear una cuenta, aceptas nuestros{' '}
            <span className="text-primary font-medium">Términos de Servicio</span> y{' '}
            <span className="text-primary font-medium">Política de Privacidad</span>
          </p>
        </div>

        {/* Register Button */}
        <button 
          onClick={handleRegister}
          className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-primary/20 active:scale-[0.98] mb-4"
        >
          Crear Cuenta
        </button>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="px-4 text-gray-500 text-sm">o</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            ¿Ya tienes cuenta?
          </p>
          <button className="bg-gray-100 dark:bg-gray-800 text-[#181111] dark:text-white font-bold py-3 px-8 rounded-xl transition-colors active:scale-[0.98]">
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-400">
          Mundial 2026 • Canada • Mexico • USA
        </p>
      </div>
    </div>
  );
}