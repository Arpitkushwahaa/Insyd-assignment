# Testing Checklist for Insyd Inventory POC

## Pre-Testing Setup ✅

### 1. Environment Setup
- [ ] Node.js 18+ installed (`node --version`)
- [ ] MongoDB running (local or Atlas connection string ready)
- [ ] Git repository cloned
- [ ] Backend `.env` file created with MONGODB_URI and JWT_SECRET
- [ ] Frontend `.env.local` file created with NEXT_PUBLIC_API_URL

### 2. Installation Verification
```powershell
# Backend
cd backend
npm install
npm run build    # Should compile TypeScript without errors
npm run seed     # Should create demo data

# Frontend
cd frontend
npm install
npm run build    # Should build Next.js without errors
```

---

## Backend API Testing 🔧

### 1. Server Startup
- [ ] Backend starts without errors: `npm run dev`
- [ ] Console shows: "Server running in development mode on port 5000"
- [ ] Console shows: "MongoDB connected successfully"

### 2. Authentication Endpoints

#### POST /api/auth/register
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@test.com","password":"test123","role":"staff"}'
```
- [ ] Response: 201 Created with JWT token
- [ ] Response includes: `{ token, user: { id, name, email, role } }`

#### POST /api/auth/login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@insyd.com","password":"password123"}'
```
- [ ] Response: 200 OK with JWT token
- [ ] Token is valid JWT format

#### GET /api/auth/me
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
curl http://localhost:5000/api/auth/me `
  -H "Authorization: Bearer $token"
```
- [ ] Response: 200 OK with user details
- [ ] Response excludes password field

### 3. SKU Management Endpoints

#### GET /api/sku (List all SKUs)
```powershell
curl http://localhost:5000/api/sku `
  -H "Authorization: Bearer $token"
```
- [ ] Response: 200 OK with array of SKUs
- [ ] Pagination works: `total`, `page`, `limit`, `data` fields present
- [ ] Default returns 15 SKUs from seed data

#### GET /api/sku/:id (Get single SKU)
```powershell
curl http://localhost:5000/api/sku/SKU_ID_HERE `
  -H "Authorization: Bearer $token"
```
- [ ] Response: 200 OK with SKU details
- [ ] Includes all fields: skuCode, name, category, stock, pricing

#### POST /api/sku (Create SKU)
```powershell
curl -X POST http://localhost:5000/api/sku `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"skuCode":"TEST-001","name":"Test Product","category":"Tiles","mrp":500,"sellingPrice":450,"costPrice":350,"currentStock":100,"minStock":10,"maxStock":500,"location":"Warehouse","unit":"Box"}'
```
- [ ] Response: 201 Created with new SKU
- [ ] SKU appears in GET /api/sku list
- [ ] Audit log created for this action

#### PATCH /api/sku/:id (Update SKU)
```powershell
curl -X PATCH http://localhost:5000/api/sku/SKU_ID_HERE `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"sellingPrice":475}'
```
- [ ] Response: 200 OK with updated SKU
- [ ] Changes reflected in GET request
- [ ] Audit log shows before/after values

#### DELETE /api/sku/:id (Soft delete SKU)
```powershell
curl -X DELETE http://localhost:5000/api/sku/SKU_ID_HERE `
  -H "Authorization: Bearer $token"
```
- [ ] Response: 200 OK
- [ ] SKU marked as inactive (isActive: false)
- [ ] SKU still appears in database but filtered from active list

### 4. Stock Movement Endpoints

#### POST /api/stock/movement (Record movement)
```powershell
curl -X POST http://localhost:5000/api/stock/movement `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"sku":"SKU_ID_HERE","movementType":"inward","quantity":50,"costPerUnit":350,"remarks":"Purchase from supplier"}'
```
- [ ] Response: 201 Created with movement record
- [ ] SKU stock updated correctly (increased by 50 for inward)
- [ ] Movement record shows previousStock and newStock
- [ ] Audit log created

#### GET /api/stock/movements (List movements)
```powershell
curl http://localhost:5000/api/stock/movements `
  -H "Authorization: Bearer $token"
