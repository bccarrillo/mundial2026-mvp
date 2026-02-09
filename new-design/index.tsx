import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MemoriesGallery from './pages/MemoriesGallery';
import MemoryDetail from './pages/MemoryDetail';
import './styles/globals.css';

export default function NewDesignDemo() {
  return (
    <div className="font-display">
      <h1 className="text-center text-2xl font-bold p-4 bg-primary text-white">
        Nuevo Diseño Memories26 - Demo
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Landing Page</h2>
          <div className="border rounded-lg overflow-hidden">
            <LandingPage />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <div className="border rounded-lg overflow-hidden">
            <Dashboard />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Galería de Recuerdos</h2>
          <div className="border rounded-lg overflow-hidden">
            <MemoriesGallery />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Detalle de Recuerdo</h2>
          <div className="border rounded-lg overflow-hidden">
            <MemoryDetail />
          </div>
        </div>
      </div>
    </div>
  );
}