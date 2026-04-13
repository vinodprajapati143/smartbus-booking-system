import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';

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
  activeCallMobile = signal<string | null>(null);
  
  boardingSequence = computed(() => {
    return this.bookingService.getBoardingSequence(this.filterDate());
  });

  onToggleBoardingStatus(bookingId: string) {
    this.bookingService.toggleBoardingStatus(bookingId);
  }

  initiateCall(mobile: string) {
    this.activeCallMobile.set(mobile);
  }

  cancelCall() {
    this.activeCallMobile.set(null);
  }

  confirmAndCall(mobile: string) {
    window.location.href = `tel:${mobile}`;
    this.cancelCall();
  }
}
