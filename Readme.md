Expense Vibe 💸Expense Vibe is a secure, private expense tracker built for families and friends. It uses a "Private Data, Shared Categories" model, ensuring that financial data remains personal while keeping expense categorization consistent across the group.It is built as a Progressive Web App (PWA), meaning it can be installed on Android, iOS, and Windows directly from the browser.🌟 Key Features🔒 Private by Default: Users can only see and edit their own expenses. Data is never shared between users.🌍 Global Categories: A shared list of categories (e.g., "Food", "Transport") managed by the Admin.🛡️ Admin Approval Workflow:New users must be approved by the Admin before accessing the app.Users can request new categories, but only the Admin can create them.☁️ Real-time Sync: Powered by Google Firebase for instant data updates.🎨 Neo-Glass Design: A premium dark-mode UI with glassmorphism effects, built with pure CSS (no Tailwind dependency).🔧 Admin Tools: Built-in tools to merge duplicate categories, fix broken links, and recover legacy shared data.📂 Project Structureindex.html - The main entry point and structure.styles.css - Contains all styling, animations, and glassmorphism effects.app.js - Contains the React application logic, Firebase connection, and Admin Panel.manifest.json - PWA configuration for installing on mobile devices.🚀 Setup Guide1. PrerequisitesYou need a free Google Firebase account.2. Firebase ConfigurationCreate a new project in the Firebase Console.Authentication: Enable Google and Email/Password providers.Firestore Database: Create a database in "Test Mode" (we will lock it down later).Get Config: Go to Project Settings -> General -> Your Apps -> Web </>. Copy the firebaseConfig object.3. Code ConfigurationOpen app.js.Replace the firebaseConfig object with your own keys.Update ADMIN_EMAILS with your Google email address to grant yourself Admin access.const ADMIN_EMAILS = ["your.email@gmail.com"];
4. Deploy Security Rules (CRITICAL)To ensure privacy and security, you must copy the following rules into your Firebase Console -> Firestore Database -> Rules tab:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() { return request.auth != null; }
    
    // Replace with your exact admin email
    function isAdmin() { 
      return request.auth.token.email.lower() == "your.email@gmail.com"; 
    }

    // 1. GLOBAL CATEGORIES
    // Everyone reads. Only Admin writes.
    match /categories/{docId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // 2. CATEGORY REQUESTS
    // Anyone creates requests. Admin manages them.
    match /category_requests/{docId} {
      allow create: if isSignedIn();
      allow read, delete: if isAdmin();
    }

    // 3. PRIVATE EXPENSES (Owner Only)
    match /users/{userId}/{document=**} {
      allow read, write: if isSignedIn() && request.auth.uid == userId;
    }
    
    // 4. USER PROFILES (For Admin Panel)
    match /user_meta/{userId} {
      allow read, write: if isSignedIn();
    }
    
    // 5. RECOVERY (Legacy Shared Data)
    match /family_expenses/{docId} {
      allow read: if isSignedIn();
      allow delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}
📱 How to Install (PWA)Android (Chrome):Open the website.Tap the three dots (⋮) in the top right.Tap "Install App" or "Add to Home Screen".iOS (Safari):Open the website.Tap the "Share" button (square with arrow).Scroll down and tap "Add to Home Screen".Windows/Mac (Chrome):Click the "Install" icon on the right side of the address bar.