import { Routes } from '@angular/router';
import { BookingComponent } from './components/booking/booking';
import { BookingListComponent } from './components/booking-list/booking-list';

export const routes: Routes = [
  { path: '', redirectTo: 'book', pathMatch: 'full' },
  { path: 'book', component: BookingComponent, title: 'Book Tickets | SmartBus' },
  { path: 'list', component: BookingListComponent, title: 'Boarding List | SmartBus' },
  { path: '**', redirectTo: 'book' }
];
