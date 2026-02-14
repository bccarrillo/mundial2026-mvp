import PixelLogo from '@/v2/components/PixelLogo'

export default function LogoExport() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <style jsx global>{`
        .bg-primary { background-color: #3b82f6 !important; }
        .bg-mexico-green { background-color: #16a34a !important; }
        .bg-usa-blue { background-color: #1e40af !important; }
        .bg-gray-800 { background-color: #1f2937 !important; }
      `}</style>
      <div id="logo-export" className="p-8">
        <PixelLogo size="large" />
      </div>
    </div>
  )
}