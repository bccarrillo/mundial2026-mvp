# 🚀 DEPLOY VERCEL - PRUEBA DINERO REAL

## 📋 **PASO 1: PREPARAR VARIABLES DE ENTORNO**

### **Variables para Vercel:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ukeycuojtasdlfickpab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZXljdW9qdGFzZGxmaWNrcGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTcxMDcsImV4cCI6MjA4NTc5MzEwN30.9otrW-pS6Ue2KqKgk1xld28rkhW5hZGNKNVM9aG_UcY

# Crossmint Producción
NFT_MODE=production
CROSSMINT_PROJECT_ID=73476e5d-5b38-43ee-81f8-c4006a3620cc
CROSSMINT_API_KEY=sk_production_5zkVJCBumDmVNSajnQuWANyDgbeLDbFcvY3HqjCEtAKHxxJACopHFawM81Ast26snpSRpYrBdT6xmsENqnD4hKJfHMV8VKkaRrVBCnPwUyUgPXb6jducUrb5aRWeFebeDCk23TYGHM7rV9GGkT8Lugvxc9Dg7iMTUx4eeWga2TAkfV8dqNdqpBFqqLcwxg36HCPKz6w7QASokEgCXai17Mfj
CROSSMINT_ENVIRONMENT=production
CROSSMINT_COLLECTION_ID=66e890ec-b701-480e-acff-8c9c439b7b74

# Configuración NFT para prueba dinero real
NFT_PRICING_MODE=test
NEXT_PUBLIC_NFT_PRICING_MODE=test
NFT_PAYMENT_MODE=production
```

## 🎯 **PASO 2: DEPLOY EN VERCEL**

### **Opción A: Desde GitHub**
1. **Push código** a GitHub
2. **Conectar repo** en Vercel
3. **Agregar variables** de entorno
4. **Deploy automático**

### **Opción B: Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde carpeta app/
cd app
vercel

# Configurar variables en dashboard
```

## 🔧 **PASO 3: CONFIGURAR VARIABLES EN VERCEL**

1. **Ve a Vercel Dashboard** → Tu proyecto
2. **Settings** → Environment Variables
3. **Agregar todas las variables** de arriba
4. **Redeploy** el proyecto

## 🎯 **PASO 4: ACTUALIZAR URLs DE CALLBACK**

<function_calls>
<invoke name="fsReplace">
<parameter name="diffs">[{"newStr": "          successCallbackURL: `https://tu-app.vercel.app/nft/success?memory_id=${memory_id}`,\n          failureCallbackURL: `https://tu-app.vercel.app/nft/failure?memory_id=${memory_id}`", "oldStr": "          successCallbackURL: `http://localhost:3000/nft/success?memory_id=${memory_id}`,\n          failureCallbackURL: `http://localhost:3000/nft/failure?memory_id=${memory_id}`"}]