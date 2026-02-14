export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <a href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3">
              <div className="grid grid-cols-5 gap-px w-8 h-8">
                <div className="w-full h-full"></div><div className="w-full h-full bg-blue-600"></div><div className="w-full h-full bg-blue-600"></div><div className="w-full h-full bg-blue-600"></div><div className="w-full h-full"></div>
                <div className="w-full h-full bg-green-600"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-blue-800"></div>
                <div className="w-full h-full bg-green-600"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-blue-800"></div>
                <div className="w-full h-full"></div><div className="w-full h-full bg-blue-600"></div><div className="w-full h-full bg-blue-600"></div><div className="w-full h-full bg-blue-600"></div><div className="w-full h-full"></div>
              </div>
              <span className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Memories26
              </span>
            </div>
          </a>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          POLÍTICA DE PRIVACIDAD
        </h1>
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700">Plataforma 2026 Memorias</h2>
          <p className="text-sm text-gray-500 mt-2">Última actualización: Febrero 2025</p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">1. INTRODUCCIÓN</h3>
            <p className="mb-4">
              Bienvenido a 2026 Memorias (en adelante, "la Plataforma").
            </p>
            <p className="mb-4">
              Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos 
              la información personal de los usuarios que utilizan nuestra plataforma digital para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Crear recuerdos del Mundial 2026</li>
              <li>Subir imágenes e historias personales</li>
              <li>Generar certificados digitales o NFTs</li>
              <li>Realizar pagos asociados</li>
              <li>Participar en eventos digitales posteriores</li>
            </ul>
            <p className="mt-4">
              Al utilizar la Plataforma, usted acepta las prácticas descritas en esta Política.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">2. INFORMACIÓN QUE RECOPILAMOS</h3>
            
            <h4 className="font-semibold mb-2">2.1 Información proporcionada directamente por el usuario</h4>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Nombre de usuario</li>
              <li>Dirección de correo electrónico</li>
              <li>Imagen(es) subida(s)</li>
              <li>Historia o texto asociado al recuerdo</li>
              <li>País de residencia</li>
              <li>Dirección de wallet (si aplica)</li>
            </ul>

            <h4 className="font-semibold mb-2">2.2 Información relacionada con pagos</h4>
            <p className="mb-2">
              Los pagos realizados mediante tarjeta de crédito o débito son procesados por 
              Crossmint y otros procesadores autorizados.
            </p>
            <p className="mb-2">No almacenamos directamente:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Números completos de tarjeta</li>
              <li>Códigos CVV</li>
              <li>Información bancaria completa</li>
            </ul>

            <h4 className="font-semibold mb-2">2.3 Información técnica</h4>
            <p className="mb-2">Recopilamos automáticamente:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dirección IP</li>
              <li>Tipo de dispositivo</li>
              <li>Navegador</li>
              <li>Fecha y hora de acceso</li>
              <li>Logs de actividad dentro de la plataforma</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">3. USO DE LA INFORMACIÓN</h3>
            <p className="mb-2">Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Crear y almacenar recuerdos digitales</li>
              <li>Generar metadata asociada a NFTs</li>
              <li>Procesar pagos mediante Crossmint</li>
              <li>Permitir el acceso al álbum digital del usuario</li>
              <li>Sistema de puntos y niveles de usuario</li>
              <li>Mejorar la experiencia del usuario</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Prevenir fraude o uso indebido</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">4. NFTs Y CONTENIDO PÚBLICO</h3>
            <p className="mb-4">Cuando un usuario decide certificar su recuerdo como NFT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Parte del contenido (imagen, metadata básica) es registrada en blockchain Polygon.</li>
              <li>La información almacenada en blockchain es permanente y no puede ser modificada ni eliminada.</li>
              <li>El usuario entiende y acepta que dicha información puede ser visible públicamente.</li>
              <li>La Plataforma no controla la infraestructura descentralizada donde se registran los NFTs.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">5. PROVEEDORES EXTERNOS</h3>
            <p className="mb-2">Compartimos información limitada con:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Crossmint (procesamiento de pagos y mint de NFTs)</li>
              <li>Supabase (almacenamiento de datos)</li>
              <li>Vercel (infraestructura de hosting)</li>
              <li>Servicios de almacenamiento descentralizado (IPFS)</li>
              <li>Autoridades regulatorias cuando la ley lo exija</li>
            </ul>
            <p className="mt-4">
              Cada proveedor externo maneja los datos conforme a sus propias políticas de privacidad.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">6. BASE LEGAL DEL TRATAMIENTO</h3>
            <p className="mb-2">Procesamos datos bajo las siguientes bases legales:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Consentimiento del usuario</li>
              <li>Ejecución de un contrato (creación del NFT)</li>
              <li>Cumplimiento de obligaciones legales</li>
              <li>Interés legítimo en mejorar el servicio</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">7. CONSERVACIÓN DE DATOS</h3>
            <p className="mb-2">Conservamos los datos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Mientras la cuenta esté activa</li>
              <li>Mientras sea necesario para cumplir obligaciones legales</li>
              <li>Según requisitos regulatorios aplicables</li>
            </ul>
            <p className="mt-4 font-semibold">
              Los datos registrados en blockchain no pueden ser eliminados debido a su naturaleza descentralizada.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">8. DERECHOS DEL USUARIO</h3>
            <p className="mb-2">Dependiendo de su jurisdicción, el usuario puede tener derecho a:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Acceder a sus datos</li>
              <li>Rectificar información incorrecta</li>
              <li>Solicitar eliminación (cuando sea técnicamente posible)</li>
              <li>Retirar consentimiento</li>
              <li>Solicitar limitación del tratamiento</li>
            </ul>
            <p>Para ejercer estos derechos, puede escribir a:</p>
            <p className="font-semibold">📩 social@memories26.com</p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">9. SEGURIDAD</h3>
            <p className="mb-4">
              Implementamos medidas técnicas y organizativas razonables para proteger los datos personales contra:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Acceso no autorizado</li>
              <li>Alteración</li>
              <li>Divulgación indebida</li>
              <li>Pérdida accidental</li>
            </ul>
            <p>Sin embargo, ningún sistema es completamente seguro.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">10. TRANSFERENCIAS INTERNACIONALES</h3>
            <p className="mb-2">
              Dado que la Plataforma es global, los datos pueden ser procesados en distintos países.
            </p>
            <p>
              Al usar la Plataforma, el usuario acepta posibles transferencias internacionales de datos.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">11. MENORES DE EDAD</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>La Plataforma no está dirigida a menores de 18 años sin supervisión legal.</li>
              <li>No recopilamos intencionalmente información de menores sin consentimiento de un tutor legal.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">12. SISTEMA DE PUNTOS Y GAMIFICACIÓN</h3>
            <p className="mb-2">
              La plataforma incluye un sistema de puntos y niveles que:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Rastrea la actividad del usuario para asignar puntos</li>
              <li>Determina descuentos en precios de NFTs según el nivel</li>
              <li>No constituye inversión ni garantía de valor monetario</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">13. CAMBIOS EN ESTA POLÍTICA</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Podemos actualizar esta Política ocasionalmente.</li>
              <li>Las modificaciones serán publicadas en esta misma página con fecha actualizada.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-700">14. CONTACTO</h3>
            <p className="mb-2">Si tiene preguntas sobre esta Política de Privacidad:</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p>📧 Email: social@memories26.com</p>
              <p>🌐 Website: https://memories26.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}