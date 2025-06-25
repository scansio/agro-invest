# booking.ng

**booking.ng** is a comprehensive travel and logistics booking platform that allows users to book hotels, flights, and logistics services. It integrates third-party APIs for hotel and flight bookings while enabling hotels to list their properties manually.

## Features

### 🏨 Hotel Booking

- **Third-Party API Integration**: Retrieve hotel listings from external platforms in real-time.
- **Manual Listings**: Hotels can register and manage their properties directly on the platform.
- **Advanced Search & Filters**: Search by location, price, amenities, and ratings.

### ✈️ Flight Booking

- **Flight Search via APIs**: Fetch real-time flight data using third-party APIs.
- **Price Comparison**: Compare flight prices across different airlines.
- **Flexible Booking Options**: Supports one-way, round-trip, and multi-city bookings.

### 🚚 Logistics & Transport

- **On-Demand Services**: Schedule transportation and package delivery.
- **Package Tracking**: Real-time status tracking for logistics operations.
- **Custom Delivery Options**: Support for various package sizes and delivery types.

### 🏨 Hotel Self-Listing

- **Hotel Dashboard**: Hotels can register, manage rooms, set prices, and track bookings.
- **Approval Workflow**: Manually listed hotels require admin approval before publication.
- **Booking Management**: Full-featured booking management for hotel partners.

### 💰 Payment System

- **Wallet System**: Users can deposit funds into their booking.ng wallet.
- **Paystack Integration**: Supports NGN payments via cards, bank transfers, and USSD.
- **Binance Pay Integration**: Accepts crypto payments via Binance Pay, supporting multiple cryptocurrencies.

---

## Binance Pay Integration

**Supported Features:**

- Users can deposit cryptocurrency through **Binance Pay**.
- Supports various currencies (e.g., USDT, BUSD, BTC).
- Instant wallet credit after successful transaction verification.

### Binance Pay Setup:

1. **Create Binance Pay Account**:

   - Sign up at [Binance Pay](https://www.binance.com/en/pay).
   - Complete the merchant onboarding process to get access to the API.

2. **Generate Binance Pay API Credentials**:

   - Obtain the following keys from the Binance Pay dashboard:
     - `BINANCE_API_KEY`
     - `BINANCE_SECRET_KEY`

3. **Environment Variables Configuration**:  
   Add the following to your `.env` file:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FLIGHT_API_KEY=your_flight_api_key
HOTEL_API_KEY=your_hotel_api_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret_key
BINANCE_ENV=sandbox_or_live
```

### Binance Pay Flow:

1. User initiates a crypto deposit request.
2. The system generates a Binance Pay order and QR code.
3. Binance Pay webhook confirms payment.
4. User’s wallet is credited upon successful payment.

---

## Project Structure

```
booking.ng/
├── backend/                  # Node.js + Express.js server
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes (Hotels, Flights, Logistics, Payments)
│   ├── controllers/          # Business logic
│   └── app.js                # Main server entry point
└── frontend/                 # ReblendJS application
    ├── components/           # UI components
    ├── pages/                # Page-level views
    └── index.js              # Main app entry point
```

---

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud instance)
- Binance Pay Merchant Account

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/booking.ng.git
   cd booking.ng
   ```

2. Install dependencies:

   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

3. Set up environment variables (`.env` file in backend):  
   Ensure Binance Pay credentials are set correctly.

4. Run the application:

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd ../frontend && npm run dev
```

The platform will be available at:

- **Frontend**: `http://localhost:3000`
- **API**: `http://localhost:5000`

---

## API Overview

### Users

- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login

### Hotels

- `GET /api/hotels` – Fetch available hotels
- `POST /api/hotels` – Create a new hotel (for hotel partners)

### Flights

- `GET /api/flights` – Search flights via third-party APIs

### Logistics

- `POST /api/logistics` – Schedule delivery service
- `GET /api/logistics/:id` – Track delivery status

### Payments

- `POST /api/payments/deposit` – Deposit to wallet (via Paystack or Binance Pay).
- `GET /api/payments/wallet` – Check wallet balance.
- `POST /api/payments/book` – Pay for bookings using wallet balance.

---

## Future Roadmap

- ✅ Implement hotel and flight search with caching for performance
- ✅ Build a full-featured hotel partner dashboard
- ✅ Add Paystack and Binance Pay integration for Nigerian users
- 🔲 AI-driven dynamic pricing and recommendations
- 🔲 Mobile app support (via ReblendJS adaptation)

---

## License

[MIT License](LICENSE)
