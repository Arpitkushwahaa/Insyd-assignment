# Insyd Inventory Management System

**Assignment submission for Insyd**  
Built by Arpit Kushwaha

---

## 📌 Overview

This is a comprehensive inventory management system designed specifically for Indian AEC (Architecture, Engineering & Construction) material businesses such as tiles, sanitaryware, lighting, plywood, and stone dealers.

The system goes beyond basic stock tracking to help business owners make smarter inventory decisions by identifying dead stock, slow-moving items, profit leakage, and providing intelligent reorder suggestions.

---

## 🚀 Key Features

### 📦 Inventory Management
- Real-time stock tracking with SKU-wise quantity and valuation
- Low-stock alerts with configurable minimum reorder levels
- Category-based organization (Tiles, Sanitaryware, Lighting, etc.)

### 📊 Stock Movements
- Track all movements: Inward, Outward, Damage, and Loss
- Automatic stock calculations with validation
- Reference number support (PO, Invoice, GRN)
- Complete transaction history with audit trail

### 🧠 Smart Insights (Key Differentiator)
- **Slow-Moving SKUs**: Identify items with no sales in 30+ days
- **Overstocked Items**: Detect underperforming inventory
- **Smart Reorder Suggestions**: Based on sales velocity + lead time
- **High-Damage Detection**: Flag problematic products
- **Top Performers**: Track best sellers by revenue
- **Profit Leakage Indicators**: Visualize daily losses from dead stock

### 🔐 Security & Audit
- Complete audit trail (Who, What, When, Why)
- Role-based access control (Admin / Staff)
- JWT-based secure authentication
- IP address and user agent tracking

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) - Modern React framework
- **TypeScript** - Type safety for critical calculations
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Premium UI components
- **Recharts** - Data visualization
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js + Express.js** - REST API
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Why This Stack?

| Technology | Reason |
|-----------|---------|
| **Next.js** | Fast, SEO-ready, excellent DX |
| **TypeScript** | Prevents bugs in inventory calculations |
| **MongoDB** | Flexible schema for varied SKU attributes |
| **Shadcn/UI** | Premium B2B SaaS look without bloat |
| **REST** | Simpler than GraphQL for this use case |

---

## 📁 Project Structure

```
insyd-assignment/
├── README.md
├── PROBLEM_SOLVING_DOCUMENT.md
├── API_DOCUMENTATION.md
│
├── backend/
│   ├── src/
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── SKU.ts
│   │   │   ├── StockMovement.ts
│   │   │   └── AuditLog.ts
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth & validation
│   │   ├── config/           # Database config
│   │   ├── scripts/          # Seed data
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── login/            # Authentication
    │   ├── dashboard/        # Main app
    │   │   ├── inventory/    # SKU management
    │   │   ├── stock/        # Stock movements
    │   │   ├── insights/     # Smart insights
    │   │   └── audit/        # Audit logs
    │   └── globals.css
    ├── components/
    │   └── ui/               # Shadcn components
    ├── lib/
    │   ├── api.ts            # Axios config
    │   └── utils.ts
    ├── store/
    │   └── authStore.ts
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd insyd-assignment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/insyd_inventory
# or MongoDB Atlas connection string

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add backend URL
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 4. Login Credentials

- **Admin**: `admin@insyd.com` / `password123`
- **Staff**: `staff@insyd.com` / `password123`

---

## 📖 API Documentation

Full API documentation available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | User login |
| `/api/auth/register` | POST | No | User registration |
| `/api/skus` | GET | Yes | List all SKUs |
| `/api/skus` | POST | Admin | Create SKU |
| `/api/skus/:id` | PUT | Admin | Update SKU |
| `/api/stock-movements` | GET | Yes | Movement history |
| `/api/stock-movements` | POST | Yes | Record movement |
| `/api/analytics/insights` | GET | Yes | Smart insights |
| `/api/analytics/reports` | GET | Yes | Generate reports |
| `/api/audit` | GET | Admin | Audit logs |

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repo in Vercel
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js
   - **Environment Variable**: `NEXT_PUBLIC_API_URL=<backend-url>`
4. Deploy

### Backend (Render)

1. Create Web Service on Render
2. Connect GitHub repo
3. Configure:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     ```
     MONGODB_URI=<mongodb-atlas-uri>
     JWT_SECRET=<random-secret>
     NODE_ENV=production
     ```
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Add to backend environment variables

---

## ⚖️ Design Decisions

### MongoDB vs PostgreSQL
**Choice**: MongoDB  
**Reason**: Flexible schema for varied product attributes, faster prototyping  
**Trade-off**: Less rigid constraints. Consider PostgreSQL for strict financial compliance.

### REST vs GraphQL
**Choice**: REST  
**Reason**: Simpler implementation, adequate for current needs  
**Trade-off**: More endpoints. GraphQL better for complex nested queries.

### Zustand vs Redux
**Choice**: Zustand  
**Reason**: Lightweight, minimal boilerplate  
**Trade-off**: Less ecosystem. Redux better for very large applications.

### Soft vs Hard Delete
**Choice**: Soft delete with `isActive` flag  
**Reason**: Preserve history, enable "undo", maintain data integrity  
**Trade-off**: Database growth. Plan hard delete with retention policy.

---

## 🔮 Future Roadmap

### Phase 1 - MVP Enhancements
- Advanced filtering and sorting
- Export to Excel/PDF
- Bulk CSV import
- Barcode/QR scanning
- WhatsApp notifications
- Mobile app (React Native)

### Phase 2 - Intelligence
- ML-based demand forecasting
- Seasonal trend analysis
- Supplier performance tracking
- Automated purchase orders
- Price optimization

### Phase 3 - Integration
- Tally/Zoho Books integration
- E-commerce sync (Shopify, WooCommerce)
- Supplier ordering portal
- B2B customer portal

### Phase 4 - Platform
- Multi-tenant SaaS
- Dealer-supplier marketplace
- Inventory-backed financing
- Industry benchmarking
- Regional language support

---

## 🎓 Learning Outcomes

This project demonstrates:

- **Product Thinking**: Solving real business problems beyond basic CRUD
- **Full-Stack Development**: Next.js, Express, MongoDB with TypeScript
- **B2B SaaS Design**: Professional UI for business users
- **Complex Data Modeling**: Relationships between SKUs, movements, audit trails
- **Business Logic**: Stock calculations, insights generation, analytics
- **Security**: JWT authentication, RBAC, audit logging
- **Scalability**: Database indexing, pagination, efficient queries

---

## 📄 License

MIT License - Free to use for learning or commercial purposes

---

## 🙌 Credits

**Author**: Arpit Kushwaha  
**Email**: kushwahaarpit360@gmail.com  
**Purpose**: Assignment submission for Insyd  
**Date**: December 19, 2025

---

## 🤝 Contributing

Feedback and suggestions are welcome!

1. Open an issue for bugs or suggestions
2. Submit pull requests for improvements
3. Contact directly for questions

---

**Made with ❤️ by Arpit Kushwaha for Insyd**
