# 🔴 WebRTC Screen Sharing with Audio (Multi-User)

# Two setups: one for sharing screen and one for video metting

## 1 . A real-time screen sharing web app using **WebRTC** and **Socket.IO**, supporting:

- ✅ One sharer (screen + system audio)
- ✅ Multiple viewers (watching the stream)
- ✅ Join/leave notifications
- ✅ Prevent accidental refresh/disconnect
- ✅ Responsive UI with video scaling
- ✅ Optional sharer-only warning before unload

---

## 🚀 Features

- Screen + audio sharing (system/tab audio)
- Peer-to-peer (P2P) WebRTC connections
- Socket.IO used for signaling
- Only one active sharer at a time
- Auto-notifies viewers when sharer joins or leaves
- Responsive video layout
- Custom `beforeunload` warning for sharer
- Buttons to start/cancel sharing

---
## 2. A real-time video meeting web app using **WebRTC** and **Socket.IO**, supporting:
- 🔗 One-to-one video calls
- 🔊 Real-time peer-to-peer communication
- 📡 Socket.IO for signaling between users

---

## 🚀 Features

- ✅ Peer-to-peer (P2P) WebRTC video/audio
- ✅ Lightweight and fast
- ✅ Room-based architecture
- ✅ STUN server support for NAT traversal
- 🔒 Secure over localhost (HTTP) — can be secured with HTTPS in prod

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/screen-share-app.git
   cd screen-share-app

2. **Install dependencies**
   ```bash
   # For sharing screen only
   cd share_screen
   npm install

   # For video stream only
   cd video_stream
   npm install
   npm install mkcert -g #for https setup
   mkcert create-ca
   mkcert create-cert
  
3. **Start server**
   ```bash
   npm start
   #go to http://localhost:3000 or https://localhost:3000
   ```

