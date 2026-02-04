# Completar Analytics y PWA

## 📊 Google Analytics (5 min)

### 1. Crear cuenta GA4
1. Ve a https://analytics.google.com
2. Crear cuenta → Crear propiedad
3. Nombre: "Mundial 2026"
4. Copiar **Measurement ID** (formato: G-XXXXXXXXXX)

### 2. Agregar a .env.local
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Agregar a Vercel
- Settings → Environment Variables
- Agregar: `NEXT_PUBLIC_GA_ID` = tu ID
- Redeploy

---

## 📱 PWA - Crear Iconos (10 min)

### Opción A: Usar herramienta online (recomendado)
1. Ve a https://realfavicongenerator.net
2. Sube un logo (puede ser emoji ⚽ como imagen)
3. Genera iconos
4. Descarga y coloca en `/public`:
   - `icon-192.png`
   - `icon-512.png`
   - `favicon.ico`

### Opción B: Crear manualmente
1. Crea imagen 512x512px con:
   - Fondo azul (#3b82f6)
   - Emoji ⚽ grande en el centro
2. Redimensiona a 192x192px
3. Guarda ambas en `/public`

---

## ✅ Testing

### Analytics:
1. Abre la app
2. Navega por varias páginas
3. Ve a GA4 → Realtime
4. Deberías ver tu visita

### PWA:
1. Abre en Chrome móvil
2. Menú → "Instalar app"
3. Debería aparecer en home screen
4. Abre → Funciona como app nativa

---

## 🎯 Eventos que se trackean automáticamente:
- ✅ Pageviews
- ✅ Registro (cuando agregues events.signUp())
- ✅ Crear recuerdo (cuando agregues events.createMemory())
- ✅ Compartir (cuando agregues events.shareMemory())

---

## 📝 Agregar tracking a eventos (opcional)

En los archivos donde quieras trackear, importa:
```typescript
import { events } from '@/lib/analytics'

// Ejemplo en crear recuerdo:
events.createMemory()

// Ejemplo en compartir:
events.shareMemory(memory.id)
```
