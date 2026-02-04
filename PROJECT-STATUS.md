# 📊 Estado del Proyecto - Mundial 2026 MVP

**Última actualización:** 2024 (Día 7+)  
**Versión:** 1.0 (MVP Completo + Features de Viralidad)  
**Stack:** Next.js 14, TypeScript, Supabase, Vercel  
**Presupuesto:** $0 (100% free tier)

---

## ✅ FEATURES COMPLETADAS

### 🔐 Autenticación
- [x] Registro de usuarios con email/password
- [x] Login con email/password
- [x] Logout
- [x] Protección de rutas (dashboard)
- [x] Auto-creación de perfil en registro
- [x] Sistema de referidos (captura `?ref=` en registro)

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
- [x] Diseño responsive (mobile-first)
- [x] Gradientes azul/verde (tema Mundial)
- [x] Componentes shadcn/ui (Button, Card, Input, Textarea, Skeleton)
- [x] Landing page con features y CTA
- [x] Mensajes de error/éxito

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
├── Navbar.tsx                  - Navegación global
├── StatsCounter.tsx            - Contador landing page
└── GoogleAnalytics.tsx         - Script GA4
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
└── utils.ts                    - Utilidades generales
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

### Día 7+ (Hoy)
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

1. Implementar tracking de Analytics (10 min)
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
