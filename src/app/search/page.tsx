'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Mock data for masters
const MOCK_MASTERS = [
  {
    id: '1',
    name: 'Марія Петренко',
    specialization: 'Манікюр',
    rating: 4.9,
    reviews: 127,
    price: '600 грн',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    services: ['Класичний манікюр', 'Гель-лак', 'Френч']
  },
  {
    id: '2',
    name: 'Анна Коваленко',
    specialization: 'Брови та вії',
    rating: 4.8,
    reviews: 89,
    price: '800 грн',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    services: ['Корекція бровей', 'Фарбування', 'Нарощування вій']
  },
  {
    id: '3',
    name: 'Олена Сидоренко',
    specialization: 'Педикюр',
    rating: 4.7,
    reviews: 156,
    price: '500 грн',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    services: ['Класичний педикюр', 'Апаратний педикюр', 'Парафінотерапія']
  }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filteredMasters, setFilteredMasters] = useState(MOCK_MASTERS);

  useEffect(() => {
    if (query) {
      const filtered = MOCK_MASTERS.filter(master =>
        master.name.toLowerCase().includes(query.toLowerCase()) ||
        master.specialization.toLowerCase().includes(query.toLowerCase()) ||
        master.services.some(service => service.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredMasters(filtered);
    } else {
      setFilteredMasters(MOCK_MASTERS);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Glowly</h1>
            </div>
            <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
              Увійти
            </button>
          </div>
        </div>
      </div>

      {/* Search results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {query ? `Результати пошуку: "${query}"` : 'Всі майстри'}
          </h2>
          <p className="text-white/80">
            Знайдено {filteredMasters.length} майстрів
          </p>
        </div>

        {/* Masters grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMasters.map((master) => (
            <div
              key={master.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={master.image}
                  alt={master.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{master.name}</h3>
                  <p className="text-white/80 mb-2">{master.specialization}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white ml-1">{master.rating}</span>
                    </div>
                    <span className="text-white/60">•</span>
                    <span className="text-white/80">{master.reviews} відгуків</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-white/80 text-sm mb-2">Послуги:</p>
                <div className="flex flex-wrap gap-2">
                  {master.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-lg"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{master.price}</span>
                <button className="px-4 py-2 bg-white text-pink-600 font-semibold rounded-lg hover:bg-white/90 transition-colors">
                  Записатися
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMasters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Нічого не знайдено</h3>
            <p className="text-white/80">Спробуйте інший пошуковий запит</p>
          </div>
        )}
      </div>
    </div>
  );
}
