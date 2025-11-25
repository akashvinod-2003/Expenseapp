💸 Expense Vibe

Expense Vibe is a secure and private expense tracker built for families and friends.
It uses a “Private Data, Shared Categories” model — ensuring personal financial data stays personal while shared categories remain consistent across the group.

Built as a Progressive Web App (PWA), Expense Vibe can be installed directly on Android, iOS, Windows and used like a native app.

🌟 Features

🔒 Private by Default

Users can only view and edit their own expenses

No financial data is ever shared between users

🌍 Shared Global Categories

Admin maintains a unified list of categories (Food, Travel, etc.)

🛡️ Admin Approval System

New users require Admin approval

Users can request new categories — Admin controls creation

☁️ Real-time Sync with Firebase

All changes update instantly across devices

🎨 Neo-Glass Dark Mode UI

Glassmorphism styling

Built with pure CSS — no Tailwind

🔧 Powerful Admin Tools

Merge duplicate categories

Fix broken category references

Recover legacy shared expenses

📂 Project Structure
File	Purpose
index.html	Main app container
styles.css	Dark mode styling, animations, glassmorphism
app.js	React app + Firebase connection + Admin tools
manifest.json	PWA installation settings
🚀 Setup Guide
1️⃣ Requirements

A Firebase account (free)

2️⃣ Firebase Setup

Inside Firebase Console:

Create new Firebase Project

Enable Authentication:

Google Login

Email/Password Login

Enable Firestore (Test Mode for now)

Copy your Firebase Web Config

3️⃣ App Configuration

In app.js, replace:

const firebaseConfig = {
  // Your Firebase keys here
};

const ADMIN_EMAILS = ["your.email@gmail.com"];

4️⃣ Firestore Security Rules (IMPORTANT)

Go to:
Firestore → Rules → Replace everything:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { 
      return request.auth != null; 
    }

    function isAdmin() { 
      return request.auth.token.email.lower() == "your.email@gmail.com"; 
    }

    // Shared Categories
    match /categories/{docId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // Category Requests
    match /category_requests/{docId} {
      allow create: if isSignedIn();
      allow read, delete: if isAdmin();
    }

    // Private Expenses (Only owner)
    match /users/{userId}/{document=**} {
      allow read, write: if isSignedIn() && request.auth.uid == userId;
    }

    // User metadata (Approval)
    match /user_meta/{userId} {
      allow read, write: if isSignedIn();
    }

    // Legacy Recovery Only
    match /family_expenses/{docId} {
      allow read: if isSignedIn();
      allow delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}

📱 Install as App (PWA)

📌 Android (Chrome)
Menu (⋮) → Install App / Add to Home Screen

📌 iOS (Safari)
Share → Add to Home Screen

📌 Windows / Mac (Chrome)
Click the Install Icon in the URL bar

🧩 Tech Stack

React (Single Page App)

Firebase Authentication + Firestore

Progressive Web App (PWA)

Pure CSS / Glass UI Design

🛡 License

MIT License — Free for personal & commercial use.

💙 Built for privacy. Designed for simplicity.
