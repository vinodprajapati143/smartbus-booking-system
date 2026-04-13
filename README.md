# SmartBus - Conductor Booking & Boarding System

A modern, reactive bus ticket management application built with **Angular 21** and **Tailwind CSS**. Designed specifically for bus conductors to manage seat availability, passenger bookings, and optimized boarding sequences.

## Key Features

- **Dynamic Seating Management**: Interactive 2x2 seating layout (60 seats) with real-time availability tracking.
- **Optimized Boarding Queue**: Backend logic that calculates boarding sequences based on seat position (back-to-front) to minimize aisle congestion and entry delays.
- **Booking Constraints**: Built-in validation to enforce a maximum of 6 seats per mobile number per travel date.
- **Boarding Tracking**: dedicated interface for conductors to track passenger check-ins and one-click contact functionality via system-level dialer integration.
- **State Persistence**: utilizes browser LocalStorage for reliable data persistence across sessions without a complex backend dependency for this MVP.

## Technology Stack

- **Core Framework**: Angular 21 (Stand-alone components)
- **State Management**: Angular Signals (Reactive State)
- **Styling**: Tailwind CSS (Utility-first responsive design)
- **Rendering**: @angular/ssr (Server-Side Rendering)
- **Data Handling**: JSON-based persistence in LocalStorage

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v10.0.0 or higher)

### Installation

1. Clone the repository or download the source files.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm start
```
The application will be accessible at `http://localhost:4200/`.

## Architecture & Logic

### Boarding Sequence Algorithm
To maximize efficiency, the system sorts the daily booking list by seat proximity to the rear of the bus. This ensures that passengers seated in the back board first, preventing them from being blocked by passengers still settling into front-row seats.

### Validation Logic
The `BookingService` manages all state transitions and validates business rules, such as the seat limit per mobile number, ensuring data integrity before persistence.
