import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Seat, Booking } from '../../models/models';
import { BUS_CONFIG } from '../../core/constants';

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
  activeBooking = signal<Booking | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.bookingForm.get('travelDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.initializeLayout(date);
        this.selectedSeats.set([]);
      }
    });
  }

  initializeLayout(date: string) {
    const flatSeats = this.bookingService.getInitialSeatingLayout(date);
    const rows: Seat[][] = [];
    const seatsPerRow = BUS_CONFIG.COLUMNS.length;

    for (let i = 0; i < BUS_CONFIG.ROWS; i++) {
      rows.push(flatSeats.slice(i * seatsPerRow, i * seatsPerRow + seatsPerRow));
    }
    this.seatsInRows.set(rows);
  }

  toggleSeatSelection(seat: Seat) {
    if (seat.isBooked) return;

    this.selectedSeats.update(selected => {
      if (selected.includes(seat.id)) {
        return selected.filter(s => s !== seat.id);
      } else {
        if (selected.length >= BUS_CONFIG.MAX_SEATS_PER_USER) {
          this.setTemporaryError(`Maximum of ${BUS_CONFIG.MAX_SEATS_PER_USER} seats can be selected per booking.`);
          return selected;
        }
        return [...selected, seat.id];
      }
    });
  }

  onConfirmBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const { travelDate, mobileNumber } = this.bookingForm.value;
    const selected = this.selectedSeats();

    if (selected.length === 0) {
      this.setTemporaryError('Please select at least one seat to proceed.');
      return;
    }

    try {
      const booking = this.bookingService.createBooking(
        mobileNumber!,
        travelDate!,
        selected
      );
      this.activeBooking.set(booking);
      this.selectedSeats.set([]);
      this.initializeLayout(travelDate!);
    } catch (e: any) {
      this.errorMessage.set(e.message);
    }
  }

  private setTemporaryError(message: string) {
    this.errorMessage.set(message);
    setTimeout(() => this.errorMessage.set(null), 3000);
  }

  resetWorkflow() {
    this.activeBooking.set(null);
    this.bookingForm.reset();
  }
}