```
- [ ] Response: 200 OK with movements array
- [ ] Pagination works
- [ ] Movements sorted by date (newest first)

#### GET /api/stock/movements/history/:skuId (SKU history)
```powershell
curl http://localhost:5000/api/stock/movements/history/SKU_ID_HERE `
  -H "Authorization: Bearer $token"
```
- [ ] Response: 200 OK with movements for specific SKU
- [ ] Shows all movement types (inward, outward, damage, etc.)

### 5. Analytics Endpoints

#### GET /api/analytics/dashboard
```powershell
curl http://localhost:5000/api/analytics/dashboard?days=30 `
  -H "Authorization: Bearer $token"
```
- [ ] Response includes: totalSKUs, activeSkus, totalStockValue, lowStockItems
- [ ] Response includes: stockMovementTrend (daily data points)
- [ ] Response includes: topCategories, recentMovements

#### GET /api/analytics/insights
```powershell
curl http://localhost:5000/api/analytics/insights `
  -H "Authorization: Bearer $token"
```
- [ ] Response includes: slowMovingItems (30+ days no movement)
- [ ] Response includes: lowStockAlerts (stock below minStock)
- [ ] Response includes: reorderSuggestions (velocity-based)
- [ ] Response includes: highDamageItems
- [ ] Response includes: topPerformers (by revenue)

### 6. Audit Log Endpoints

#### GET /api/audit/logs
```powershell
curl http://localhost:5000/api/audit/logs `
  -H "Authorization: Bearer $token"
