import PixelLogo from '@/v2/components/PixelLogo'

export default function LogoExport() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div id="logo-export" className="p-8">
        <PixelLogo size="large" />
      </div>
    </div>
  )
}