# Project Sync: Cross-Platform Synchronization Ecosystem

Project Sync is a Production-Grade personal cloud ecosystem for seamless file, clipboard, and data synchronization between Mobile and Desktop devices.

## 🚀 Features
- **Real-time Synchronization:** Clipboard and screenshots appear instantly on linked devices.
- **P2P File Transfer:** Direct device-to-device transfer for large files via WebRTC.
- **Secure Pairing:** QR-based device linking with temporary tokens.
- **E2EE:** End-to-end encrypted data transfers.
- **Multi-platform:** Flutter (Mobile) and Electron (Desktop).

## 🛠️ Project Structure
- `/backend`: Node.js, Express, Socket.IO, MongoDB, TypeScript.
- `/desktop`: Electron, React, Vite, TailwindCSS (Vanilla CSS used), TypeScript.
- `/mobile`: Flutter (Dart).

## 🔨 Setup Instructions

### 1. Backend
```bash
cd backend
npm install
# Ensure MongoDB is running locally or via Docker
npm run dev
```

### 2. Desktop
```bash
cd desktop
npm install
npm run dev
```

### 3. Mobile
```bash
cd mobile
flutter pub get
flutter run
```

### 🐳 Docker Deployment (Backend & DB)
```bash
docker-compose up --build
```

## 🔐 Environment Variables
### Backend (.env)
- `PORT`: 5000
- `MONGO_URI`: mongodb://localhost:27017/project-sync
- `JWT_SECRET`: your_secret_key

## 🤝 Contribution
Follow the scalable project architecture and clean code principles outlined in the TRD.
