import { SearchService, SearchFilters } from '../SearchService';
import { MasterWithServices } from '../../contexts/BookingContext';

// Mock data for testing
const mockMasters: MasterWithServices[] = [
  {
    id: '1',
    name: 'Анна Красива',
    specialization: 'Манікюр',
    rating: 4.9,
    reviews: 234,
    price: '750 грн',
    image: 'https://example.com/anna.jpg',
    services: ['Класичний манікюр', 'Гель-лак', 'Френч', 'Нейл-арт'],
    location: 'Київ, центр',
    address: 'вул. Хрещатик, 22, Київ, 01001',
    phone: '+380 67 123 45 67',
    experience: '5 років',
    description: 'Професійний манікюр з використанням якісних матеріалів',
    lat: 50.4501,
    lng: 30.5234
  },
  {
    id: '2',
    name: 'Марія Брові',
    specialization: 'Брови',
    rating: 4.8,
    reviews: 189,
    price: '900 грн',
    image: 'https://example.com/maria.jpg',
    services: ['Корекція бровей', 'Фарбування бровей', 'Ламінування бровей', 'Татуаж бровей'],
    location: 'Київ, Поділ',
    address: 'вул. Андріївський узвіз, 15, Київ, 04070',
    phone: '+380 50 987 65 43',
    experience: '3 роки',
    description: 'Спеціалізуюся на природній красі бровей',
    lat: 50.4598,
    lng: 30.5194
  },
  {
    id: '3',
    name: 'Олена Вії',
    specialization: 'Вії',
    rating: 4.7,
    reviews: 156,
    price: '1200 грн',
    image: 'https://example.com/olena.jpg',
    services: ['Нарощування вій', 'Ламінування вій', 'Догляд за віями', 'Фарбування вій'],
    location: 'Київ, Печерськ',
    address: 'вул. Печерський узвіз, 8, Київ, 01010',
    phone: '+380 44 234 56 78',
    experience: '7 років',
    description: 'Професійне нарощування та догляд за віями',
    lat: 50.4264,
    lng: 30.5382
  },
  {
    id: '4',
    name: 'Катерина Педикюр',
    specialization: 'Педикюр',
    rating: 4.6,
    reviews: 98,
    price: '800 грн',
    image: 'https://example.com/kateryna.jpg',
    services: ['Класичний педикюр', 'Апаратний педикюр', 'Парафінотерапія', 'Догляд за нігтями'],
    location: 'Київ, Шевченківський',
    address: 'вул. Володимирська, 45, Київ, 01030',
    phone: '+380 67 345 67 89',
    experience: '4 роки',
    description: 'Професійний педикюр з використанням сучасного обладнання',
    lat: 50.4289,
    lng: 30.5169
  }
];

// Mock function for time slot booking check
const mockIsTimeSlotBooked = (masterId: string, date: string, time: string): boolean => {
  // Simulate some bookings
  return masterId === '2' && date === '2025-10-01' && time === '13:00';
};

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    searchService = SearchService.getInstance();
  });

  describe('Exact Service Search', () => {
    test('should return only masters with manicure services for "манікюр" query', () => {
      const filters: SearchFilters = {
        query: 'манікюр'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Анна Красива');
      expect(result.masters[0].services).toContain('Класичний манікюр');
    });

    test('should return only masters with brow services for "брови" query', () => {
      const filters: SearchFilters = {
        query: 'брови'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Марія Брові');
      expect(result.masters[0].services).toContain('Корекція бровей');
    });

    test('should return only masters with lash services for "вії" query', () => {
      const filters: SearchFilters = {
        query: 'вії'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Олена Вії');
      expect(result.masters[0].services).toContain('Нарощування вій');
    });

    test('should return only masters with pedicure services for "педикюр" query', () => {
      const filters: SearchFilters = {
        query: 'педикюр'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Катерина Педикюр');
      expect(result.masters[0].services).toContain('Класичний педикюр');
    });
  });

  describe('General Search', () => {
    test('should return masters matching name for general query', () => {
      const filters: SearchFilters = {
        query: 'Анна'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Анна Красива');
    });

    test('should return masters matching location for general query', () => {
      const filters: SearchFilters = {
        query: 'центр'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Анна Красива');
    });
  });

  describe('Time Availability Filter', () => {
    test('should filter out booked time slots', () => {
      const filters: SearchFilters = {
        query: 'брови',
        date: '2025-10-01',
        time: '13:00'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      // Марія Брові should be filtered out because she's booked at this time
      expect(result.masters).toHaveLength(0);
    });

    test('should include available time slots', () => {
      const filters: SearchFilters = {
        query: 'манікюр',
        date: '2025-10-01',
        time: '13:00'
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      // Анна Красива should be available at this time
      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Анна Красива');
    });
  });

  describe('Distance Sorting', () => {
    test('should sort masters by distance from user location', () => {
      const filters: SearchFilters = {
        userLat: 50.4501,
        userLng: 30.5234
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      // Should be sorted by distance, closest first
      expect(result.masters[0].name).toBe('Анна Красива'); // Closest to user location
    });
  });

  describe('Combined Filters', () => {
    test('should apply all filters correctly', () => {
      const filters: SearchFilters = {
        query: 'манікюр',
        date: '2025-10-01',
        time: '13:00',
        userLat: 50.4501,
        userLng: 30.5234
      };

      const result = searchService.search(mockMasters, filters, mockIsTimeSlotBooked);

      expect(result.masters).toHaveLength(1);
      expect(result.masters[0].name).toBe('Анна Красива');
      expect(result.totalCount).toBe(1);
      expect(result.searchTerm).toBe('манікюр');
    });
  });
});
