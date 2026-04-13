import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Booking, Seat } from '../models/models';
import { BUS_CONFIG } from '../core/constants';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private platformId = inject(PLATFORM_ID);
  
  // Reactive state management using Signals
  bookings = signal<Booking[]>([]);
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.bookings.set(this.getStoredBookings());

      // Persist state to local storage on change
      effect(() => {
        localStorage.setItem(BUS_CONFIG.STORAGE_KEY, JSON.stringify(this.bookings()));
      });
    }
  }

  private getStoredBookings(): Booking[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const saved = localStorage.getItem(BUS_CONFIG.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse storage data:', e);
      return [];
    }
  }

  /**
   * Generates the initial seating grid based on configuration
   */
  getInitialSeatingLayout(date: string): Seat[] {
    const layout: Seat[] = [];
    
    const bookedSeats = this.bookings()
      .filter(b => b.travelDate === date)
      .flatMap(b => b.seats);

    for (let row = 1; row <= BUS_CONFIG.ROWS; row++) {
      for (const col of BUS_CONFIG.COLUMNS) {
        const id = `${col}${row}`;
        layout.push({
          id,
          row,
          col,
          isBooked: bookedSeats.includes(id)
        });
      }
    }
    return layout;
  }

  /**
   * Validates if a user can book more seats based on daily limits
   */
  canBook(mobile: string, date: string, seatCount: number): boolean {
    const existingCount = this.bookings()
      .filter(b => b.mobileNumber === mobile && b.travelDate === date)
      .reduce((sum, b) => sum + b.seats.length, 0);
    
    return (existingCount + seatCount) <= BUS_CONFIG.MAX_SEATS_PER_USER;
  }

  createBooking(mobile: string, date: string, selectedSeats: string[]): Booking {
    if (!this.canBook(mobile, date, selectedSeats.length)) {
      throw new Error(`Maximum of ${BUS_CONFIG.MAX_SEATS_PER_USER} seats per mobile number exceeded for this date.`);
    }

    const newBooking: Booking = {
      id: `SB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      travelDate: date,
      mobileNumber: mobile,
      seats: [ ...selectedSeats ],
      isBoarded: false
    };

    this.bookings.update(prev => [...prev, newBooking]);
    return newBooking;
  }

  /**
   * Sorts bookings by seat position for efficient passenger boarding
   * Returns a list with assigned sequence numbers (back-to-front)
   */
  getBoardingSequence(date: string): Booking[] {
    const dailyBookings = this.bookings().filter(b => b.travelDate === date);
    
    return dailyBookings
      .slice()
      .sort((a, b) => {
        const rowA = this.getFarthestRow(a);
        const rowB = this.getFarthestRow(b);
        return rowB - rowA; // Descending row order
      })
      .map((booking, index) => ({
        ...booking,
        sequenceNumber: index + 1
      }));
  }

  private getFarthestRow(booking: Booking): number {
    const rows = booking.seats.map(id => parseInt(id.replace(/^\D+/g, ''), 10));
    return Math.max(...rows);
  }

  toggleBoardingStatus(bookingId: string) {
    this.bookings.update(all => 
      all.map(b => b.id === bookingId ? { ...b, isBoarded: !b.isBoarded } : b)
    );
  }
}
