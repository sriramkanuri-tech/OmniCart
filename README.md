# 🛒 OmniCart — The Everything App

> A full-stack multi-sector shopping platform built with React, Express.js, Firebase, and UroPay UPI payments.

🌐 **Live Website:** [https://omnicart-992111359826.us-west1.run.app](https://omnicart-992111359826.us-west1.run.app)

***

## 📖 Overview

OmniCart is a modern all-in-one e-commerce web application that allows users to shop across multiple product categories — from everyday groceries to electronics and more — all in one place. It integrates **UroPay UPI** for seamless Indian payment processing, **Firebase** for authentication and database, and an **Express.js** backend for order management and webhook handling.

***

## ✨ Features

- 🔐 **Firebase Authentication** — Secure login and signup with Google or email/password
- 🛍️ **Multi-Sector Shopping** — Browse and buy products across categories like Shopping, Grocery, Electronics, and more
- 💳 **UroPay UPI Payments** — Payments collected directly to `9948746315@fam` via UPI
- 📦 **Real-time Order Management** — Orders created as PENDING and updated to PLACED after payment confirmation
- 📬 **Email Confirmation** — Automatic order confirmation emails sent via Nodemailer + Gmail SMTP
- 🔔 **Webhook Integration** — UroPay webhook triggers backend order updates and merchant notifications
- 📋 **Purchase Ledger** — Users can view their complete order history with status and transaction IDs
- 👨‍💼 **Admin Dashboard** — Admin panel for managing products and monitoring orders
- 📱 **Responsive Design** — Fully mobile-friendly UI built with React and Tailwind CSS

***

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (JSX), Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Payments | UroPay UPI |
| Email | Nodemailer + Gmail SMTP |
| Hosting | Google Cloud Run |
| Version Control | GitHub |

***

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sriramkanuri-tech/OmniCart.git
cd OmniCart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (use `.env.example` as reference):

```env
# Gmail SMTP (for order confirmation emails)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_digit_app_password

# UroPay
UROPAY_MERCHANT_ID=your_uropay_merchant_id
UROPAY_API_KEY=your_uropay_api_key
MERCHANT_UPI=9948746315@fam

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend
PORT=3000
VITE_API_URL=http://localhost:3000
```

> 💡 **Gmail App Password:** Go to your Google Account → Security → 2-Step Verification → App Passwords → Generate a 16-character password and paste it in `EMAIL_PASS`.

### 4. Run the App

```bash
# Start backend server
node server.js

# In a separate terminal, start frontend
npm run dev
```

The app will be available at `http://localhost:5173`

***

## 💸 Payment Flow

```
User clicks Buy
     ↓
Backend creates PENDING order
     ↓
User redirected to UroPay UPI payment page
     ↓
User completes payment
     ↓
UroPay fires webhook → POST /api/webhook/uropay
     ↓
Backend updates order: PENDING → PLACED
     ↓
Confirmation email sent to user
     ↓
Merchant notified at 9948746315@fam
```

***

## 🔗 UroPay Webhook Setup

1. Log into your [UroPay Dashboard](https://uropay.in)
2. Go to **Webhooks** section
3. Add webhook URL:
   ```
   https://omnicart-992111359826.us-west1.run.app/api/webhook/uropay
   ```
4. Enable the webhook and set status to **Active**

***

## 📁 Project Structure

```
OmniCart/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level pages
│   ├── services/          # API service layer (api.js)
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Firebase config & utilities
├── routes/
│   ├── orders.js          # Order CRUD routes
│   └── webhook.js         # UroPay webhook route
├── controllers/
│   ├── orderController.js
│   └── webhookController.js
├── store/
│   └── orderStore.js      # In-memory order store (Map)
├── services/
│   └── emailService.js    # Nodemailer email sender
├── server.js              # Express app entry point
├── .env.example
├── package.json
└── README.md
```

***

## 📧 Email Configuration

This app uses **Gmail SMTP** via Nodemailer for sending order confirmation emails to customers.

To verify email setup is working, check for this log on server start:

```
✅ Email server is ready
```

If you see an error, re-check your `EMAIL_USER` and `EMAIL_PASS` values.

***

## 🌐 Live Demo

**Website:** [https://omnicart-992111359826.us-west1.run.app](https://omnicart-992111359826.us-west1.run.app)

***

## 👨‍💻 Author

**Sriram Kanuri**
GitHub: [@sriramkanuri-tech](https://github.com/sriramkanuri-tech)

***

## 📄 License

This project is licensed under the MIT License.
