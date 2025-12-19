# Insyd Inventory System

inventory management for AEC businesses

## what it does

- tracks inventory in real time
- shows aging and slow moving stock
- records all movements with audit trail
- alerts for low stock

## tech

backend: node.js, express, mongodb, typescript
frontend: next.js 14, tailwind, shadcn ui

## setup

```bash
# backend
cd backend
npm install
npm run seed
npm run dev

# frontend
cd frontend  
npm install
npm run dev
```

login: admin@insyd.com / password123

## structure

```
backend/src/
  controllers/
  models/
  routes/
  
frontend/app/
  dashboard/
  login/
```

- Automatic stock calculations with validation
- Transaction history with audit trail
- Reference number tracking (PO, Invoice, etc.)

### 4. **Smart Insights** 🧠 **(Differentiator)**
- **Slow-Moving SKUs**: No sales in 30 days, capital locked
- **Low Stock Alerts**: Below minimum reorder quantity
- **Smart Reorder Suggestions**: Based on sales velocity + lead time
- **High-Damage Items**: Identify problematic products
- **Top Performers**: Best sellers by revenue
- **Profit Leakage Indicators**: Visualize daily losses

### 5. **Audit Log** 📝
- Complete change history (Who, What, When, Why)
- Admin-only access
- Role-based accountability
- IP address and user agent tracking

### 6. **Role-Based Access** 🔐
- **Admin**: Full access, create SKUs, view audit logs
- **Staff**: Record movements, view inventory

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) - Modern React framework
- **TypeScript** - Type safety for critical calculations
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Accessible, customizable components
- **Recharts** - Data visualization
- **Zustand** - Lightweight state management
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Why This Stack?

| Choice | Reason |
|--------|--------|
| **Next.js** | Fast, SEO-ready, excellent developer experience |
| **TypeScript** | Prevents bugs in inventory calculations |
| **MongoDB** | Flexible schema for varied SKU attributes, read-optimized |
| **Shadcn/UI** | Premium B2B SaaS look without bloat |
| **Zustand** | Simple state management (no Redux boilerplate) |
| **REST over GraphQL** | Simpler for team, adequate for data needs |

---

## 📁 Project Structure

```
insyd-assignment/
├── PROBLEM_SOLVING_DOCUMENT.md    # Detailed problem analysis
├── README.md                       # This file
├── API_DOCUMENTATION.md            # API reference
│
├── backend/                        # Express.js API
│   ├── src/
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── SKU.ts
│   │   │   ├── StockMovement.ts
│   │   │   └── AuditLog.ts
│   │   ├── controllers/            # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── skuController.ts
│   │   │   ├── stockMovementController.ts
│   │   │   ├── analyticsController.ts
│   │   │   └── auditController.ts
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # Auth, error handling
│   │   ├── config/                 # Database config
│   │   ├── scripts/                # Seed data
│   │   └── server.ts               # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                       # Next.js app
    ├── app/                        # App router pages
    │   ├── login/                  # Login page
    │   ├── dashboard/              # Protected routes
    │   │   ├── page.tsx            # Dashboard home
    │   │   ├── inventory/          # SKU management
    │   │   ├── stock/              # Stock movements
    │   │   ├── insights/           # Smart insights
    │   │   ├── audit/              # Audit logs
    │   │   └── layout.tsx          # Dashboard layout
    │   ├── layout.tsx              # Root layout
    │   └── globals.css             # Global styles
    ├── components/                 # Reusable components
    │   └── ui/                     # Shadcn components
    ├── lib/                        # Utilities
    │   ├── api.ts                  # Axios instance
    │   └── utils.ts                # Helper functions
    ├── store/                      # Zustand stores
    │   └── authStore.ts
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### 1. Clone the Repository

```powershell
git clone <your-repo-url>
cd "Insyd Assignment"
```

### 2. Backend Setup

```powershell
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/insyd_inventory
# or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/insyd_inventory

# Build TypeScript
npm run build

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```powershell
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
Copy-Item .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

1. Open `http://localhost:3000`
2. Login with demo credentials:
   - **Admin**: `admin@insyd.com` / `password123`
   - **Staff**: `staff@insyd.com` / `password123`

---

## 📖 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/skus` | GET | Get all SKUs |
| `/api/skus/:id` | GET | Get SKU by ID |
| `/api/skus` | POST | Create SKU (Admin) |
| `/api/skus/:id` | PUT | Update SKU (Admin) |
| `/api/stock-movements` | POST | Record stock movement |
| `/api/stock-movements` | GET | Get movement history |
| `/api/analytics/insights` | GET | Get smart insights |
| `/api/analytics/reports` | GET | Generate reports |
| `/api/audit` | GET | Get audit logs (Admin) |

