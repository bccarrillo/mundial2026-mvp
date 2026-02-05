# 📊 Estado del Proyecto - Mundial 2026 MVP

**Última actualización:** 2024 (Día 8)  
**Versión:** 1.1 (MVP + Viralidad + i18n Completo)  
**Stack:** Next.js 14, TypeScript, Supabase, Vercel, react-i18next  
**Presupuesto:** $0 (100% free tier)  
**Idiomas:** 🇪🇸 Español | 🇺🇸 English | 🇧🇷 Português

---

## ✅ FEATURES COMPLETADAS

### 🔐 Autenticación
- [x] Registro de usuarios con email/password
- [x] Login con email/password
- [x] Logout
- [x] Protección de rutas (dashboard)
- [x] Auto-creación de perfil en registro
- [x] Sistema de referidos (captura `?ref=` en registro)
- [x] Navbar reactivo a cambios de auth (onAuthStateChange)

### 📸 CRUD de Recuerdos
- [x] Crear recuerdo (título, descripción, imagen, equipo, fecha, público/privado)
- [x] Subir imagen con compresión (max 1MB, 1920px)
- [x] Editar recuerdo (todos los campos + reemplazar imagen opcional)
- [x] Eliminar recuerdo
- [x] Ver mis recuerdos (grid con badges público/privado)
- [x] Toggle público/privado

### 🌐 Feed Público
- [x] Feed de recuerdos públicos
- [x] Infinite scroll (12 items por página)
- [x] Filtros por equipo (Colombia, México, Argentina, Brasil, USA, Canadá)
- [x] Búsqueda por título/descripción (con botón + Enter)
- [x] Skeleton loading states
- [x] Muestra autor de cada recuerdo

### 💬 Sistema de Interacción
- [x] Likes con tabla en DB (user_id + memory_id)
- [x] Toggle like/unlike
- [x] Contador de likes real desde DB
- [x] Comentarios en recuerdos
- [x] Eliminar comentarios propios
- [x] Muestra autor y fecha/hora de comentarios
- [x] Contador de comentarios

### 🔗 Viralidad
- [x] Compartir recuerdo en WhatsApp (botón directo)
- [x] Open Graph metadata para previews en WhatsApp
- [x] Sistema de referidos/invitaciones
- [x] Link único de invitación por usuario
- [x] Tracking de invitaciones en DB
- [x] Sistema de recompensas (3/10/50 amigos)
- [x] Contador de usuarios totales en landing page
- [x] Botón compartir invitación en WhatsApp

### 📱 PWA
- [x] manifest.json configurado
- [x] Iconos 192x192 y 512x512
- [x] Apple touch icon (180x180)
- [x] Instalable en Android (Chrome, Edge, Firefox, Samsung Internet)
- [x] Instalable en iOS (Safari - botón compartir)
- [x] Theme color y display standalone

### 📊 Analytics
- [x] Google Analytics 4 integrado
- [x] Script de tracking en layout
- [x] Funciones de eventos predefinidas en `lib/analytics.ts`
- [ ] **PENDIENTE:** Agregar llamadas a eventos (signUp, createMemory, shareMemory, etc.)

### 🎨 UI/UX
- [x] Navbar con navegación condicional (auth state)
- [x] Navbar responsive optimizado (botones size=default, 36px altura)
- [x] Indicador visual de página activa en navbar
- [x] Selector de idioma compacto con banderas (🇪🇸 🇺🇸 🇧🇷)
- [x] Botón "Crear" destacado con gradiente verde
- [x] Diseño responsive (mobile-first)
- [x] Espaciado vertical mejorado en wrap de navbar (gap-y-2)
- [x] Botones de compartir responsive en página de recuerdo
- [x] Gradientes azul/verde (tema Mundial)
- [x] Componentes shadcn/ui (Button, Card, Input, Textarea, Skeleton)
- [x] Landing page con features y CTA
- [x] Mensajes de error/éxito

### 🌍 Internacionalización (i18n)
- [x] react-i18next configurado
- [x] 3 idiomas: Español, English, Português
- [x] Selector de idioma en navbar
- [x] Persistencia en localStorage
- [x] 11 páginas traducidas (100% cobertura)
- [x] Sin hydration errors
- [x] Traducciones organizadas por sección

---

## 🗄️ BASE DE DATOS (Supabase)

### Tablas

#### `auth.users` (Supabase default)
- Gestión de autenticación

#### `profiles`
```sql
- id (UUID, FK a auth.users)
- email (TEXT)
- display_name (TEXT) - auto-generado desde email
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```
**RLS:** Todos pueden ver, solo owner puede actualizar

