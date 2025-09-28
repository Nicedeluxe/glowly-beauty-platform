import { MasterData } from '../types/MasterData';
import { MasterWithServices } from '../contexts/BookingContext';

export interface SearchFilters {
  query?: string;
  date?: string;
  time?: string;
  userLat?: number;
  userLng?: number;
}

export interface SearchResult {
  masters: MasterWithServices[];
  totalCount: number;
  searchTerm: string;
  filters: SearchFilters;
}

export class SearchService {
  private static instance: SearchService;
  
  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  /**
   * Main search function with comprehensive filtering
   */
  public search(
    masters: MasterWithServices[],
    filters: SearchFilters,
    isTimeSlotBooked: (masterId: string, date: string, time: string) => boolean
  ): SearchResult {
    console.log('🔍 SearchService: Starting search with filters:', filters);
    
    let filteredMasters = [...masters];
    
    // Step 1: Filter by search query
    if (filters.query) {
      filteredMasters = this.filterByQuery(filteredMasters, filters.query);
      console.log(`🔍 SearchService: After query filter (${filters.query}): ${filteredMasters.length} masters`);
    }
    
    // Step 2: Filter by time availability
    if (filters.date && filters.time) {
      filteredMasters = this.filterByTimeAvailability(filteredMasters, filters.date, filters.time, isTimeSlotBooked);
      console.log(`🔍 SearchService: After time filter (${filters.date} ${filters.time}): ${filteredMasters.length} masters`);
    }
    
    // Step 3: Sort by distance if user location provided
    if (filters.userLat && filters.userLng) {
      filteredMasters = this.sortByDistance(filteredMasters, filters.userLat, filters.userLng);
      console.log(`🔍 SearchService: After distance sort: ${filteredMasters.length} masters`);
    }
    
    return {
      masters: filteredMasters,
      totalCount: filteredMasters.length,
      searchTerm: filters.query || '',
      filters
    };
  }

  /**
   * Filter masters by search query with strict service matching
   */
  private filterByQuery(masters: MasterWithServices[], query: string): MasterWithServices[] {
    const searchTerm = query.toLowerCase().trim();
    
    // Define exact service search terms
    const exactServiceTerms = ['манікюр', 'педикюр', 'брови', 'вії'];
    const isExactServiceQuery = exactServiceTerms.includes(searchTerm);
    
    console.log(`🔍 SearchService: Query "${searchTerm}", isExactServiceQuery: ${isExactServiceQuery}`);
    
    return masters.filter(master => {
      if (isExactServiceQuery) {
        // Strict service search - only masters with specific service
        const hasService = master.services.some(service => 
          service.toLowerCase().includes(searchTerm)
        );
        
        console.log(`🔍 SearchService: Master "${master.name}" (${master.specialization}) - Services: [${master.services.join(', ')}] - HasService: ${hasService}`);
        
        return hasService;
      } else {
        // General search - check all fields
        return (
          // Search in services
          master.services.some(service => 
            service.toLowerCase().includes(searchTerm)
          ) ||
          // Search in specialization
          master.specialization.toLowerCase().includes(searchTerm) ||
          // Search in name
          master.name.toLowerCase().includes(searchTerm) ||
          // Search in location
          master.location.toLowerCase().includes(searchTerm) ||
          // Search in description
          master.description.toLowerCase().includes(searchTerm)
        );
      }
    });
  }

  /**
   * Filter masters by time availability
   */
  private filterByTimeAvailability(
    masters: MasterWithServices[],
    date: string,
    time: string,
    isTimeSlotBooked: (masterId: string, date: string, time: string) => boolean
  ): MasterWithServices[] {
    return masters.filter(master => {
      const isBooked = isTimeSlotBooked(master.id, date, time);
      console.log(`🔍 SearchService: Master "${master.name}" - Time slot ${date} ${time} - IsBooked: ${isBooked}`);
      return !isBooked;
    });
  }

  /**
   * Sort masters by distance from user location
   */
  private sortByDistance(
    masters: MasterWithServices[],
    userLat: number,
    userLng: number
  ): MasterWithServices[] {
    return masters.sort((a, b) => {
      const distanceA = this.calculateDistance(userLat, userLng, a.lat || 50.4501, a.lng || 30.5234);
      const distanceB = this.calculateDistance(userLat, userLng, b.lat || 50.4501, b.lng || 30.5234);
      return distanceA - distanceB;
    });
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get master coordinates (mock data)
   */
  public getMasterCoordinates(masterName: string): { lat: number; lng: number } {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'Анна Красива': { lat: 50.4501, lng: 30.5234 }, // Хрещатик, 22
      'Марія Брові': { lat: 50.4598, lng: 30.5194 }, // Андріївський узвіз, 15
      'Олена Вії': { lat: 50.4264, lng: 30.5382 }, // Печерський узвіз, 8
      'Катерина Педикюр': { lat: 50.4289, lng: 30.5169 }, // Володимирська, 45
      'Вікторія Манікюр': { lat: 50.4319, lng: 30.5169 }, // Повітрофлотський проспект, 45
      'Софія Брови': { lat: 50.4414, lng: 30.5130 }, // Тарасівська, 30
      'Тетяна Вії': { lat: 50.4501, lng: 30.5234 }, // Хрещатик, 1
      'Наталія Педикюр': { lat: 50.4598, lng: 30.5194 }, // Андріївський узвіз, 25
      'Ірина Манікюр': { lat: 50.4264, lng: 30.5382 }, // Печерський узвіз, 15
      'Оксана Брови': { lat: 50.4289, lng: 30.5169 }, // Володимирська, 60
      'Юлія Вії': { lat: 50.4319, lng: 30.5169 }, // Повітрофлотський проспект, 60
      'Світлана Педикюр': { lat: 50.4414, lng: 30.5130 }, // Тарасівська, 45
      'Тетяна Манікюр': { lat: 50.4501, lng: 30.5234 }, // Хрещатик, 10
      'Надія Брови': { lat: 50.4598, lng: 30.5194 }, // Андріївський узвіз, 35
      'Аліна Вії': { lat: 50.4264, lng: 30.5382 }, // Печерський узвіз, 25
      'Діана Манікюр': { lat: 50.4289, lng: 30.5169 }, // Володимирська, 75
      'Маргарита Вії': { lat: 50.4319, lng: 30.5169 }, // Повітрофлотський проспект, 75
      'Валерія Педикюр': { lat: 50.4414, lng: 30.5130 }, // Тарасівська, 60
      'Олена Педикюр': { lat: 50.4501, lng: 30.5234 }, // Хрещатик, 15
      'Катерина Брови': { lat: 50.4598, lng: 30.5194 }, // Андріївський узвіз, 45
    };
    return coordinates[masterName] || { lat: 50.4501, lng: 30.5234 };
  }
}

// Export singleton instance
export const searchService = SearchService.getInstance();
