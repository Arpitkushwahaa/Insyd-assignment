# setup

## install

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

## env files

backend .env:
```
MONGODB_URI=your-mongo-uri
JWT_SECRET=your-secret
PORT=5000
```

frontend .env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## login

admin@insyd.com / password123


# Create environment file
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

**In .env, update these values:**
```env
PORT=5000
NODE_ENV=development

# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/insyd_inventory

# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insyd_inventory

JWT_SECRET=my-super-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**Build and seed the database:**
```powershell
# Build TypeScript
npm run build

# Seed database with sample data
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing data
Created users
Created 15 SKUs
Created 50 stock movements

✅ Seed data created successfully!

📝 Test Credentials:
Admin: admin@insyd.com / password123
Staff: staff@insyd.com / password123
```

**Start backend server:**
```powershell
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

✅ **Backend is running!** Keep this terminal open.

### Step 4: Setup Frontend (New Terminal)

Open a **new PowerShell window**:

```powershell
# Navigate to frontend folder
cd "C:\Users\kushw\Downloads\Insyd Assignment\frontend"

# Install dependencies (this will take 2-3 minutes)
npm install

# Create environment file
Copy-Item .env.example .env.local

# Edit .env.local file
notepad .env.local
```

**In .env.local, ensure:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Start frontend server:**
```powershell
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 3.2s
```

✅ **Frontend is running!**

---

## 🎉 Access the Application

1. **Open your browser** and go to: http://localhost:3000

2. **Login with demo credentials:**
   - **Admin User:**
     - Email: `admin@insyd.com`
     - Password: `password123`
   
   - **Staff User:**
     - Email: `staff@insyd.com`
     - Password: `password123`

3. **Explore the features:**
   - ✅ Dashboard with KPIs and charts
   - ✅ Inventory management (view 15 sample SKUs)
   - ✅ Stock movement tracking
   - ✅ Smart insights and recommendations
   - ✅ Audit log (admin only)

---

## 🎯 What You Should See

### Dashboard
- Total SKUs: 15
- Stock Value: ~₹X lakhs
- Low Stock Alerts: X items
- 30-day movement chart

### Inventory Page
- Sample SKUs from different categories:
  - Tiles (4 products)
  - Sanitaryware (3 products)
  - Lighting (3 products)
  - Stone (2 products)
  - Plywood (2 products)

### Insights Page
- Slow-moving SKUs
- Low stock alerts
- Smart reorder suggestions
- High-damage items
- Top performers

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
```powershell
# Check if MongoDB is running
# For local MongoDB:
mongod --version

# If not running, start it:
# Windows: MongoDB should auto-start as service
# Or manually: mongod --dbpath "C:\data\db"

# For Atlas: Check connection string in .env
```

**"Port 5000 already in use"**
```powershell
# Kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or change port in backend/.env
PORT=5001
```

### Frontend Issues

**"Cannot connect to API"**
- Ensure backend is running on http://localhost:5000
- Check `.env.local` has correct API URL
- Test API directly: Open http://localhost:5000/health in browser (should show `{"status":"OK"}`)

**"Port 3000 already in use"**
```powershell
# Kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or Next.js will offer to run on 3001
```

**Module not found errors**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📁 Project Structure Summary

```
Insyd Assignment/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── models/       # Database schemas
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   └── server.ts     # Entry point
│   ├── .env              # Environment variables (create this)
│   └── package.json
│
├── frontend/             # Next.js app
│   ├── app/              # Pages and routes
│   │   ├── login/        # Login page
│   │   └── dashboard/    # Protected pages
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities
│   ├── store/            # State management
│   ├── .env.local        # Environment variables (create this)
│   └── package.json
│
├── PROBLEM_SOLVING_DOCUMENT.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT_GUIDE.md
└── README.md
```

---

## 🔧 Development Commands

### Backend
```powershell
cd backend

npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
npm run seed         # Seed database with sample data
```

### Frontend
```powershell
cd frontend

npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

---

## 📊 Testing the Features

### 1. View Dashboard
- See real-time KPIs
- Check stock movement charts
- Review quick action cards

### 2. Manage Inventory
- Browse all SKUs
- Filter by category (tiles, sanitaryware, etc.)
- Search by SKU code or name
- See stock levels and values

### 3. Record Stock Movement
- Navigate to Stock Movement page
- Try adding an "Outward" movement
- See stock automatically update
- Check audit log for the change

### 4. View Insights
- Go to Insights page
- Review slow-moving items
- Check reorder suggestions
- See top-performing SKUs

### 5. Audit Trail (Admin only)
- Login as admin
- Go to Audit page
- See all system activities logged

---

## 🎓 Next Steps

1. **Customize the data**: Edit `backend/src/scripts/seed.ts` and run `npm run seed` again
2. **Add your own SKUs**: Use the inventory page or API endpoints
3. **Explore the code**: Start with `backend/src/server.ts` and `frontend/app/dashboard/page.tsx`
4. **Read documentation**: Check README.md and API_DOCUMENTATION.md
5. **Deploy**: Follow DEPLOYMENT_GUIDE.md to deploy to production

---

## ❓ Need Help?

### Common Questions

**Q: Can I use this for my actual business?**  
A: Yes! This is production-ready code. You'll need to:
- Deploy to production servers (see DEPLOYMENT_GUIDE.md)
- Customize SKU categories for your products
- Add more features as needed

**Q: How do I add more users?**  
A: Use the `/api/auth/register` endpoint or add users in the seed script

**Q: Can I change the categories?**  
A: Yes, edit `backend/src/models/SKU.ts` and update the `category` enum

**Q: How do I backup the database?**  
A: For MongoDB: `mongodump --db insyd_inventory`  
   For Atlas: Use automatic backups in dashboard

**Q: How to reset everything?**  
A: Run `npm run seed` again (will clear and recreate data)

---

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review error messages in terminal
3. Check browser console (F12) for frontend errors
4. Verify environment variables are correct

---

**Congratulations! 🎉 You now have a fully functional inventory management system running locally.**

Test it thoroughly, explore the code, and when ready, deploy it to production following the DEPLOYMENT_GUIDE.md.

---

**Created**: December 2024  
**For**: Insyd Assignment
