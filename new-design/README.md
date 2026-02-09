# Nuevo Diseño Memories26

## Estructura del Proyecto

```
/app/new-design/
├── components/           # Componentes reutilizables
│   ├── PixelLogo.tsx    # Logo en pixel art
│   ├── MobileHeader.tsx # Header con blur
│   ├── BottomNavigation.tsx # Navegación inferior
│   ├── MemoryCard.tsx   # Tarjeta de recuerdo
│   └── MobileLayout.tsx # Layout principal
├── pages/               # Páginas específicas
│   ├── LandingPage.tsx  # Página de inicio
│   ├── Dashboard.tsx    # Panel del usuario
│   ├── MemoriesGallery.tsx # Galería
│   └── MemoryDetail.tsx # Detalle de recuerdo
├── styles/
│   └── globals.css      # Estilos globales
├── tailwind.config.js   # Configuración Tailwind
└── index.tsx           # Demo principal
```

## Características del Diseño

### Mobile-First
- Diseño optimizado para móviles con `max-w-md mx-auto`
- Responsive con breakpoints específicos
- Navegación táctil optimizada

### Sistema de Colores
- **Primary**: #ec1313 (Rojo Mundial)
- **Mexico Green**: #006847
- **USA Blue**: #002147
- **Gold VIP**: #FFD700
- **Background Light**: #f8f6f6
- **Background Dark**: #181111

### Tipografía
- **Fuente Principal**: Spline Sans
- **Iconos**: Material Symbols Outlined
- **Pesos**: 300, 400, 500, 600, 700

### Componentes Clave

#### PixelLogo
- Logo en pixel art con grid CSS
- Tamaños: mini (24x24), small (32x32), large (60x60)
- Colores del Mundial 2026

#### MobileHeader
- Header sticky con backdrop blur
- Selector de idioma integrado
- Indicador VIP opcional

#### BottomNavigation
- Navegación fija inferior
- 4 tabs principales + VIP especial
- Iconos filled para tab activo

#### MemoryCard
- Tarjetas de recuerdos con imagen
- Información del autor y fecha
- Botón CTA para crear NFT

### Estilo iOS
- Bordes redondeados (rounded-2xl)
- Backdrop blur effects
- Sombras suaves
- Transiciones smooth

## Uso

### Importar Componentes
```tsx
import MobileLayout from './components/MobileLayout';
import PixelLogo from './components/PixelLogo';
import MemoryCard from './components/MemoryCard';
```

### Layout Básico
```tsx
<MobileLayout showVip={true} activeTab="home">
  <div className="px-6 py-8">
    {/* Contenido */}
  </div>
</MobileLayout>
```

### Logo Pixel Art
```tsx
<PixelLogo size="large" className="mb-4" />
```

## Integración con Proyecto Actual

Este diseño está completamente separado del código actual y puede:
1. Usarse como referencia para migración gradual
2. Implementarse como tema alternativo
3. Reemplazar el diseño actual progresivamente

## Próximos Pasos

1. **Testing**: Probar componentes en diferentes dispositivos
2. **Integración**: Conectar con APIs existentes
3. **Animaciones**: Añadir micro-interacciones
4. **Accesibilidad**: Validar WCAG compliance
5. **Performance**: Optimizar carga de imágenes