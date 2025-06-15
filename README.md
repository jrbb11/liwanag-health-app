# 🏥 Hospital Cost Estimator

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)
![Vite](https://img.shields.io/badge/Vite-%40tailwindcss%2Fvite-646CFF?logo=vite)
![Cursor AI](https://img.shields.io/badge/Built%20with-Cursor%20AI-4B5563?logo=OpenAI)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> ⚡️ **Built using [Cursor AI](https://www.cursor.so) for faster development, smart completions, and code understanding.**

---

## 🧠 Overview

**Hospital Cost Estimator** helps users estimate healthcare costs such as surgeries, consultations, and confinement—tailored per hospital and procedure.

---

## 🔧 Core Features

### 🏥 Hospital Selection
- Search hospitals by **name** or **location**
- Filter options:
  - Public / Private
  - Region
  - PhilHealth-accredited

### 🩺 Procedure/Service Selector
- Smart searchable list or dropdown for procedures like:
  - *Appendectomy*
  - *Cesarean*
  - *MRI Scan*

### 💰 Estimated Cost Range
- Display **minimum–maximum** price range
- AI-generated predictions for missing data

### 🤖 AI Chat Assistant
- Accepts natural language questions, e.g.:
  > *“Magkano CS delivery sa PGH?”*
- Context-aware replies using:
  - Procedure types
  - Hospital rate data
  - PhilHealth rules

### 💽 PhilHealth & Z-Benefit Integration
- See if a procedure is:
  - ✅ Fully covered
  - 🟡 Partially covered
  - ❌ Not covered

### 👥 User-Contributed Data *(Optional)*
- Allow users to **anonymously submit bills** to improve accuracy

### 📱 Mobile-First UI
- Optimized for low-bandwidth, smartphone users

---

## 🗂️ Data Requirements

- **Hospital List**: DOH API or curated list  
- **Procedures**: Includes PhilHealth & DOH codes + descriptions  
- **Sample Rates**: From public/private hospitals, user submissions, or research

---

## ⚙️ Tech Stack

### Frontend
- **React** `^18.x`
- **Tailwind CSS** `^4.1`
- **Vite** (`@tailwindcss/vite`)
- **Lucide React** `^0.263.0`

### Backend
- **Supabase** `^2.0`
  - PostgreSQL (managed)
  - Supabase Auth
  - Supabase Storage
  - Edge Functions *(optional)*

### Tooling
- **Node.js** `v22.16.0`
- **npm** `v10.9.2`
- **nvm** – Node version manager

### AI Integration
- GPT / LLM for:
  - Smart Q&A
  - Natural hospital cost queries
- Embedded conversational UI

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hospital-cost-estimator.git
cd hospital-cost-estimator
