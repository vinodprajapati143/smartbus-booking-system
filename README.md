# SmartBus Booking System 🚌

A modern, high-performance bus ticket booking application designed for Bus Conductors. Built with **Angular 21**, **Tailwind CSS**, and **Angular Signals**.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v10.0.0 or higher)

### Installation
1. Clone the repository or extract the files.
2. Open your terminal in the project directory: `d:/SmartBus Booking System/smartbus-booking-system/`
3. Install dependencies:
   ```bash
   npm install
   ```

### Execution
Run the development server:
```bash
npm run start
```
The application will be available at `http://localhost:4200/`.

---

## ✨ Features

### 1. Advanced Seating Layout
- 2x2 Seating Arrangement with 15 Rows (Total 60 seats).
- Real-time availability tracking.
- Interactive seat selection with a 6-seat limit per mobile number per day.

### 2. Optimal Boarding Algorithm 🧠
The system includes an algorithm that calculates the most efficient sequence for boarding to minimize passenger delays.

**The Problem:** If a passenger at the front (Row 1) boards first, they block the aisle (taking ~60s to settle), preventing passengers for Row 15 from reaching their seats.

**Our Solution:** The application automatically sorts the boarding list by the **farthest seat first**.
- **Sequence 1:** Passengers for Row 15 (Back of the bus)
- **Sequence 2:** Passengers for Row 14
- ...
- **Sequence N:** Passengers for Row 1 (Entry area)

This ensures that the aisle remains clear for people heading to the back, minimizing the total boarding time.

### 3. Boarding Tracking & Contact
- Filter list by travel date.
- One-click call button to contact registered mobile numbers.
- Boarding status toggle to track who has entered the bus.

---

## 🛠 Tech Stack
- **Framework:** Angular 21 (Standalone Components, Signals)
- **Styling:** Tailwind CSS (Modern, Responsive Design)
- **State Management:** Angular Signals with `localStorage` persistence.
- **SSR Support:** Server-Side Rendering enabled via `@angular/ssr`.

## 📝 Assumptions & Logic
- **Boarding Point:** Front gate (Row 1).
- **Group Boarding:** If multiple seats are booked under one ID, they board together as a group.
- **Blocking Mechanism:** A passenger settling in Row N blocks Rows > N. Sorting by Row Descending eliminates this block.
