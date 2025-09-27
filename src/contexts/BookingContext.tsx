'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Booking {
  id: string;
  masterId: string;
  masterName: string;
  masterSpecialization: string;
  masterAddress: string;
  masterPhone: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  services: string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
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

interface BookingContextType {
  bookings: Booking[];
  masterProfiles: MasterProfile[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingsByMaster: (masterId: string) => Booking[];
  getBookingsByClient: (clientId: string) => Booking[];
  isTimeSlotBooked: (masterId: string, date: string, time: string) => boolean;
  getMasterProfile: (masterId: string) => MasterProfile | undefined;
  updateMasterProfile: (masterId: string, profile: Partial<MasterProfile>) => void;
  addMasterService: (masterId: string, service: Omit<MasterService, 'id'>) => void;
  updateMasterService: (masterId: string, serviceId: string, service: Partial<MasterService>) => void;
  removeMasterService: (masterId: string, serviceId: string) => void;
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

  const value = {
    bookings,
    masterProfiles,
    addBooking,
    cancelBooking,
    getBookingsByMaster,
    getBookingsByClient,
    isTimeSlotBooked,
    getMasterProfile,
    updateMasterProfile,
    addMasterService,
    updateMasterService,
    removeMasterService,
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
