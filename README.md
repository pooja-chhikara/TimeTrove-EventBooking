🚀 Setup & Installation
1️⃣ Clone the Repository

git clone (https://github.com/pooja-chhikara/TimeTrove-EventBooking.git)
cd time-trove

2️⃣ Install Dependencies

npm install
3️⃣ Firebase Setup
Go to Firebase Console
Create a new Firebase Project
Enable Authentication (Email & Password)
Set up Realtime Database
Get Firebase Config Keys
Replace in src/firebase.js

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
};
const app = initializeApp(firebaseConfig);
export default app;

4️⃣ Run the Project

npm start
App runs on: http://localhost:3000/

📜 Firebase Database Structure


{
  "users": {
    "user1_id": {
      "email": "user1@gmail.com",
      "bookedSlots": {
        "2025-01-31": {
          "Skillset": { "09:00": true },
          "Musical": { "10:00": true }
        }
      }
    }
  }
}
👨‍💻 Usage
User:
Signup/Login as a User
Select a Category (Skillset, Musical, Tournament)
Click on Available Slot to Book
Click on Booked Slot to Cancel
View all booked slots in Weekly/Daily View
Admin:
Login as Admin (admin@gmail.com)
Select a User from dropdown
View Bookings in Day-wise Calendar
Book/Cancel Slots for users
View User-wise Booking Reports
🌍 Deployment (Firebase Hosting)


1️⃣ Install Firebase CLI

npm install -g firebase-tools

2️⃣ Login to Firebase

firebase login

3️⃣ Initialize Firebase Project

firebase init
Select Hosting
Choose your Firebase Project
Set build/ as the public directory



4️⃣ Build & Deploy

npm run build
firebase deploy
🤝 Contribution
Want to improve TimeTrove? Feel free to:

Open an Issue 🛠
Submit a Pull Request 🚀
