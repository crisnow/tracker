# ☕ AI-Native Caffeine Tracker

An AI-powered full-stack caffeine tracking application built with **React (frontend)** and **FastAPI (backend)**.

This project demonstrates **end-to-end product ownership**, **AI-native architecture**, and **rapid iteration**, inspired by modern startup engineering culture.

---

## 🚀 Overview

The AI-Native Caffeine Tracker allows users to:

- Log caffeine consumption
- Track daily and weekly intake
- Visualize behavioral trends
- Receive AI-generated insights

The system is modular, scalable, and designed for future AI-driven personalization.

---

## 🏗 Architecture
React Frontend → FastAPI Backend → Database (SQLite/PostgreSQL)

↓
AI / ML Module


### **Frontend**
- React (functional components + hooks)
- Axios / Fetch API
- Chart.js or Recharts for visualizations

### **Backend**
- FastAPI (Python)
- Pydantic for request validation
- SQLAlchemy ORM
- SQLite (MVP) or PostgreSQL (production)

### **AI Layer**
- Python analytics module
- Pattern detection (overconsumption, timing trends)
- Optional LLM integration for personalized feedback

---

## ✨ Core Features

### **1️⃣ Drink Logging**
- Record drink type
- Track caffeine amount (mg)
- Store timestamp
- Backend validation with FastAPI

### **2️⃣ Consumption History**
- Retrieve all drinks
- Filter by date
- Clean tabular display

### **3️⃣ Daily & Weekly Summary**
- Automatic aggregation
- Weekly trend analysis
- Comparison against recommended limit (400mg/day)

### **4️⃣ AI-Powered Insights**
- Detect late-day caffeine patterns
- Identify excessive intake trends
- Generate personalized behavioral suggestions

Example:

> "You consistently consume caffeine after 4pm. Consider reducing intake to improve sleep quality."

---

## 📡 API Endpoints

### `POST /drinks`
Create a new drink entry.

### `GET /drinks`
Retrieve all logged drinks.

### `GET /summary`
Return aggregated daily and weekly intake.

### `GET /recommendations`
Return AI-generated insights.

---

## 🧠 Design Principles

- **AI-first architecture**
- **End-to-end ownership**
- **Clean API contracts**
- **Rapid iteration ready**
- **Modular & extensible**

---

## 🛠 Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

