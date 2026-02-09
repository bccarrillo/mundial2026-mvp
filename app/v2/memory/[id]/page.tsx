import MemoryDetail from '../../../../v2/pages/MemoryDetail';

export default function MemoryDetailRoute({ params }: { params: { id: string } }) {
  return <MemoryDetail params={params} />;
}