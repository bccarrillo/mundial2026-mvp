import MobileLayout from '../components/MobileLayout';
import MemoryCard from '../components/MemoryCard';

export default function MemoriesGallery() {
  const memories = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSVTu4QiPcS0BCuYz9AiO0_iIP99Xid26b7PfTqXKjX7ido3R_JszovY54O3hlL1QQskIfVcyf4J7kDT6YlFOwuPjxtb168AQk5Pfiqun1XoooYMFmU8frp6uz6Fw3UvMOuOiA_Ho64DxL7v7v4BtzvbXEVYkfn6OwDw0VHt_Ek6Ih6XnFnNyO0f9gM5J7WWKy7hcxFOQNDAhCm3kbHjiAsxMdEUOQeYlfKqw8xADnc4Ck2iFpcwRDYjZ2fv7d3YjzVedK9Y-Vl0hS",
      title: "Grito de gol inaugural",
      author: "Juan Diego",
      date: "12 Jun 2026",
      location: "ESTADIO AZTECA"
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOAz74W5zQGtaBUXnU6NmDe2nyrlX-H_ce9YzskVjRQ0A02jrdtXnfog22QN2s-Az6JhPeeF8VWyjq0-ng95v0VcudI4KdUz1PHHZ3sc2VZRLW0OXlzvY1VvuEvQADihJTL0LySb_29usN-pl3G0TFmJBu9ADnmiPa7OADRjuh2b9xRwPfDZEQON4l_pbe8IMZ72mi1r9cYfn3xCDVN9W6nY-vJiNYGKDNIJg-HTZiQTcCCXdLMb-qrvBd7bKD_wokGNjwO6jOMsXq",
      title: "Festejo bajo la lluvia",
      author: "Maria Lopez",
      date: "14 Jun 2026",
      location: "TORONTO FC"
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFouA1exx_0ICuSE-KuE9N2SBERxUnlptUkf9oIPKdGfEqwfmKBy4iLBxWW7mIVBYepyIoCSQymyDgpXA2kHScFEg_T9rEQxSNzav0hmeO9Uby2K9NnEu0whUv0OVqBAVbH678QW9jyYtGX91btQSaJCCIckbgC8FmaptOXzEn6zbPQ33VOwsR_gLKUpTC9EcHP5XHlS3XZurmQw1OXzXemF8JJh9IJKBJWIvfacV-0rLmfpY_MJXTdXWsD06QYY3xsGZU0yPVjDeh",
      title: "Pasión en las tribunas",
      author: "Ricardo K.",
      date: "15 Jun 2026",
      location: "SOFI STADIUM"
    }
  ];

  return (
    <MobileLayout showVip={true} activeTab="explore">
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white leading-none">Recuerdos</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Explora los momentos del Mundial
            </p>
          </div>
          <button className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <span className="material-symbols-outlined font-bold text-xl">add</span>
            <span className="font-bold text-sm tracking-wide">CREAR</span>
          </button>
        </div>

        <div className="space-y-8">
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              image={memory.image}
              title={memory.title}
              author={memory.author}
              date={memory.date}
              location={memory.location}
              onNFTClick={() => console.log('Create NFT for', memory.id)}
              onMoreClick={() => console.log('More options for', memory.id)}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}