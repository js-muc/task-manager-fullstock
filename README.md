# ⚡ Lightning-Fast Task Manager (Angular Signals vs Zone.js)

A modern, full-featured task management app built with Angular 20 and Node.js. This project demonstrates how Angular's new **Signals-based reactivity** outperforms traditional **Zone.js change detection**, solving sluggish performance issues in large apps.

---

## 🔍 Why This Project Matters

This project compares:

| Legacy (Zone.js)                  | Signals (Optimized)                |
|----------------------------------|------------------------------------|
| Triggers full app-wide re-checks | Updates only where needed          |
| Slower with many UI updates      | Snappy and predictable             |
| Harder to debug performance      | Visual tools + control             |

---

## 🧩 Features

- ✅ Add, update, delete, filter, paginate tasks
- 🧠 Signal-powered component (for optimal performance)
- 🐢 Legacy view component (for comparison)
- 🌙 Dark mode toggle
- 🧪 Performance Profiler widget
- 💬 Snackbar notifications
- 🔍 Change detection counter
- 📱 Responsive design (mobile to desktop)
- 🚀 One-click seeding of 1000 tasks

---

## 💥 The Problem

Traditional Angular with Zone.js:
- Triggers too many change detections
- Causes performance issues with big task lists
- Reduces mobile battery life
- Slows down UI rendering

---

## ✅ The Solution: Angular Signals

By switching to Signals:
- DOM updates only happen when needed
- Lower memory pressure and CPU use
- App feels much smoother and faster
- Easier to debug reactivity using `ng.profiler`

---

## 🛠️ Tech Stack

| Layer           | Technology                        |
|----------------|------------------------------------|
| Frontend        | Angular 20                        |
| Styling/Layout  | Angular Material + SCSS           |
| State Mgmt      | Angular Signals, RxJS             |
| Forms           | Reactive Forms                    |
| Auth            | JWT-based login/register          |
| Backend         | Node.js + Express                 |
| Database        | MongoDB (Mongoose)                |
| Build Tool      | Angular CLI + Vite/Vercel         |

---

## 📁 Folder Structure

