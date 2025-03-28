# 🛠 Ride-Sharing App (Backend)  

A **MERN stack** ride-sharing backend with **JWT authentication, WebSockets, and Google Maps API** for real-time ride tracking.  

---

## ⚡ Getting Started  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/your-username/your-backend-repo.git
cd your-backend-repo
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Setup Environment Variables  
Create a `.env` file in the root directory and add the following:  

```sh
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```
🔹 **Replace values with actual credentials.**  
🔹 **Never share your API keys publicly!**  

---

## 🚀 Run the Server  
Start the backend with:  

```sh
npm start
```  
This will run the server on `http://localhost:5000/`.  

---

## 🌟 Features  
✅ **User Authentication** – JWT-based login/signup  
✅ **Role-Based Access** – Passengers & Drivers  
✅ **Ride Management** – Request & accept rides  
✅ **Google Maps Integration** – Route optimization  
✅ **Real-time Tracking** – WebSockets for live updates  
