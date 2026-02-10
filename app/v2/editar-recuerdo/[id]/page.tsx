import EditMemoryV2 from '@/v2/pages/EditMemoryV2'

interface EditMemoryPageProps {
  params: { id: string }
}

export default async function EditMemoryPage({ params }: EditMemoryPageProps) {
  const resolvedParams = await params
  return <EditMemoryV2 params={resolvedParams} />
}