```
- [ ] Response: 200 OK with audit logs
- [ ] Each log shows: user, action, entityType, timestamp
- [ ] Logs include before/after changes

---

## Frontend Testing 🖥️

### 1. Application Startup
- [ ] Frontend starts: `npm run dev`
- [ ] Opens at http://localhost:3000
- [ ] No console errors in browser DevTools

### 2. Login Flow
- [ ] Navigate to http://localhost:3000
- [ ] Redirects to /login if not authenticated
- [ ] Login form displays with demo credentials
- [ ] Enter: `admin@insyd.com` / `password123`
- [ ] Click "Sign In"
- [ ] Redirects to /dashboard
- [ ] Token stored in localStorage

### 3. Dashboard Page (/dashboard)
- [ ] 4 KPI cards display: Total SKUs, Stock Value, Low Stock, Stock Movements
- [ ] Values are accurate (match seed data)
- [ ] Line chart shows 30-day stock movement trend
- [ ] Bar chart shows activity breakdown by movement type
- [ ] Quick action cards display (Add SKU, Record Movement, View Reports)

### 4. Inventory Page (/dashboard/inventory)
- [ ] Table displays all 15 SKUs from seed data
- [ ] Columns: SKU Code, Name, Category, Brand, Stock, Status, Actions
- [ ] Stock status badges color-coded (green/yellow/red)
- [ ] Search box filters by name/SKU code
- [ ] Category dropdown filters work
- [ ] Stock status filter works (All, In Stock, Low Stock, Out of Stock)
- [ ] "Add SKU" button opens form modal
- [ ] "Edit" button (admin only) opens edit modal
- [ ] "Delete" button (admin only) soft-deletes SKU

### 5. Stock Movement Page (/dashboard/stock-movement)
- [ ] Form displays with all movement types
- [ ] SKU dropdown populated from inventory
- [ ] Movement types: Inward, Outward, Damage, Loss, Adjustment, Transfer
- [ ] Quantity validation (must be positive number)
- [ ] Cost per unit field appears for Inward movements
- [ ] Submit creates movement successfully
- [ ] Success toast notification appears
- [ ] Recent movements table updates
- [ ] Stock level in inventory updates immediately

### 6. Insights Page (/dashboard/insights)
- [ ] Tabbed interface with 5 tabs
- [ ] **Slow Moving** tab: Shows SKUs not sold in 30+ days
- [ ] **Low Stock** tab: Shows SKUs below minStock threshold
- [ ] **Reorder Suggestions** tab: Shows velocity-based recommendations with suggested quantities
- [ ] **High Damage** tab: Shows SKUs with high damage rates
- [ ] **Top Performers** tab: Shows best-selling SKUs by revenue

### 7. Audit Log Page (/dashboard/audit)
- [ ] Table displays all audit logs
- [ ] Filter by action type works (Create, Update, Delete, Movement)
- [ ] Filter by date range works
- [ ] Each row shows: user, action, entity, timestamp
- [ ] "View Changes" shows before/after JSON diff

### 8. Sidebar Navigation
- [ ] Logo displays
- [ ] User profile shows name, email, role badge
- [ ] All menu items clickable: Dashboard, Inventory, Stock Movement, Insights, Audit
- [ ] Active route highlighted
- [ ] Logout button works (clears token, redirects to /login)

### 9. Responsive Design
- [ ] Dashboard works on mobile (375px width)
- [ ] Tables scroll horizontally on mobile
- [ ] Forms stack vertically on mobile
- [ ] Sidebar collapses to hamburger menu on mobile
- [ ] Charts resize appropriately

### 10. Error Handling
- [ ] Invalid login shows error message
- [ ] Network errors show toast notification
- [ ] Form validation errors display inline
- [ ] 401 errors log user out automatically
- [ ] Loading states show skeleton loaders

---

## Integration Testing 🔄

### Scenario 1: Complete Stock Movement Flow
1. [ ] Login as admin@insyd.com
2. [ ] Go to Inventory, note current stock of "Premium Vitrified Tiles"
3. [ ] Go to Stock Movement
4. [ ] Record Outward movement: 10 units
5. [ ] Verify stock decreased by 10 in Inventory page
6. [ ] Check Dashboard - Stock Movements count increased by 1
7. [ ] Check Audit Log - Movement recorded with admin user
8. [ ] Verify previousStock and newStock values are correct

### Scenario 2: Low Stock Alert Flow
1. [ ] Find SKU with currentStock < minStock (or edit one to create this condition)
2. [ ] Go to Dashboard - verify "Low Stock Items" count includes this SKU
3. [ ] Go to Insights > Low Stock tab
4. [ ] Verify SKU appears with red badge
5. [ ] Go to Insights > Reorder Suggestions
6. [ ] Verify reorder suggestion appears with calculated quantity

### Scenario 3: Slow Mover Detection
1. [ ] Check seed data - find SKU with no movements in last 30 days
2. [ ] Go to Insights > Slow Moving tab
3. [ ] Verify SKU appears with "Days Since Last Movement"
4. [ ] Recommendation should suggest clearance or discontinuation

### Scenario 4: Damage Tracking
1. [ ] Go to Stock Movement
2. [ ] Record Damage movement: 5 units of any SKU
3. [ ] Go to Insights > High Damage tab
4. [ ] Verify SKU appears if damage rate > 5% threshold
5. [ ] Check recommendations (improve packaging, storage, handling)

### Scenario 5: Audit Trail
1. [ ] Login as admin, edit SKU pricing
2. [ ] Go to Audit Log
3. [ ] Find the update action
4. [ ] Click "View Changes"
5. [ ] Verify before/after values show old and new price
6. [ ] Verify user shows as admin@insyd.com

---

## Performance Testing ⚡

### Backend Performance
- [ ] GET /api/sku responds < 200ms (with 15 SKUs)
- [ ] POST /api/stock/movement completes < 300ms (includes transaction)
- [ ] GET /api/analytics/dashboard responds < 500ms (with aggregations)
- [ ] No memory leaks after 100 consecutive API calls

### Frontend Performance
- [ ] Dashboard page loads < 2 seconds (with data)
- [ ] Page transitions smooth (no layout shift)
- [ ] Charts render without lag
- [ ] Bundle size < 500KB (gzipped)

### Database Performance
- [ ] MongoDB queries use indexes (check with .explain())
- [ ] Stock movement transaction completes < 100ms
- [ ] Dashboard aggregations complete < 300ms

---

## Security Testing 🔒

### Authentication
- [ ] Cannot access /api/sku without token (401 Unauthorized)
- [ ] Cannot access /dashboard without login (redirect to /login)
- [ ] Invalid token returns 401
- [ ] Expired token returns 401 and logs out

### Authorization
- [ ] Staff users cannot delete SKUs (403 Forbidden)
- [ ] Staff users cannot edit critical pricing fields
- [ ] Admin users can perform all actions

### Input Validation
- [ ] SQL injection attempts blocked (N/A for MongoDB, but test NoSQL injection)
- [ ] XSS attempts sanitized (< > & " ' escaped)
- [ ] Negative stock quantities rejected
- [ ] Invalid email format rejected in registration

### Password Security
- [ ] Passwords hashed with bcrypt (not stored in plaintext)
- [ ] Password not returned in API responses
- [ ] Password minimum length enforced (6 characters)

---

## Deployment Testing 🚀

### Docker Deployment
```powershell
docker-compose up -d
```
- [ ] All 3 containers start: mongodb, backend, frontend
- [ ] Backend connects to MongoDB container
- [ ] Frontend can reach backend API
- [ ] Application accessible at http://localhost:3000
- [ ] Seed data persists after container restart

### Production Build
```powershell
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```
- [ ] TypeScript compiles without errors
- [ ] Next.js builds without warnings
- [ ] Production build smaller than dev build
- [ ] Environment variables loaded correctly

---

## Regression Testing 🔁

After any code changes, verify:
- [ ] All authentication flows still work
- [ ] Stock calculations remain accurate
- [ ] Charts display correct data
- [ ] Audit logs capture all changes
- [ ] No console errors in browser
- [ ] No server errors in terminal

---

## User Acceptance Testing 👥

### Admin User Journey
1. [ ] Login as admin
2. [ ] Add new SKU for "LED Panel Light"
3. [ ] Record inward movement of 100 units
4. [ ] Record outward sale of 25 units
5. [ ] Check dashboard shows updated metrics
6. [ ] Generate insights report
7. [ ] Review audit trail
8. [ ] Logout

### Staff User Journey
1. [ ] Login as staff
2. [ ] View inventory (read-only)
3. [ ] Attempt to delete SKU (should fail with permission error)
4. [ ] Record damage movement
5. [ ] View insights
6. [ ] Logout

---

## Known Issues & Limitations 🐛

### Current Limitations (By Design)
- [ ] No barcode scanning (Phase 2 feature)
- [ ] No offline mode (Phase 2 feature)
- [ ] No WhatsApp alerts (Phase 2 feature)
- [ ] No multi-location tracking (Phase 3 feature)
- [ ] English only (Hindi support in Phase 2)

### Potential Issues to Watch
- [ ] Large datasets (1000+ SKUs) may need pagination optimization
- [ ] Concurrent stock movements need transaction locking
- [ ] Chart performance with 365+ days data
- [ ] Mobile performance on low-end devices

---

## Test Data Reference 📊

### Seed Data Created
- **Users**: 2 (1 admin, 1 staff)
- **SKUs**: 15 across 5 categories
  - Tiles: 3 SKUs
  - Sanitaryware: 3 SKUs
  - Lighting: 3 SKUs
  - Natural Stone: 3 SKUs
  - Plywood: 3 SKUs
- **Stock Movements**: 50 historical movements
- **Movement Types**: Mix of inward, outward, damage, loss

### Test Credentials
```
Admin:
Email: admin@insyd.com
Password: password123

Staff:
Email: staff@insyd.com
Password: password123
```

---

## Testing Sign-off ✍️

- [ ] All backend API tests passed
- [ ] All frontend UI tests passed
- [ ] All integration scenarios passed
- [ ] Performance benchmarks met
- [ ] Security checks passed
- [ ] Deployment successful
- [ ] User acceptance criteria met

**Tested By**: _________________  
**Date**: _________________  
**Sign-off**: ✅ Ready for submission

---

## Quick Test Commands 🚀

```powershell
# Full test sequence (PowerShell)

# 1. Start backend
cd backend
npm install
npm run build
npm run seed
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# 2. Start frontend
cd frontend
npm install
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# 3. Open browser
Start-Process "http://localhost:3000"

# 4. Login and test!
```

---

**Happy Testing! 🎉**