---

## 🌐 Deployment Guide

### Option 1: Vercel (Frontend) + Render (Backend)

#### Backend Deployment (Render)

1. Push code to GitHub
2. Create account on [Render](https://render.com)
3. Create new **Web Service**
4. Connect GitHub repo
5. Configure:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     ```
     MONGODB_URI=<your-mongodb-atlas-uri>
     JWT_SECRET=<generate-random-secret>
     NODE_ENV=production
     ```
6. Deploy

#### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
     ```
4. Deploy

### Option 2: Docker Deployment

```powershell
# Build and run with Docker Compose
docker-compose up -d
```

---

## ⚖️ Trade-offs & Design Decisions

### 1. MongoDB vs PostgreSQL
**Choice**: MongoDB  
**Reason**: Flexible schema for varied SKU attributes (tiles ≠ sanitaryware), faster prototyping  
**Trade-off**: Less rigid data integrity. For production, consider PostgreSQL if strict financial compliance needed.

### 2. REST vs GraphQL
**Choice**: REST  
**Reason**: Simpler for team, adequate for data needs  
**Trade-off**: More endpoints, potential over-fetching. GraphQL better for complex nested queries.

### 3. Zustand vs Redux
**Choice**: Zustand  
**Reason**: Lightweight, less boilerplate, sufficient for app scale  
**Trade-off**: Less tooling/middleware. Redux better for very large apps with complex state.

### 4. Soft Delete vs Hard Delete
**Choice**: Soft delete (isActive flag)  
**Reason**: Preserve historical data, enable "undo", maintain referential integrity  
**Trade-off**: Database grows larger. Implement hard delete with retention policy later.

### 5. Monorepo vs Separate Repos
**Choice**: Monorepo  
**Reason**: Easier for POC, shared types, single deployment  
**Trade-off**: Harder to scale teams. Consider splitting for production.

### 6. Client-Side vs Server-Side Rendering
**Choice**: Hybrid (SSR for public, CSR for dashboard)  
**Reason**: SEO for landing pages, interactivity for dashboard  
**Trade-off**: More complexity. Could simplify with full CSR if SEO not needed.

---

## 🔮 Future Improvements

### Phase 1 (MVP Enhancements)
- [ ] Advanced filtering and sorting on all tables
- [ ] Export to Excel/PDF
- [ ] Bulk import via CSV
- [ ] Barcode/QR code scanning
- [ ] WhatsApp notifications for alerts
- [ ] Mobile app (React Native)

### Phase 2 (Intelligence)
- [ ] Machine learning for demand forecasting
- [ ] Seasonal trend analysis
- [ ] Supplier performance tracking
- [ ] Automated purchase orders
- [ ] Price optimization suggestions

### Phase 3 (Integration)
- [ ] Accounting software integration (Tally, Zoho Books)
- [ ] E-commerce platform sync (Shopify, WooCommerce)
- [ ] Supplier portal for direct ordering
- [ ] Customer portal for B2B orders

### Phase 4 (Platform)
- [ ] Multi-tenant SaaS architecture
- [ ] Marketplace (connect dealers ↔ suppliers)
- [ ] Inventory-backed financing partnerships
- [ ] Industry benchmarking ("You're top 10% in turnover")
- [ ] Regional language support (Hindi, Tamil, Gujarati)

---

## 📸 Screenshots

### Login Page
![Login](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Inventory Management
![Inventory](./screenshots/inventory.png)

### Smart Insights
![Insights](./screenshots/insights.png)

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **Product Thinking**: Solving real business problems, not just coding features
2. **B2B SaaS Design**: Clean, professional UI tailored for business users
3. **Full-Stack Proficiency**: Next.js + Express + MongoDB with TypeScript
4. **Data Modeling**: Complex relationships (SKUs, movements, audit trails)
5. **Business Logic**: Stock calculations, insights generation, analytics
6. **Security**: JWT auth, role-based access, audit logging
7. **Scalability**: Database indexing, pagination, efficient queries
8. **Documentation**: Clear README, API docs, deployment guides

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🙏 Acknowledgments

Built for **Insyd** as a demonstration of product engineering and strategic thinking for AEC industry solutions.

**Author**: [Your Name]  
**Contact**: [Your Email]  
**Date**: December 2025

---

## 🤝 Contributing

This is a showcase project, but feedback is welcome! If you spot issues or have suggestions:

1. Open an issue
2. Submit a pull request
3. Reach out directly

---

**Made with ❤️ for Indian AEC businesses**
