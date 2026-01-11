# SportsConnect 🏟️

**SportsConnect** is a modern web application designed to help sports enthusiasts find partners, manage their profiles, and schedule playtimes effortlessly.

## 🚀 Features

### 🔐 Secure Authentication (Email OTP)
- **Signup/Login**: Simple and secure access using Email OTP.
- **Verification**: 6-digit simulated OTP flow for instant verification.
- **User Session**: Persistent login state handling.

### 👤 Profile Management
- **Customizable Profile**: Edit your name, username, and bio.
- **Avatar Selection**: Choose from a set of sports-themed avatars.
- **Sports Preferences**: Select your favorite sports (Badminton, Cricket, Football, etc.) to find like-minded players.
- **Availability**: Set your availability status (Available/Busy) and specific **Preferred Times** (e.g., "6 PM - 9 PM").

### 📍 Interactive Location Picker
- **Map Integration**: Built with **Leaflet** and **OpenStreetMap**.
- **Pick on Map**: Click anywhere to set your location.
- **"Locate Me"**: One-click geolocation to find your current spot instantly.
- **Reverse Geocoding**: Automatically converts coordinates into a readable address.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Vanilla CSS (Variables, Flexbox/Grid) & CSS Modules
- **Maps**: React-Leaflet & Leaflet
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (AuthContext, ToastContext)

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ajaydheenadhayalan/SportsConnect.git
    cd SportsConnect
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📱 Usage

1.  **Sign Up**: Create an account using your email. The system simulates an OTP (check the green toast notification).
2.  **Edit Profile**: Go to the Dashboard and click the "Edit" icon.
3.  **Set Location**: Use the Globe icon to pick your location on the map.
4.  **Save & Explore**: Update your details and see your personalized Profile Card.

---
*Built with ❤️ for sports lovers.*