#### `memories`
```sql
- id (UUID)
- user_id (UUID, FK a auth.users)
- title (TEXT)
- description (TEXT)
- image_url (TEXT)
- team (TEXT)
- match_date (DATE)
- is_public (BOOLEAN)
- likes (INTEGER) - DEPRECADO, usar tabla likes
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```
**RLS:** Públicos visibles por todos, privados solo por owner

#### `invitations`
```sql
- id (UUID)
- inviter_id (UUID, FK a auth.users)
- invitee_email (TEXT, nullable)
- invitee_id (UUID, FK a auth.users, nullable)
- status (TEXT: 'pending' | 'accepted')
- reward_claimed (BOOLEAN)
- created_at (TIMESTAMP)
```
**RLS:** Users ven sus propias invitaciones

#### `likes`
```sql
- id (UUID)
- user_id (UUID, FK a auth.users)
- memory_id (UUID, FK a memories)
- created_at (TIMESTAMP)
- UNIQUE(user_id, memory_id)
```
**RLS:** Todos ven, solo autenticados insertan/eliminan propios

#### `comments`
```sql
- id (UUID)
- user_id (UUID, FK a auth.users)
- memory_id (UUID, FK a memories)
- content (TEXT)
- created_at (TIMESTAMP)
```
**RLS:** Todos ven, solo autenticados comentan, solo owner elimina propios

### Storage Bucket
- **Nombre:** `memories`
- **Acceso:** Público (lectura)
- **Políticas:** Solo usuarios autenticados pueden subir

---

## 📁 ESTRUCTURA DE ARCHIVOS

### Rutas principales
```
app/
├── (auth)/
│   ├── login/page.tsx          - Login form
│   ├── register/page.tsx       - Registro con captura de ref
│   └── callback/route.ts       - Callback de Supabase
├── (dashboard)/
│   ├── dashboard/page.tsx      - Dashboard protegido
│   ├── crear/page.tsx          - Crear recuerdo
│   ├── editar/[id]/page.tsx    - Editar recuerdo
│   ├── mis-recuerdos/page.tsx  - Lista de mis recuerdos
│   └── invitar/page.tsx        - Sistema de referidos
├── feed/page.tsx               - Feed público con búsqueda
├── recuerdo/[id]/
│   ├── page.tsx                - Vista individual + likes + comentarios
│   └── layout.tsx              - Open Graph metadata
├── api/stats/route.ts          - Contador de usuarios/recuerdos
├── layout.tsx                  - Root layout con Navbar + GA
└── page.tsx                    - Landing page
```

### Componentes
```
components/
├── ui/                         - shadcn/ui components
├── Navbar.tsx                  - Navegación global + i18n
├── StatsCounter.tsx            - Contador landing page
├── GoogleAnalytics.tsx         - Script GA4
├── LanguageSelector.tsx        - Selector de idioma (ES/EN/PT)
└── I18nProvider.tsx            - Provider i18n sin hydration errors
```

### Librerías
```
lib/
├── supabase/
│   ├── client.ts               - Cliente browser
│   └── server.ts               - Cliente server
├── utils/
│   └── file.ts                 - Generación de nombres de archivo
├── analytics.ts                - Eventos de GA4
├── i18n.ts                     - Configuración i18next
└── utils.ts                    - Utilidades generales
```

### Traducciones
```
messages/
├── es.json                     - Español (default)
├── en.json                     - English
└── pt.json                     - Português
```

### SQL Scripts
```
supabase-setup.sql              - Tabla memories + storage
supabase-profiles.sql           - Tabla profiles + trigger
supabase-invitations.sql        - Tabla invitations
supabase-fix-invitations.sql    - Fix de policies
supabase-likes.sql              - Tabla likes
supabase-comments.sql           - Tabla comments
supabase-comments-view.sql      - Vista comments_with_profiles
```

### Documentación
```
PROJECT-STATUS.md               - Estado completo del proyecto
I18N-STATUS.md                  - Estado de internacionalización
```

---

## 🚀 DEPLOYMENT

