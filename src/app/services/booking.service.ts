import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Booking, Seat } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly STORAGE_KEY = 'smartbus_bookings';
  private platformId = inject(PLATFORM_ID);
  
  // State using Signals
  bookings = signal<Booking[]>([]);
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load initial data only in browser
      this.bookings.set(this.loadBookings());

      // Sync state to localStorage whenever it changes
      effect(() => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.bookings()));
      });
    }
  }

  private loadBookings(): Booking[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Generates a 15-row, 2x2 layout
   */
  getInitialSeatingLayout(date: string): Seat[] {
    const layout: Seat[] = [];
    const columns = ['A', 'B', 'C', 'D'];
    
    // Get already booked seats for this date
    const bookedSeats = this.bookings()
      .filter(b => b.travelDate === date)
      .flatMap(b => b.seats);

    for (let row = 1; row <= 15; row++) {
      for (const col of columns) {
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
   * Constraint: Max 6 seats per mobile per day
   */
  canBook(mobile: string, date: string, seatCount: number): boolean {
    const existingCount = this.bookings()
      .filter(b => b.mobileNumber === mobile && b.travelDate === date)
      .reduce((sum, b) => sum + b.seats.length, 0);
    
    return (existingCount + seatCount) <= 6;
  }

  createBooking(mobile: string, date: string, selectedSeats: string[]): Booking {
    if (!this.canBook(mobile, date, selectedSeats.length)) {
      throw new Error('Maximum 6 seats per mobile number per day exceeded.');
    }

    const newBooking: Booking = {
      id: 'SB-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      travelDate: date,
      mobileNumber: mobile,
      seats: selectedSeats,
      isBoarded: false
    };

    this.bookings.update(prev => [...prev, newBooking]);
    return newBooking;
  }

  /**
   * Optimal Boarding Algorithm
   * Minimizes blocking by ordering farthest seats first.
   * If a booking has multiple seats, we consider the maximum row (farthest) 
   * to determine its sequence.
   */
  getOptimalBoardingList(date: string): Booking[] {
    const dailyBookings = this.bookings().filter(b => b.travelDate === date);
    
    return dailyBookings.sort((a, b) => {
      const maxRowA = this.getMaxRowForBooking(a);
      const maxRowB = this.getMaxRowForBooking(b);
      
      // Descending order of rows (Row 15 first, Row 1 last)
      return maxRowB - maxRowA;
    }).map((booking, index) => ({
      ...booking,
      sequenceNumber: index + 1
    }));
  }

  private getMaxRowForBooking(booking: Booking): number {
    // Seat ID is like "A15", extract numbers
    const rows = booking.seats.map(id => parseInt(id.substring(1), 10));
    return Math.max(...rows);
  }

  toggleBoarded(bookingId: string) {
    this.bookings.update(all => 
      all.map(b => b.id === bookingId ? { ...b, isBoarded: !b.isBoarded } : b)
    );
  }
}
