import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.scss'
})
export class BookingListComponent {
  private bookingService = inject(BookingService);

  filterDate = signal<string>(new Date().toISOString().split('T')[0]);
  
  // Sorted list using the Optimal Boarding Algorithm
  optimalBookings = computed(() => {
    return this.bookingService.getOptimalBoardingList(this.filterDate());
  });

  onToggleBoarded(bookingId: string) {
    this.bookingService.toggleBoarded(bookingId);
  }

  initiateCall(mobile: string) {
    // In a real app, this would use window.location.href = 'tel:' + mobile;
    console.log('Calling...', mobile);
    alert('Initiating call to ' + mobile);
  }
}
