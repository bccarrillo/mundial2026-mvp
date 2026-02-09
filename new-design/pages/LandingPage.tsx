import PixelLogo from '../components/PixelLogo';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <header className="flex flex-col items-center pt-8 pb-4 px-6">
        <PixelLogo size="large" className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-text-dark">Memories26</h1>
        <div className="h-1 w-10 bg-primary rounded-full mt-1 mb-4"></div>
        <h2 className="text-xl font-bold text-center leading-tight mb-2">
          Guarda y comparte tus recuerdos del Mundial
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-4 px-6 mb-8">
        <div className="bg-background-light p-4 rounded-2xl text-center shadow-sm">
          <span className="block text-2xl font-bold text-primary">13</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            usuarios registrados
          </span>
        </div>
        <div className="bg-background-light p-4 rounded-2xl text-center shadow-sm">
          <span className="block text-2xl font-bold text-usa-blue">42</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            recuerdos creados
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-6 mb-12">
        <button className="bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20">
          Crear cuenta gratis
        </button>
        <button className="bg-white border-2 border-gray-100 text-text-dark font-semibold py-4 rounded-xl transition-all">
          Ver recuerdos
        </button>
      </div>

      <div className="flex flex-col gap-8 px-8 mb-16">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-3">
            <span className="text-3xl">📸</span>
          </div>
          <h3 className="font-bold text-lg mb-1">Guarda tus momentos</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Sube fotos y videos de los mejores momentos del Mundial
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
            <span className="text-3xl">🔗</span>
          </div>
          <h3 className="font-bold text-lg mb-1">Comparte fácilmente</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Cada recuerdo tiene su propio link para compartir en WhatsApp
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-3">
            <span className="text-3xl">💚</span>
          </div>
          <h3 className="font-bold text-lg mb-1">100% Gratis</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Sin límites, sin anuncios, sin costos ocultos
          </p>
        </div>
      </div>

      <div className="bg-text-dark text-white rounded-t-[2.5rem] px-8 pt-12 pb-16 mt-auto">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-3">¿Listo para guardar tus recuerdos?</h3>
          <p className="text-gray-400 text-sm mb-8">
            Únete a miles de fanáticos que ya están creando su álbum digital
          </p>
          <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-primary/10">
            Empezar ahora
          </button>
          <p className="mt-6 text-xs text-gray-500">
            © 2026 Memories26. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}