### Vercel
- **URL:** [Tu URL de producción]
- **Branch:** master
- **Auto-deploy:** ✅ Activado
- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GA_ID` (opcional)

### Supabase
- **Tier:** Free
- **Region:** [Tu región]
- **Auth:** Email/Password habilitado
- **Storage:** Bucket `memories` público

---

## ❌ PENDIENTES (Prioridad)

### 🔥 Alta Prioridad
1. **Tracking de eventos de Analytics**
   - Agregar `events.signUp()` en register
   - Agregar `events.createMemory()` en crear
   - Agregar `events.shareMemory()` en compartir
   - Agregar `events.likeMemory()` en like
   - **Tiempo:** 10 min
   - **Impacto:** Crítico para métricas

2. **Botón "Limpiar búsqueda"**
   - Mostrar cuando hay búsqueda activa
   - Resetear input y resultados
   - **Tiempo:** 5 min
   - **Impacto:** UX mejorada

3. **Indicador "Buscando..."**
   - Mostrar mientras carga búsqueda
   - **Tiempo:** 5 min
   - **Impacto:** Feedback visual

### 📊 Media Prioridad
4. **Perfil de usuario**
   - Ver recuerdos de un usuario
   - Estadísticas (total recuerdos, likes recibidos)
   - **Tiempo:** 20 min
   - **Impacto:** Engagement

5. **Notificaciones**
   - Cuando comentan tu recuerdo
   - Cuando aceptan tu invitación
   - **Tiempo:** 30 min
   - **Impacto:** Retención

### 🔧 Baja Prioridad
6. **Editar comentarios**
   - Permitir editar comentarios propios
   - **Tiempo:** 15 min
   - **Impacto:** Nice to have

7. **Paginación en mis recuerdos**
   - Actualmente carga todos
   - **Tiempo:** 10 min
   - **Impacto:** Performance con muchos recuerdos

---

## 🐛 BUGS CONOCIDOS

- Ninguno reportado actualmente

---

## 📐 ESPECIFICACIONES TÉCNICAS

### Dimensiones UI

**Navbar:**
- Altura botones: 36px (h-9)
- Padding horizontal: 12px (px-3)
- Texto: text-sm (14px)
- Gap horizontal: 6px móvil (gap-1.5), 8px desktop (gap-2)
- Gap vertical wrap: 8px (gap-y-2)

**Selector de idioma:**
- Botones: size="sm" con banderas emoji
- Padding: px-2
- Variant activo: "secondary" (gris claro)

**Botón Crear:**
- Gradiente: from-green-500 to-emerald-600
- Hover: from-green-600 to-emerald-700
- Font: semibold

**Página Recuerdo:**
- Botones: Stack vertical en móvil (flex-col), horizontal en desktop (sm:flex-row)
- Ancho: w-full en móvil, w-auto/flex-1 en desktopdo actualmente

## ✅ BUGS RESUELTOS

- ❌ Hydration error en i18n → ✅ Resuelto con mounted state en I18nProvider
- ❌ Error PGRST116 en queries → ✅ Resuelto usando .maybeSingle() en lugar de .single()
- ❌ Pérdida de foco en búsqueda → ✅ Resuelto con búsqueda manual (botón + Enter)
- ❌ Navbar no actualiza después de login/logout → ✅ Resuelto con onAuthStateChange subscription
- ❌ Botones navbar muy pequeños en móvil → ✅ Aumentados de 32px a 36px (size="default")
- ❌ Selector idioma ocupa mucho espacio → ✅ Cambiado a banderas compactas
- ❌ Botón compartir se desborda en móvil → ✅ Stack vertical con flex-col en pantallas pequeñas
- ❌ Falta espacio vertical en wrap navbar → ✅ Agregado gap-y-2 (8px vertical)

---

## 📈 MÉTRICAS OBJETIVO

### Viralidad
- **K-factor objetivo:** > 1.0
- **Tiempo promedio en app:** > 3 min
- **Tasa de compartir:** > 20%
- **Tasa de registro vía referido:** > 30%

### Engagement
- **Recuerdos por usuario:** > 2
- **Comentarios por recuerdo:** > 1
- **Likes por recuerdo:** > 5

---

## 🔄 HISTORIAL DE CAMBIOS

### Día 8 (Hoy) - Mejoras UI/UX
- ✅ Navbar responsive mejorado (botones más grandes: 32px → 36px)
- ✅ Indicador visual de página activa (Feed/Dashboard)
- ✅ Selector de idioma con banderas en lugar de texto
- ✅ Botón "Crear" con gradiente verde destacado
- ✅ Espaciado vertical en wrap de navbar (gap-y-2)
- ✅ Botones responsive en página de recuerdo (stack vertical en móvil)
- ✅ Color gris claro para idioma activo (variant="secondary")

### Día 8 - i18n Completo
- ✅ Internacionalización completa (react-i18next)
- ✅ 3 idiomas: Español, English, Português
- ✅ 11 páginas traducidas (100% cobertura)
- ✅ Selector de idioma en navbar
- ✅ Fix error PGRST116 con .maybeSingle()
- ✅ Documentación I18N-STATUS.md

### Día 7+
- ✅ Sistema de likes con tabla en DB
- ✅ Sistema de comentarios completo
- ✅ Búsqueda con botón (sin pérdida de foco)
- ✅ PWA funcional en iOS y Android

### Día 7
- ✅ Google Analytics 4 integrado
- ✅ PWA manifest + iconos
- ✅ Intentó next-pwa (removido por conflictos)

### Día 6
- ✅ Sistema de referidos/invitaciones
- ✅ Recompensas por invitaciones
- ✅ Compartir en WhatsApp

### Día 5
- ✅ Contador de usuarios en landing
- ✅ API endpoint /api/stats

### Día 4
- ✅ Feed público con infinite scroll
- ✅ Filtros por equipo
- ✅ Open Graph metadata

### Día 3
- ✅ CRUD completo de recuerdos
- ✅ Upload de imágenes con compresión
- ✅ Toggle público/privado

### Día 2
- ✅ Autenticación completa
- ✅ Profiles con auto-creación
- ✅ RLS policies

### Día 1
- ✅ Setup inicial Next.js + Supabase
- ✅ Estructura de proyecto
- ✅ Componentes UI base

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. **Implementar tracking de eventos GA4** (10 min)
   - Agregar eventos en acciones clave
   - Medir conversión y engagement

2. **Mejorar UX de búsqueda** (10 min)
   - Botón "Limpiar búsqueda"
   - Indicador "Buscando..."

3. **Perfiles de usuario** (20 min)
   - Ver recuerdos de otros usuarios
   - Estadísticas públicas

4. **Sistema de notificaciones** (30 min)
   - Comentarios en recuerdos
   - Invitaciones aceptadas

---

## 📝 NOTAS TÉCNICAS

### Decisiones de Arquitectura

**i18n: react-i18next vs next-intl**
- ✅ Elegido: react-i18next
- Razón: Cambios incrementales, sin reestructurar rutas, menor riesgo
- URLs no cambian por idioma (mismo /feed para todos)
- Detección desde localStorage con fallback a 'es'

**Búsqueda: Automática vs Manual**
- ✅ Elegido: Manual (botón + Enter)
- Razón: Búsqueda automática causaba pérdida de foco
- Mejor UX con control explícito del usuario

**Likes: Campo vs Tabla**
- ✅ Elegido: Tabla likes con relación user_id + memory_id
- Razón: Control real por usuario, toggle like/unlike
- Campo `likes` en memories deprecado

**Queries Supabase**
- Usar `.maybeSingle()` cuando el resultado puede ser null
- Usar `.single()` solo cuando se garantiza un resultado
- Evita errores PGRST116

---

## 🌟 FEATURES DESTACADAS

### Sistema de Viralidad
- Link único de invitación por usuario
- Tracking automático de referidos
- Recompensas por hitos (3/10/50 amigos)
- Compartir en WhatsApp con un clic
- Open Graph para previews atractivos

### Experiencia Multiidioma
- 3 idiomas sin cambiar URLs
- Selector visual en navbar
- Persistencia de preferencia
- Traducciones completas y naturales

### Interacción Social
- Likes con control por usuario
- Comentarios con autor y timestamp
- Eliminar comentarios propios
- Contadores en tiempo real

---

## 📊 COBERTURA ACTUAL

- **Páginas:** 11/11 (100%)
- **Traducciones:** 3 idiomas (100%)
- **Features MVP:** 100% completadas
- **PWA:** ✅ Android + iOS
- **Analytics:** ✅ Configurado (pendiente eventos)
- **Viralidad:** ✅ Sistema completo
- **RLS Policies:** ✅ Todas las tablas

---

**🎉 Estado: MVP COMPLETO Y LISTO PARA PRODUCCIÓN**ementar tracking de Analytics (10 min)
2. Mejorar UX de búsqueda (10 min)
3. Crear perfil de usuario (20 min)
4. Sistema de notificaciones (30 min)
5. Testing con usuarios reales
6. Iterar basado en feedback

---

## 📞 CONTACTO / NOTAS

- **Repositorio:** mundial2026-mvp (GitHub)
- **Owner:** bccarrillo
- **Git local:** Configurado con bcarrillo01 (causa conflictos, usar GitHub Desktop)
- **Desarrollo local:** http://localhost:3000
- **Base de datos:** Supabase Dashboard

---

**🎉 MVP COMPLETADO - LISTO PARA USUARIOS REALES**
