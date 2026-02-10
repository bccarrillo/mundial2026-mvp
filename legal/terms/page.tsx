'use client';

import { useV2 } from '@/lib/V2Context';
import MobileLayout from '@/v2/components/MobileLayout';

export default function TermsAndConditions() {
  const { t } = useV2();

  return (
    <MobileLayout>
      <div className="max-w-4xl mx-auto p-6 pb-32">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Términos, Condiciones y Avisos Legales</h1>
          <p className="text-gray-600 text-sm">
            Memories26 • Última actualización: Febrero 2026 • Versión: 1.0
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6">
          
          <section>
            <h2 className="text-lg font-semibold mb-3">1. ACEPTACIÓN DE LOS TÉRMINOS</h2>
            <p>
              Al acceder, registrarse o utilizar la plataforma Memories26 (en adelante, la Plataforma), 
              el usuario acepta de forma expresa y voluntaria los presentes Términos y Condiciones.
            </p>
            <p>
              Si el usuario no está de acuerdo con estos términos, deberá abstenerse de utilizar la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. DESCRIPCIÓN DEL SERVICIO</h2>
            <p>La Plataforma ofrece un servicio tecnológico que permite a los usuarios:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cargar contenido digital (imágenes u otros medios permitidos)</li>
              <li>Generar NFTs conmemorativos digitales</li>
              <li>Participar, de forma opcional, en subastas digitales</li>
              <li>Recibir ingresos únicamente en caso de una venta exitosa</li>
            </ul>
            <p className="font-medium text-amber-700">
              La Plataforma no garantiza que un NFT sea vendido ni que genere valor económico alguno.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. NATURALEZA DEL NFT</h2>
            <p>Los NFTs creados en la Plataforma:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>No constituyen valores mobiliarios</li>
              <li>No son instrumentos financieros</li>
              <li>No representan inversiones</li>
              <li>No garantizan rentabilidad</li>
            </ul>
            <p className="font-medium text-red-600">
              El valor de un NFT depende exclusivamente del interés del mercado, 
              el cual puede ser inexistente o fluctuar libremente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. PAGO POR CREACIÓN DE NFT</h2>
            <p>La creación de un NFT puede estar sujeta al pago de una tarifa única, la cual corresponde exclusivamente a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Servicios tecnológicos</li>
              <li>Procesamiento digital</li>
              <li>Registro en infraestructura blockchain</li>
            </ul>
            <p className="font-medium text-red-600">El pago no garantiza:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Venta del NFT</li>
              <li>Inclusión en subastas</li>
              <li>Obtención de beneficios económicos</li>
            </ul>
            <p>Los pagos no son reembolsables, salvo obligación legal expresa.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. SUBASTAS</h2>
            <h3 className="font-medium mb-2">5.1 Naturaleza de las subastas</h3>
            <p>Las subastas ofrecidas en la Plataforma son:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Opcionales</li>
              <li>Transparentes</li>
              <li>Regidas por reglas visibles al usuario</li>
              <li>Ejecutadas mediante infraestructura tecnológica y/o contratos inteligentes</li>
            </ul>
            
            <h3 className="font-medium mb-2 mt-4">5.2 Distribución de ingresos</h3>
            <p>En caso de una venta exitosa, los ingresos se distribuyen de la siguiente forma:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>70%</strong> para el creador del NFT</li>
              <li><strong>20%</strong> para la Plataforma</li>
              <li><strong>10%</strong> destinado a proyectos de impacto social o benéficos</li>
            </ul>
            <p>La Plataforma podrá modificar los porcentajes, informándolo previamente a los usuarios.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. RIESGOS</h2>
            <p className="font-medium text-red-600 mb-2">El usuario reconoce y acepta que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>El mercado de NFTs es volátil</li>
              <li>Puede no existir demanda</li>
              <li>Existen riesgos tecnológicos</li>
              <li>Las regulaciones pueden cambiar</li>
            </ul>
            <p>La Plataforma no será responsable por pérdidas derivadas de dichos riesgos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. LIMITACIÓN DE RESPONSABILIDAD</h2>
            <p>En la máxima medida permitida por la ley, la Plataforma no será responsable por:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Pérdidas económicas</li>
              <li>Fallas de terceros</li>
              <li>Errores de blockchain</li>
              <li>Interrupciones del servicio</li>
              <li>Pérdida de acceso a wallets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. LEY APLICABLE</h2>
            <p>
              Estos Términos se rigen por las leyes de la República de Colombia. 
              Cualquier controversia será sometida a los tribunales competentes del país.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. CONTACTO</h2>
            <p>
              Para cualquier consulta legal o administrativa:<br/>
              📧 <a href="mailto:legal@memories26.com" className="text-blue-600">legal@memories26.com</a>
            </p>
          </section>

        </div>
      </div>
    </MobileLayout>
  );
}