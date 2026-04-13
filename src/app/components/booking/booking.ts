import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Seat, Booking } from '../../models/models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class BookingComponent {
  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);

  bookingForm = this.fb.group({
    travelDate: ['', Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  seatsInRows = signal<Seat[][]>([]);
  selectedSeats = signal<string[]>([]);
  confirmationBooking = signal<Booking | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Fill initial grid when date changes
    this.bookingForm.get('travelDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.loadLayout(date);
        this.selectedSeats.set([]);
      }
    });
  }

  loadLayout(date: string) {
    const flatSeats = this.bookingService.getInitialSeatingLayout(date);
    // Group into rows of 4
    const rows: Seat[][] = [];
    for (let i = 0; i < 15; i++) {
      rows.push(flatSeats.slice(i * 4, i * 4 + 4));
    }
    this.seatsInRows.set(rows);
  }

  toggleSeat(seat: Seat) {
    if (seat.isBooked) return;

    this.selectedSeats.update(selected => {
      if (selected.includes(seat.id)) {
        return selected.filter(s => s !== seat.id);
      } else {
        if (selected.length >= 6) {
          this.errorMessage.set('You can select a maximum of 6 seats.');
          setTimeout(() => this.errorMessage.set(null), 3000);
          return selected;
        }
        return [...selected, seat.id];
      }
    });
  }

  onBook() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const { travelDate, mobileNumber } = this.bookingForm.value;
    const selected = this.selectedSeats();

    if (selected.length === 0) {
      this.errorMessage.set('Please select at least one seat.');
      return;
    }

    try {
      const booking = this.bookingService.createBooking(
        mobileNumber!,
        travelDate!,
        selected
      );
      this.confirmationBooking.set(booking);
      this.selectedSeats.set([]);
      this.loadLayout(travelDate!);
    } catch (e: any) {
      this.errorMessage.set(e.message);
    }
  }

  closePopup() {
    this.confirmationBooking.set(null);
    this.bookingForm.reset();
  }
}
