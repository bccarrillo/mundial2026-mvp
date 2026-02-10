import MemoryDetailV2 from '@/v2/pages/MemoryDetailV2'

export default async function MemoryDetailV2Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <MemoryDetailV2 params={resolvedParams} />
}