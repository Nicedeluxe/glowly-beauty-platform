'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_MASTERS } from '../data/masters';
import { MasterData } from '../types/MasterData';

export interface Booking {
  id: string;
  masterId: string;
  masterName: string;
  masterSpecialization: string;
  masterAddress: string;
  masterPhone: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  services: string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'paid';
  createdAt: string;
}

export interface MasterService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface MasterProfile {
  id: string;
  name: string;
  phone: string;
  type: 'salon' | 'freelance';
  description: string;
  services: MasterService[];
}

export interface MasterWithServices extends MasterData {
  services: string[];
  lat?: number;
  lng?: number;
}

interface BookingContextType {
  bookings: Booking[];
  masterProfiles: MasterProfile[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingsByMaster: (masterId: string) => Booking[];
  getBookingsByClient: (clientId: string) => Booking[];
  isTimeSlotBooked: (masterId: string, date: string, time: string) => boolean;
  isTimeSlotAvailableGlobally: (date: string, time: string) => boolean;
  getMastersWithDynamicServices: () => MasterWithServices[];
  getMasterProfile: (masterId: string) => MasterProfile | undefined;
  updateMasterProfile: (masterId: string, profile: Partial<MasterProfile>) => void;
  addMasterService: (masterId: string, service: Omit<MasterService, 'id'>) => void;
  updateMasterService: (masterId: string, serviceId: string, service: Partial<MasterService>) => void;
  removeMasterService: (masterId: string, serviceId: string) => void;
  rescheduleBooking: (bookingId: string, newDate: string, newTime: string) => void;
  refundBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed' | 'paid') => void;
  getBookingById: (bookingId: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [masterProfiles, setMasterProfiles] = useState<MasterProfile[]>([]);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('glowly-bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
      }
    }
  }, []);

  // Load master profiles from localStorage on mount
  useEffect(() => {
    const savedMasterProfiles = localStorage.getItem('glowly-master-profiles');
    if (savedMasterProfiles) {
      try {
        setMasterProfiles(JSON.parse(savedMasterProfiles));
      } catch (error) {
        console.error('Error loading master profiles from localStorage:', error);
      }
    }
  }, []);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('glowly-bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Save master profiles to localStorage whenever masterProfiles change
  useEffect(() => {
    localStorage.setItem('glowly-master-profiles', JSON.stringify(masterProfiles));
  }, [masterProfiles]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' as const }
        : booking
    ));
  };

  const getBookingsByMaster = (masterId: string) => {
    return bookings.filter(booking => 
      booking.masterId === masterId && booking.status === 'confirmed'
    );
  };

  const getBookingsByClient = (clientId: string) => {
    return bookings.filter(booking => 
      booking.clientId === clientId && booking.status === 'confirmed'
    );
  };

  const isTimeSlotBooked = (masterId: string, date: string, time: string) => {
    return bookings.some(booking => 
      booking.masterId === masterId && 
      booking.date === date && 
      booking.time === time && 
      booking.status === 'confirmed'
    );
  };

  const isTimeSlotAvailableGlobally = (date: string, time: string) => {
    // Check if there's at least one master available at this time slot
    // Use the dynamic masters data instead of static MOCK_MASTERS
    const mastersWithServices = getMastersWithDynamicServices();
    return mastersWithServices.some(master => 
      !isTimeSlotBooked(master.id, date, time)
    );
  };

  const getMastersWithDynamicServices = (): MasterWithServices[] => {
    return MOCK_MASTERS.map(master => {
      const profile = getMasterProfile(master.id);
      const dynamicServices = profile?.services || [];
      
      // Priority: 1) Dynamic services from profile, 2) Static services from MOCK_MASTERS
      let services: string[];
      
      if (dynamicServices.length > 0) {
        // Use dynamic services from master's profile
        services = dynamicServices.map(service => service.name);
      } else if (master.services && master.services.length > 0) {
        // Use static services from MOCK_MASTERS
        services = master.services;
      } else {
        // No services available - empty array
        services = [];
      }
      
      const coordinates = getMasterCoordinates(master.name);
      
      return {
        ...master,
        services: services,
        lat: coordinates.lat,
        lng: coordinates.lng
      };
    });
  };

  // Helper function to get master coordinates
  const getMasterCoordinates = (masterName: string): { lat: number; lng: number } => {
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
  };

  const getMasterProfile = (masterId: string) => {
    return masterProfiles.find(profile => profile.id === masterId);
  };

  const updateMasterProfile = (masterId: string, profileData: Partial<MasterProfile>) => {
    setMasterProfiles(prev => {
      const existingIndex = prev.findIndex(profile => profile.id === masterId);
      if (existingIndex >= 0) {
        // Update existing profile
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...profileData };
        return updated;
      } else {
        // Create new profile
        const newProfile: MasterProfile = {
          id: masterId,
          name: '',
          phone: '',
          type: 'salon',
          description: '',
          services: [],
          ...profileData
        };
        return [...prev, newProfile];
      }
    });
  };

  const addMasterService = (masterId: string, serviceData: Omit<MasterService, 'id'>) => {
    const newService: MasterService = {
      ...serviceData,
      id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    setMasterProfiles(prev => {
      const existingIndex = prev.findIndex(profile => profile.id === masterId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          services: [...updated[existingIndex].services, newService]
        };
        return updated;
      } else {
        // Create new profile with this service
        const newProfile: MasterProfile = {
          id: masterId,
          name: '',
          phone: '',
          type: 'salon',
          description: '',
          services: [newService]
        };
        return [...prev, newProfile];
      }
    });
  };

  const updateMasterService = (masterId: string, serviceId: string, serviceData: Partial<MasterService>) => {
    setMasterProfiles(prev => {
      const profileIndex = prev.findIndex(profile => profile.id === masterId);
      if (profileIndex >= 0) {
        const updated = [...prev];
        const serviceIndex = updated[profileIndex].services.findIndex(service => service.id === serviceId);
        if (serviceIndex >= 0) {
          updated[profileIndex].services[serviceIndex] = {
            ...updated[profileIndex].services[serviceIndex],
            ...serviceData
          };
        }
        return updated;
      }
      return prev;
    });
  };

  const removeMasterService = (masterId: string, serviceId: string) => {
    setMasterProfiles(prev => {
      const profileIndex = prev.findIndex(profile => profile.id === masterId);
      if (profileIndex >= 0) {
        const updated = [...prev];
        updated[profileIndex] = {
          ...updated[profileIndex],
          services: updated[profileIndex].services.filter(service => service.id !== serviceId)
        };
        return updated;
      }
      return prev;
    });
  };

  const rescheduleBooking = (bookingId: string, newDate: string, newTime: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, date: newDate, time: newTime }
        : booking
    ));
  };

  const refundBooking = (bookingId: string) => {
    // In real app, this would integrate with payment system for refund
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' as const }
        : booking
    ));
  };

  const updateBookingStatus = (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed' | 'paid') => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
  };

  const getBookingById = (bookingId: string) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const value = {
    bookings,
    masterProfiles,
    addBooking,
    cancelBooking,
    getBookingsByMaster,
    getBookingsByClient,
    isTimeSlotBooked,
    isTimeSlotAvailableGlobally,
    getMastersWithDynamicServices,
    getMasterProfile,
    updateMasterProfile,
    addMasterService,
    updateMasterService,
    removeMasterService,
    rescheduleBooking,
    refundBooking,
    updateBookingStatus,
    getBookingById,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
