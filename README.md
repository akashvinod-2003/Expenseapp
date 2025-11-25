Expense Vibe 💸Expense Vibe is a modern, secure, and private expense tracker. Built with a "Mobile-First" philosophy, it works seamlessly as a Progressive Web App (PWA) on Android, iOS, and Desktop.ShutterstockExplore🌟 Key Features🔒 Private by Default: Each user has their own encrypted expense list. No one else can see your spending.🌍 Global Categories: Shared category list (e.g., "Groceries", "Rent") that keeps everyone organized.🛡️ Admin Approval System: New users must be approved by the Admin before accessing the app. New category additions also require Admin approval.☁️ Real-time Sync: Data syncs instantly across all your devices using Google Firebase.📱 Installable PWA: install it directly to your home screen—no App Store required.🛠️ Recovery Tools: Built-in tools to fix broken category links or migrate legacy shared data.🚀 Quick StartPrerequisitesYou need a free Google Firebase account.InstallationClone the repo:git clone [https://github.com/yourusername/expense-vibe.git](https://github.com/yourusername/expense-vibe.git)
cd expense-vibe
Configure Firebase:Create a project in Firebase Console.Enable Authentication (Google & Email/Password).Enable Firestore Database.Copy your web config keys into app.js (replace the existing firebaseConfig).Set Admin Email:Open app.js and find const ADMIN_EMAILS.Replace the email with your own Google email address.Run Locally:Open index.html using a local server (e.g., Live Server in VS Code).🔐 Security RulesTo ensure privacy, deploy these Firestore Security Rules in your Firebase Console:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return request.auth.token.email.lower() == "YOUR_ADMIN_EMAIL"; }

    // Private User Data
    match /users/{userId}/{document=**} {
      allow read, write: if isSignedIn() && request.auth.uid == userId;
    }

    // Global Categories (Read All, Write Admin)
    match /categories/{docId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Category Requests
    match /category_requests/{docId} {
      allow create: if isSignedIn();
      allow read, delete: if isAdmin();
    }

    // User Meta (For Admin Panel)
    match /user_meta/{userId} {
      allow read, write: if isSignedIn();
    }
  }
}
📦 Tech StackFrontend: React (via CDN), Vanilla CSS (Glassmorphism Design)Backend: Firebase (Auth, Firestore)Styling: Custom CSS + Tailwind (via CDN for layout utilities)Icons: Inline SVGs (No external icon library dependencies)📱 How to Install Open the website link on your phone.Android (Chrome): Tap the three dots (⋮) -> "Install App" or "Add to Home Screen".iOS (Safari): Tap the Share button -> "Add to Home Screen".
