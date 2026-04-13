export interface Seat {
  id: string;
  row: number;
  col: string;
  isBooked: boolean;
  isTempSelected?: boolean;
}

export interface Booking {
  id: string;
  travelDate: string;
  mobileNumber: string;
  seats: string[];
  isBoarded: boolean;
  sequenceNumber?: number;
}
