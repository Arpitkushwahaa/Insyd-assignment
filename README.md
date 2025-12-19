Insyd Inventory Management System

Inventory visibility & insights for AEC material businesses

Assignment submission for Insyd
Built by Arpit Kushwaha

📌 Overview

This project is a Proof-of-Concept inventory system designed for Indian AEC (Architecture, Engineering & Construction) material businesses such as tiles, sanitaryware, lighting, plywood, and stone dealers.

The system focuses not just on tracking stock, but on helping business owners make better inventory decisions by identifying dead stock, slow movers, profit leakage, and reorder needs.

🚀 Key Features
Inventory Management

Real-time stock tracking

SKU-wise quantity and valuation

Low-stock alerts with minimum reorder levels

Stock Movements

Inward, outward, damage, and loss tracking

Automatic stock calculations with validation

Reference number support (PO, Invoice, GRN)

Smart Insights (Differentiator)

Slow-moving SKUs (no sales in last 30 days)

Overstocked & underperforming items

Smart reorder suggestions (sales velocity + lead time)

High-damage item detection

Top-performing SKUs by revenue

Profit leakage indicators

Audit & Security

Complete audit trail (who, what, when, why)

Role-based access (Admin / Staff)

Secure JWT authentication

🛠 Tech Stack
Frontend

Next.js 14 (App Router)

TypeScript

Tailwind CSS

Shadcn/UI

Recharts

Zustand

Axios

Backend

Node.js

Express.js

TypeScript

MongoDB + Mongoose

JWT Authentication

Bcrypt

📁 Project Structure
insyd-assignment/
├── PROBLEM_SOLVING_DOCUMENT.md
├── API_DOCUMENTATION.md
├── backend/
│   └── src/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       └── server.ts
└── frontend/
    └── app/
        ├── login/
        └── dashboard/

⚙️ Setup Instructions
Backend
cd backend
npm install
npm run seed
npm run dev

Frontend
cd frontend
npm install
npm run dev

Demo Credentials

Admin: admin@insyd.com / password123

Staff: staff@insyd.com / password123

🌐 Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

(Deployment steps included in the repository.)

🎯 Design Philosophy

Inventory treated as a business decision system, not just CRUD

Clean B2B SaaS UI for Indian business users

Insights-first dashboard

Scalable, auditable, and role-driven design

🔮 Future Scope

Demand forecasting & seasonality analysis

WhatsApp alerts for stock & reorder

Barcode / QR-based inventory

Accounting integrations (Tally, Zoho)

Multi-tenant SaaS architecture

📄 License

MIT License

🙌 Credits

Built by: Arpit Kushwaha
Purpose: Assignment submission for Insyd
Date: December 2025

Made with ❤️ by Arpit Kushwaha for Insyd
