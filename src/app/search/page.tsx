'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking, MasterWithServices } from '../../contexts/BookingContext';
import Avatar from '../../components/Avatar';
import { MOCK_MASTERS } from '../../data/masters';

// Extended mock data for masters with proper categories
const MOCK_MASTERS_EXTENDED = [
  {
    id: '1',
    name: 'Анна Красива',
    specialization: 'Манікюр',
    rating: 4.9,
    reviews: 234,
    price: '750 грн',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=150&h=150&fit=crop&crop=face',
    services: ['Класичний манікюр', 'Гель-лак', 'Френч', 'Нейл-арт'],
    location: 'Київ, центр',
    address: 'вул. Хрещатик, 22, Київ, 01001',
    phone: '+380 67 123 45 67',
    experience: '5 років',
    description: 'Професійний манікюр з використанням якісних матеріалів'
  },
  {
    id: '2',
    name: 'Марія Брові',
    specialization: 'Брови',
    rating: 4.8,
    reviews: 189,
    price: '900 грн',
    image: 'https://images.unsplash.com/photo-1594736797933-d0f7c2d0b9b8?w=150&h=150&fit=crop&crop=face',
    services: ['Корекція бровей', 'Фарбування бровей', 'Ламінування бровей', 'Татуаж бровей'],
    location: 'Київ, Поділ',
    address: 'вул. Андріївський узвіз, 15, Київ, 04070',
    phone: '+380 50 987 65 43',
    experience: '3 роки',
    description: 'Спеціалізуюся на природній красі бровей'
  },
  {
    id: '3',
    name: 'Олена Вії',
    specialization: 'Вії',
    rating: 4.7,
    reviews: 156,
    price: '1200 грн',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    services: ['Нарощування вій', 'Ламінування вій', 'Догляд за віями', 'Фарбування вій'],
    location: 'Київ, Печерськ',
    address: 'вул. Печерський узвіз, 8, Київ, 01010',
    phone: '+380 44 234 56 78',
    experience: '7 років',
    description: 'Професійне нарощування та догляд за віями'
  },
  {
    id: '4',
    name: 'Катерина Педикюр',
    specialization: 'Педикюр',
    rating: 4.9,
    reviews: 312,
    price: '950 грн',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    services: ['Класичний педикюр', 'Апаратний педикюр', 'Парафінотерапія', 'Догляд за нігтями'],
    location: 'Київ, Шевченківський',
    address: 'вул. Тараса Шевченка, 45, Київ, 01032',
    phone: '+380 63 345 67 89',
    experience: '4 роки',
    description: 'Професійний педикюр та догляд за ногами'
  },
  {
    id: '5',
    name: 'Вікторія Манікюр',
    specialization: 'Манікюр',
    rating: 4.6,
    reviews: 278,
    price: '800 грн',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    services: ['Гель-лак', 'Нарощування нігтів', 'Дізайн нігтів', 'Френч'],
    location: 'Київ, Солом\'янський',
    address: 'вул. Солом\'янська, 12, Київ, 03110',
    phone: '+380 67 456 78 90',
    experience: '6 років',
    description: 'Креативний підхід до дизайну нігтів'
  },
  {
    id: '6',
    name: 'Софія Брови',
    specialization: 'Брови',
    rating: 4.8,
    reviews: 145,
    price: '850 грн',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
    services: ['Корекція бровей', 'Фарбування', 'Ламінування', 'Консультації'],
    location: 'Київ, Оболонь',
    address: 'пр. Героїв Сталінграду, 35, Київ, 04211',
    phone: '+380 44 567 89 01',
    experience: '8 років',
    description: 'Експерт з форми та догляду за бровами'
  },
  {
    id: '7',
    name: 'Тетяна Вії',
    specialization: 'Вії',
    rating: 4.9,
    reviews: 203,
    price: '1100 грн',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    services: ['Нарощування вій', 'Ламінування', 'Догляд', 'Фарбування'],
    location: 'Київ, центр',
    address: 'вул. Велика Васильківська, 25, Київ, 01004',
    phone: '+380 50 678 90 12',
    experience: '5 років',
    description: 'Професійне нарощування природних вій'
  },
  {
    id: '8',
    name: 'Наталія Педикюр',
    specialization: 'Педикюр',
    rating: 4.7,
    reviews: 167,
    price: '700 грн',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    services: ['Апаратний педикюр', 'Класичний педикюр', 'Парафінотерапія', 'Масаж ніг'],
    location: 'Київ, Поділ',
    address: 'вул. Контрактова площа, 18, Київ, 04070',
    phone: '+380 63 789 01 23',
    experience: '4 роки',
    description: 'Спеціалізуюся на апаратному педикюрі'
  },
  {
    id: '9',
    name: 'Ірина Манікюр',
    specialization: 'Манікюр',
    rating: 4.5,
    reviews: 198,
    price: '650 грн',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    services: ['Класичний манікюр', 'Гель-лак', 'Френч', 'Нейл-арт', 'Стрипінг'],
    location: 'Київ, Троєщина',
    address: 'вул. Милославська, 42, Київ, 02000',
    phone: '+380 97 123 45 67',
    experience: '3 роки',
    description: 'Молода та талановита майстриня манікюру'
  },
  {
    id: '10',
    name: 'Оксана Брови',
    specialization: 'Брови',
    rating: 4.7,
    reviews: 156,
    price: '800 грн',
    image: 'https://images.unsplash.com/photo-1594736797933-d0f7c2d0b9b8?w=150&h=150&fit=crop&crop=face',
    services: ['Корекція бровей', 'Фарбування', 'Ламінування', 'Перманентний макіяж'],
    location: 'Київ, Дарниця',
    address: 'пр. Броварський, 15, Київ, 02000',
    phone: '+380 63 234 56 78',
    experience: '4 роки',
    description: 'Спеціалізуюся на природній формі бровей'
  },
  {
    id: '11',
    name: 'Юлія Вії',
    specialization: 'Вії',
    rating: 4.8,
    reviews: 234,
    price: '1000 грн',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    services: ['Нарощування вій', 'Ламінування', 'Догляд', 'Фарбування', 'Керлінг'],
    location: 'Київ, Виноградар',
    address: 'вул. Виноградна, 8, Київ, 03000',
    phone: '+380 50 345 67 89',
    experience: '6 років',
    description: 'Професійне нарощування вій різних технік'
  },
  {
    id: '12',
    name: 'Світлана Педикюр',
    specialization: 'Педикюр',
    rating: 4.6,
    reviews: 189,
    price: '750 грн',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
    services: ['Апаратний педикюр', 'Класичний педикюр', 'Парафінотерапія', 'Масаж ніг', 'Діагностика'],
    location: 'Київ, Теремки',
    address: 'вул. Академіка Заболотного, 37, Київ, 03100',
    phone: '+380 67 456 78 90',
    experience: '5 років',
    description: 'Експерт з догляду за ногами та нігтями'
  },
  {
    id: '13',
    name: 'Тетяна Манікюр',
    specialization: 'Манікюр',
    rating: 4.9,
    reviews: 267,
    price: '850 грн',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    services: ['Гель-лак', 'Нарощування нігтів', 'Дізайн нігтів', 'Френч', 'Омбре'],
    location: 'Київ, Лівобережна',
    address: 'вул. Лівобережна, 25, Київ, 02000',
    phone: '+380 44 567 89 01',
    experience: '8 років',
    description: 'Креативний дизайн нігтів та професійний манікюр'
  },
  {
    id: '14',
    name: 'Надія Брови',
    specialization: 'Брови',
    rating: 4.7,
    reviews: 145,
    price: '750 грн',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    services: ['Корекція бровей', 'Фарбування', 'Ламінування', 'Консультації', 'Підбір форми'],
    location: 'Київ, Нивки',
    address: 'вул. Нивська, 12, Київ, 03000',
    phone: '+380 63 678 90 12',
    experience: '3 роки',
    description: 'Молодий талановитий майстер з бровей'
  },
  {
    id: '15',
    name: 'Аліна Вії',
    specialization: 'Вії',
    rating: 4.8,
    reviews: 178,
    price: '950 грн',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=150&h=150&fit=crop&crop=face',
    services: ['Нарощування вій', 'Ламінування', 'Догляд', 'Фарбування', 'Ліфтинг'],
    location: 'Київ, Святошино',
    address: 'вул. Святошинська, 45, Київ, 03000',
    phone: '+380 50 789 01 23',
    experience: '4 роки',
    description: 'Професійне нарощування та догляд за віями'
  },
  {
    id: '16',
    name: 'Валерія Педикюр',
    specialization: 'Педикюр',
    rating: 4.5,
    reviews: 123,
    price: '650 грн',
    image: 'https://images.unsplash.com/photo-1594736797933-d0f7c2d0b9b8?w=150&h=150&fit=crop&crop=face',
    services: ['Класичний педикюр', 'Апаратний педикюр', 'Парафінотерапія', 'Масаж ніг'],
    location: 'Київ, Борщагівка',
    address: 'вул. Борщагівська, 78, Київ, 03000',
    phone: '+380 97 890 12 34',
    experience: '2 роки',
    description: 'Молода майстриня педикюру з сучасними технологіями'
  },
  {
    id: '17',
    name: 'Діана Манікюр',
    specialization: 'Манікюр',
    rating: 4.8,
    reviews: 201,
    price: '780 грн',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    services: ['Гель-лак', 'Нарощування нігтів', 'Дізайн нігтів', 'Френч', 'Нейл-арт'],
    location: 'Київ, Троєщина',
    address: 'вул. Милославська, 95, Київ, 02000',
    phone: '+380 63 901 23 45',
    experience: '6 років',
    description: 'Художниця нігтів з унікальним стилем'
  },
  {
    id: '18',
    name: 'Катерина Брови',
    specialization: 'Брови',
    rating: 4.9,
    reviews: 289,
    price: '900 грн',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    services: ['Корекція бровей', 'Фарбування', 'Ламінування', 'Перманентний макіяж', 'Мікроблейдинг'],
    location: 'Київ, Дарниця',
    address: 'пр. Броварський, 67, Київ, 02000',
    phone: '+380 50 012 34 56',
    experience: '7 років',
    description: 'Експерт з перманентного макіяжу бровей'
  },
  {
    id: '19',
    name: 'Маргарита Вії',
    specialization: 'Вії',
    rating: 4.7,
    reviews: 156,
    price: '1100 грн',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
    services: ['Нарощування вій', 'Ламінування', 'Догляд', 'Фарбування', 'Керлінг', 'Ліфтинг'],
    location: 'Київ, Виноградар',
    address: 'вул. Виноградна, 42, Київ, 03000',
    phone: '+380 67 123 45 67',
    experience: '5 років',
    description: 'Професійне нарощування вій різних об\'ємів'
  },
  {
    id: '20',
    name: 'Олена Педикюр',
    specialization: 'Педикюр',
    rating: 4.6,
    reviews: 167,
    price: '720 грн',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    services: ['Апаратний педикюр', 'Класичний педикюр', 'Парафінотерапія', 'Масаж ніг', 'Діагностика', 'Лікування'],
    location: 'Київ, Теремки',
    address: 'вул. Академіка Заболотного, 89, Київ, 03100',
    phone: '+380 44 234 56 78',
    experience: '6 років',
    description: 'Спеціалізуюся на лікувальному педикюрі'
  }
];

function SearchContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { isTimeSlotBooked, isTimeSlotAvailableGlobally, addBooking, getMastersWithDynamicServices } = useBooking();
  const query = searchParams.get('q') || '';
  const searchDate = searchParams.get('date') || '';
  const searchTime = searchParams.get('time') || '';
  const userLat = parseFloat(searchParams.get('lat') || '50.4501');
  const userLng = parseFloat(searchParams.get('lng') || '30.5234');
  
  const [filteredMasters, setFilteredMasters] = useState<MasterWithServices[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<typeof MOCK_MASTERS[0] | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingStep, setBookingStep] = useState<'services' | 'datetime' | 'payment'>('services');

  // Mock data for time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Mock data for booked slots (in real app this would come from API)
  const bookedSlots: string[] = useMemo(() => [], []); // No slots are booked for testing

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Mock coordinates for masters (in real app this would come from database)
  const getMasterCoordinates = (master: typeof MOCK_MASTERS[0]) => {
    const coordinates: { [key: string]: { lat: number, lng: number } } = {
      // Центр Києва
      'Анна Красива': { lat: 50.4501, lng: 30.5234 }, // Хрещатик
      'Тетяна Вії': { lat: 50.4489, lng: 30.5256 }, // Велика Васильківська
      
      // Поділ
      'Марія Брові': { lat: 50.4644, lng: 30.5191 }, // Андріївський узвіз
      'Наталія Педикюр': { lat: 50.4611, lng: 30.5222 }, // Контрактова площа
      
      // Печерськ
      'Олена Вії': { lat: 50.4274, lng: 30.5381 }, // Печерський узвіз
      
      // Шевченківський
      'Катерина Педикюр': { lat: 50.4422, lng: 30.5167 }, // Тараса Шевченка
      
      // Солом'янський
      'Вікторія Манікюр': { lat: 50.4656, lng: 30.5156 }, // Солом'янська
      
      // Оболонь
      'Софія Брови': { lat: 50.5167, lng: 30.4833 }, // Героїв Сталінграду
      
      // Троєщина
      'Ірина Манікюр': { lat: 50.5089, lng: 30.6023 }, // Милославська, 42
      'Діана Манікюр': { lat: 50.5098, lng: 30.6015 }, // Милославська, 95
      
      // Дарниця
      'Оксана Брови': { lat: 50.4589, lng: 30.6189 }, // Броварський, 15
      'Катерина Брови': { lat: 50.4595, lng: 30.6175 }, // Броварський, 67
      
      // Виноградар
      'Юлія Вії': { lat: 50.4876, lng: 30.4567 }, // Виноградна, 8
      'Маргарита Вії': { lat: 50.4882, lng: 30.4578 }, // Виноградна, 42
      
      // Теремки
      'Світлана Педикюр': { lat: 50.3456, lng: 30.5234 }, // Академіка Заболотного, 37
      'Олена Педикюр': { lat: 50.3467, lng: 30.5245 }, // Академіка Заболотного, 89
      
      // Лівобережна
      'Тетяна Манікюр': { lat: 50.4567, lng: 30.6789 }, // Лівобережна, 25
      
      // Нивки
      'Надія Брови': { lat: 50.4567, lng: 30.4567 }, // Нивська, 12
      
      // Святошино
      'Аліна Вії': { lat: 50.4567, lng: 30.3456 }, // Святошинська, 45
      
      // Борщагівка
      'Валерія Педикюр': { lat: 50.3456, lng: 30.4567 }, // Борщагівська, 78
    };
    return coordinates[master.name] || { lat: 50.4501, lng: 30.5234 };
  };

  useEffect(() => {
    if (query) {
      const searchTerm = query.toLowerCase().trim();
      const mastersWithDynamicServices = getMastersWithDynamicServices();
      let filtered = mastersWithDynamicServices.filter(master => {
        // Сначала проверяем услуги - это приоритет для точного поиска
        const hasService = master.services.some(service => 
          service.toLowerCase().includes(searchTerm) || 
          service.toLowerCase() === searchTerm
        );
        
        // Debug logging
        if (searchTerm === 'манікюр') {
          console.log(`Master: ${master.name}, Services: ${master.services.join(', ')}, HasService: ${hasService}`);
        }
        
        if (hasService) {
          return true;
        }
        
        // Затем проверяем специализацию
        if (master.specialization.toLowerCase() === searchTerm) {
          return true;
        }
        
        if (master.specialization.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Поиск по имени
        if (master.name.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Поиск по локации
        if (master.location.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Поиск по описанию
        if (master.description.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        return false;
      });

      // Filter by available time slots if date and time are specified
      if (searchDate && searchTime) {
        filtered = filtered.filter((master) => {
          // Check if this time slot is already booked for this master using booking context
          const isBooked = bookedSlots.includes(searchTime) || isTimeSlotBooked(master.id, searchDate, searchTime);
          return !isBooked;
        });
      }

      // Sort by distance from user location
      filtered = filtered.sort((a, b) => {
        const coordsA = getMasterCoordinates(a);
        const coordsB = getMasterCoordinates(b);
        
        const distanceA = calculateDistance(userLat, userLng, coordsA.lat, coordsA.lng);
        const distanceB = calculateDistance(userLat, userLng, coordsB.lat, coordsB.lng);
        
        return distanceA - distanceB;
      });

      setFilteredMasters(filtered);
    } else {
      // If no search query but date and time are specified, filter by availability
      let allMasters = getMastersWithDynamicServices();
      if (searchDate && searchTime) {
        allMasters = allMasters.filter((master) => {
          const isBooked = bookedSlots.includes(searchTime) || isTimeSlotBooked(master.id, searchDate, searchTime);
          return !isBooked;
        });
      }
      
      // Sort by distance from user location
      allMasters = allMasters.sort((a, b) => {
        const coordsA = getMasterCoordinates(a);
        const coordsB = getMasterCoordinates(b);
        
        const distanceA = calculateDistance(userLat, userLng, coordsA.lat, coordsA.lng);
        const distanceB = calculateDistance(userLat, userLng, coordsB.lat, coordsB.lng);
        
        return distanceA - distanceB;
      });
      
      setFilteredMasters(allMasters);
    }
  }, [query, searchDate, searchTime, userLat, userLng, bookedSlots, isTimeSlotBooked, isTimeSlotAvailableGlobally, getMastersWithDynamicServices]);

  // Initialize filteredMasters with dynamic services
  useEffect(() => {
    if (filteredMasters.length === 0) {
      setFilteredMasters(getMastersWithDynamicServices());
    }
  }, [getMastersWithDynamicServices, filteredMasters.length]);


  const getCalendarDates = () => {
    const today = new Date();
    const calendarDates = [];
    
    // Start from tomorrow
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    
    // End date is 30 days from tomorrow
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 31); // +1 to include the 30th day
    
    // Get the start of the calendar grid (Monday of the week containing tomorrow)
    const startOfCalendar = new Date(startDate);
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfCalendar.setDate(startDate.getDate() - daysToMonday);
    
    // Get the end of the calendar grid (Sunday of the week containing the last available day)
    const endOfCalendar = new Date(endDate);
    const lastDayOfWeek = endDate.getDay();
    const daysToSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    endOfCalendar.setDate(endDate.getDate() + daysToSunday);
    
    // Generate all days in the calendar grid
    const currentDate = new Date(startOfCalendar);
    while (currentDate <= endOfCalendar) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isInRange = currentDate >= startDate && currentDate < endDate;
      const isPast = currentDate < today;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isAvailable = isInRange && !isPast && !isToday;
      
      calendarDates.push({
        date: dateStr,
        dateObj: new Date(currentDate),
        dayName: currentDate.toLocaleDateString('uk-UA', { weekday: 'short' }),
        dayNumber: currentDate.getDate(),
        month: currentDate.toLocaleDateString('uk-UA', { month: 'short' }),
        isInRange,
        isPast,
        isToday,
        isAvailable
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return calendarDates;
  };

  const handleBookAppointment = (master: typeof MOCK_MASTERS[0]) => {
    setSelectedMaster(master);
    setSelectedServices([]);
    
    // If date and time are already selected from search, use them
    if (searchDate && searchTime) {
      setSelectedDate(searchDate);
      setSelectedTimeSlot(searchTime);
      setBookingStep('services');
    } else {
      setSelectedDate('');
      setSelectedTimeSlot('');
      setBookingStep('services');
    }
    
    setShowBookingModal(true);
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleNextStep = () => {
    if (bookingStep === 'services' && selectedServices.length > 0) {
      // If date and time are already selected from search, skip to payment
      if (searchDate && searchTime && selectedDate && selectedTimeSlot) {
        setBookingStep('payment');
      } else {
        setBookingStep('datetime');
      }
    } else if (bookingStep === 'datetime' && selectedDate && selectedTimeSlot) {
      setBookingStep('payment');
    }
  };

  const handlePreviousStep = () => {
    if (bookingStep === 'datetime') {
      setBookingStep('services');
    } else if (bookingStep === 'payment') {
      // If date and time were pre-selected from search, go back to services
      if (searchDate && searchTime) {
        setBookingStep('services');
      } else {
        setBookingStep('datetime');
      }
    }
  };

  const handleConfirmBooking = () => {
    if (selectedMaster && selectedServices.length > 0 && selectedDate && selectedTimeSlot && user) {
      // Check if slot is already booked
      if (isTimeSlotBooked(selectedMaster.id, selectedDate, selectedTimeSlot)) {
        alert('Цей час вже заброньований! Оберіть інший час.');
        return;
      }
      
      // Calculate total price
      const totalPrice = selectedServices.length * 200; // Mock pricing
      
      // Add booking to context
      addBooking({
        masterId: selectedMaster.id,
        masterName: selectedMaster.name,
        masterSpecialization: selectedMaster.specialization,
        masterAddress: selectedMaster.address,
        masterPhone: selectedMaster.phone,
        clientId: user.id,
        clientName: user.name,
        date: selectedDate,
        time: selectedTimeSlot,
        services: selectedServices,
        totalPrice: totalPrice,
      });
      
      alert(`Запис підтверджено! Ви записані до ${selectedMaster.name} на ${selectedDate} о ${selectedTimeSlot}. Вартість: ${totalPrice} грн.`);
      setShowBookingModal(false);
      setSelectedMaster(null);
      setSelectedServices([]);
      setSelectedDate('');
      setSelectedTimeSlot('');
      setBookingStep('services');
    }
  };

  const resetBookingModal = () => {
    setShowBookingModal(false);
    setSelectedMaster(null);
    setSelectedServices([]);
    
    // Reset to search date/time if they exist, otherwise clear
    if (searchDate && searchTime) {
      setSelectedDate(searchDate);
      setSelectedTimeSlot(searchTime);
    } else {
      setSelectedDate('');
      setSelectedTimeSlot('');
    }
    
    setBookingStep('services');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 10L61.8 38.2L90 50L61.8 61.8L50 90L38.2 61.8L10 50L38.2 38.2L50 10Z" />
                  </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Glowly</h1>
              </Link>
            </div>
            {user ? (
              <Link
                href={user.type === 'MASTER' ? '/master-dashboard' : '/dashboard'}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <Avatar user={user} size="sm" />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
              Увійти
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {query ? `Результати пошуку: "${query}"` : 'Всі майстри'}
          </h2>
          
          {searchDate && searchTime && (
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  <span>{new Date(searchDate).toLocaleDateString('uk-UA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{searchTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌸</span>
                  <span>Сортовано по відстані</span>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-white/80">
            Знайдено {filteredMasters.length} майстрів
            {searchDate && searchTime && ' доступних у вибраний час'}
          </p>
        </div>

        {/* Masters grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMasters.map((master) => (
            <div
              key={master.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-colors"
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
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400">💫</span>
                      <span className="text-white ml-1">{master.rating}</span>
                    </div>
                    <span className="text-white/60">•</span>
                    <span className="text-white/80">{master.reviews} відгуків</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <span>🌸 {master.location}</span>
                    <span>•</span>
                    <span>🦋 {master.experience}</span>
                    {searchDate && searchTime && (
                      <>
                        <span>•</span>
                        <span>
                          ✨ {calculateDistance(userLat, userLng, getMasterCoordinates(master).lat, getMasterCoordinates(master).lng).toFixed(1)} км
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-white/80 text-sm mb-2">{master.description}</p>
                <p className="text-white/80 text-sm mb-2">Послуги:</p>
                <div className="flex flex-wrap gap-2">
                  {master.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-lg"
                    >
                      {service}
                    </span>
                  ))}
                  {master.services.length > 3 && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-lg">
                      +{master.services.length - 3} ще
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{master.price}</span>
                <button 
                  onClick={() => handleBookAppointment(master)}
                  className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-white/90 transition-colors"
                >
                  Записатися
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMasters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Нічого не знайдено</h3>
            <p className="text-white/80">Спробуйте інший пошуковий запит</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMaster && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Запис до майстра</h3>
              <p className="text-white/80">Ви хочете записатися до</p>
              <p className="text-white font-semibold text-lg">{selectedMaster.name}</p>
              <p className="text-white/60 text-sm">{selectedMaster.specialization}</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                {['services', 'datetime', 'payment'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      bookingStep === step 
                        ? 'bg-white text-purple-700' 
                        : ['services', 'datetime', 'payment'].indexOf(bookingStep) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div className={`w-8 h-0.5 ${
                        ['services', 'datetime', 'payment'].indexOf(bookingStep) > index
                          ? 'bg-green-500'
                          : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Services Selection */}
            {bookingStep === 'services' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Оберіть послуги:</h4>
                
                {/* Show pre-selected date and time if available */}
                {searchDate && searchTime && (
                  <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <span>{new Date(searchDate).toLocaleDateString('uk-UA')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>{searchTime}</span>
                      </div>
                      <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        Попередньо обрано
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3">
                  {selectedMaster.services.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 rounded-xl border transition-colors text-left ${
                        selectedServices.includes(service)
                          ? 'bg-white/20 border-white/40 text-white'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{service}</span>
                        <span className="text-sm opacity-80">200 грн</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {selectedServices.length > 0 && (
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-2">Вибрано послуг: {selectedServices.length}</p>
                    <p className="text-white font-semibold">
                      Загальна вартість: {selectedServices.length * 200} грн
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Date & Time Selection - only show if not pre-selected from search */}
            {bookingStep === 'datetime' && !searchDate && !searchTime && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white mb-4">Оберіть дату та час:</h4>
                
                {/* Date Selection - Monthly Calendar Layout */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white/80 text-sm">Дата:</p>
                    <h4 className="text-white font-semibold text-sm">
                      {(() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const lastDay = new Date();
                        lastDay.setDate(tomorrow.getDate() + 29);
                        return `${tomorrow.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })} - ${lastDay.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}`;
                      })()}
                    </h4>
                  </div>
                  
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((day) => (
                      <div key={day} className="text-center text-xs text-white/60 font-medium py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {getCalendarDates().map((dateInfo) => (
                      <button
                        key={dateInfo.date}
                        onClick={() => dateInfo.isAvailable && setSelectedDate(dateInfo.date)}
                        disabled={!dateInfo.isAvailable}
                        className={`p-2 rounded-lg border transition-colors text-center min-h-[48px] flex flex-col items-center justify-center ${
                          selectedDate === dateInfo.date
                            ? 'bg-white text-purple-700 border-white'
                            : !dateInfo.isInRange
                            ? 'bg-gray-700/20 border-gray-700/30 text-gray-500 cursor-not-allowed'
                            : dateInfo.isPast
                            ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed'
                            : dateInfo.isToday
                            ? 'bg-gray-600/20 border-gray-600/30 text-gray-500 cursor-not-allowed'
                            : dateInfo.isAvailable
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                            : 'bg-gray-600/20 border-gray-600/30 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <div className={`text-xs font-medium ${!dateInfo.isInRange ? 'opacity-50' : ''}`}>
                          {dateInfo.dayNumber}
                        </div>
                        {dateInfo.isPast && dateInfo.isInRange && (
                          <div className="text-[10px] opacity-60">Минуло</div>
                        )}
                        {dateInfo.isToday && dateInfo.isInRange && (
                          <div className="text-[10px] opacity-60">Сьогодні</div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-3 mt-3 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-white/10 rounded border border-white/20"></div>
                      <span>Доступно</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-white rounded border border-white"></div>
                      <span>Обрано</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-500/20 rounded border border-gray-500/30"></div>
                      <span>Недоступно</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-700/20 rounded border border-gray-700/30"></div>
                      <span>Поза діапазоном</span>
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <p className="text-white/80 text-sm mb-3">Час:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time) || isTimeSlotBooked(selectedMaster.id, selectedDate, time);
                        const isSelected = selectedTimeSlot === time;
                        
                        return (
                          <button
                            key={time}
                            onClick={() => !isBooked && setSelectedTimeSlot(time)}
                            disabled={isBooked}
                            className={`p-3 rounded-xl border transition-colors text-center ${
                              isSelected
                                ? 'bg-white text-purple-700 border-white'
                                : isBooked
                                ? 'bg-red-500/20 border-red-500/30 text-red-300 cursor-not-allowed'
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                            }`}
                          >
                            {time}
                            {isBooked && <div className="text-xs opacity-60">Зайнято</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment */}
            {bookingStep === 'payment' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Підтвердження замовлення:</h4>
                
                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Майстер:</span>
                    <span className="text-white font-medium">{selectedMaster.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Адреса:</span>
                    <span className="text-white font-medium text-sm">{selectedMaster.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Телефон:</span>
                    <span className="text-white font-medium">{selectedMaster.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Дата:</span>
                    <span className="text-white font-medium">
                      {new Date(selectedDate).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Час:</span>
                    <span className="text-white font-medium">{selectedTimeSlot}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-white/80">Послуги:</span>
                    </div>
                    {selectedServices.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-white/70">• {service}</span>
                        <span className="text-white/70">200 грн</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Загалом:</span>
                      <span className="text-white font-bold text-xl">
                        {selectedServices.length * 200} грн
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-yellow-200 text-sm">
                    ✨ Після підтвердження ви будете перенаправлені на сторінку оплати
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={resetBookingModal}
                className="flex-1 py-3 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition-colors"
              >
                Скасувати
              </button>
              
              {bookingStep !== 'services' && (
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
                >
                  Назад
                </button>
              )}
              
              {bookingStep === 'services' && (
                <button
                  onClick={handleNextStep}
                  disabled={selectedServices.length === 0}
                  className="flex-1 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Далі
                </button>
              )}
              
              {bookingStep === 'datetime' && (
                <button
                  onClick={handleNextStep}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className="flex-1 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  До оплати
                </button>
              )}
              
              {bookingStep === 'payment' && (
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  Оплатити
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

