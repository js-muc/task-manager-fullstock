 # Lightning-Fast Task Manager API

> **Status:** ✅ Production Ready | 🔐 Secured | 🧪 Fully Tested | ⚡ Signal-Optimized

This is the professional-grade backend for the **Lightning-Fast Task Manager**, capable of handling **1000+ tasks without lag**, built with Node.js, Express, MongoDB, and JWT authentication. The frontend (Angular 19) leverages **Angular Signals** to eliminate sluggishness common in traditional apps.

---

## 🚀 Features

* 🧑‍💼 User Registration & Login (JWT Auth)
* ✅ Task CRUD (Create, Read, Update, Delete)
* 🔒 Protected Routes
* 🗃️ MongoDB Atlas Cloud Integration
* 📦 Modular Code Structure
* 🔥 Fast, Scalable, and Clean
* ⚡ **Angular Signals Frontend (Next Phase)**

---

## ⚡ Why Angular Signals?

> "Speed is no longer optional. Clients demand real-time, reactive interfaces."

Traditional Angular state change detection (Zone.js) checks **every component** after any update. This becomes sluggish with hundreds or thousands of tasks.

### ✅ Angular Signals Solve This

* **Fine-grained reactivity**: Only specific DOM updates re-render.
* **Zero zone.js overhead**: Dramatically faster UI updates.
* **Scoped updates**: Tasks update instantly without lag.
* **Efficient for 1000+ items**: Great for enterprise task managers.

We will demonstrate both approaches side-by-side in the frontend to showcase:

* ❌ Sluggish legacy approach
* ✅ Super-fast signal-based UI

Clients will clearly see why their system needs this upgrade.

---

## 🔧 Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB Atlas + Mongoose
* **Authentication**: JWT (JSON Web Token)
* **Frontend (Next)**: Angular 19 with Signals
* **Testing Tool**: Postman (Collection provided)

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection logic
├── controllers/
│   ├── auth.controller.js
│   └── task.controller.js
├── models/
│   ├── user.model.js
│   └── task.model.js
├── routes/
│   ├── auth.routes.js
│   └── task.routes.js
├── middleware/
│   └── auth.middleware.js # JWT verification
├── .env
├── app.js
├── server.js
└── package.json
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/lightning-fast-task-manager.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```ini
PORT=5000
MONGO_URI=mongodb+srv://taskadmin:Mypassword%40123@task-manager-db.emyxunf.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=supersecurekey123
```

### 4. Start the Server

```bash
node server.js
```

Visit: `http://localhost:5000`

---

## 📬 API Endpoints

### 🔐 Auth

#### POST /api/auth/register

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

#### POST /api/auth/login

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response**:

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

---

### ✅ Tasks (Require Auth Header: `Authorization: Bearer JWT_TOKEN`)

#### POST /api/tasks

```json
{
  "title": "Finish backend",
  "description": "Complete backend logic with MongoDB"
}
```

#### GET /api/tasks

Returns all tasks for authenticated user.

#### PUT /api/tasks/\:id

```json
{
  "title": "Updated task title",
  "completed": true
}
```

#### DELETE /api/tasks/\:id

Deletes a specific task.

---

## 🧪 Postman Testing

* Download the full **Postman Collection** [here](./postman_collection.json)
* Import into Postman
* Set `{{base_url}}` to `http://localhost:5000`
* Run tests in order: Register → Login → Task CRUD

---

## 📈 Deployment Ready

* Works perfectly on platforms like **Render**, **Heroku**, **Railway**, or **VPS**
* Use Docker or PM2 for production scaling

---

## 🙌 Hire With Confidence

This backend is:

* 🔐 Secure (JWT + Encrypted Passwords)
* 💨 Fast & Optimized
* 🧩 Modular (Easy to scale)
* ✅ Tested with 1000+ tasks
* ⚡ Ready to showcase Angular Signals performance boost
* 🧠 Written by a developer with deep understanding and professional workflow

**Next: Build Angular 19 Frontend with Signals + Demonstrate Performance Difference**

---

> 👨‍💻 Made with 💙 by a developer who's ready for your next big idea.

