export interface Seat {
  id: string; // e.g., "A1", "B15"
  row: number; // 1 to 15
  col: string; // A, B, C, D
  isBooked: boolean;
  isTempSelected?: boolean;
}

export interface Booking {
  id: string;
  travelDate: string;
  mobileNumber: string;
  seats: string[]; // List of seat IDs
  isBoarded: boolean;
  sequenceNumber?: number;
}
