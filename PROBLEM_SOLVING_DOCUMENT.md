# Inventory Visibility Solution for AEC Material Businesses
**Problem Solving Document**  
*Insyd Assignment - Product Engineering & Strategy*

---

## 1. Executive Summary

Indian AEC material businesses (tiles, sanitaryware, lighting, stone, plywood) face a critical challenge: **inventory blindness**. Without real-time visibility into stock levels, movement patterns, and SKU performance, businesses suffer from:

- **Thin margins** (3-8% net) eroded further by dead stock, damage, and poor purchasing decisions
- **Cash locked** in slow-moving inventory instead of high-performing SKUs
- **Scale anxiety** - reluctance to expand due to inability to manage existing complexity
- **Reactive operations** - firefighting stockouts and overstocking simultaneously

**The Business Impact:**
- 15-30% of inventory typically becomes dead or slow-moving
- 5-10% annual revenue lost to untracked damage/loss
- 20-40 hours/month wasted on manual stock reconciliation
- Missed revenue opportunities from stockouts of fast-moving items

**Our Solution:** An intelligent inventory management system that transforms inventory from a cost center into a strategic business asset by providing:
1. Real-time visibility across all SKUs
2. Predictive insights for reordering decisions
3. Automated tracking of stock movements and losses
4. Data-driven identification of profit leakage points

**Expected Outcomes:** 10-15% margin improvement, 60% reduction in dead stock, 80% faster stock reconciliation, and confidence to scale.

---

## 2. Problem Breakdown

### 2.1 Current Inventory Workflow

| Stage | Current Process | Pain Points |
|-------|----------------|-------------|
| **Procurement** | Manual reordering based on gut feel or supplier calls | Overstocking slow movers, understocking bestsellers |
| **Receiving** | Physical count, paper/WhatsApp entry | Data entry errors, delayed updates |
| **Storage** | Multi-location (showroom, warehouse, site) | No unified view, unclear ownership |
| **Sales** | Manual deduction from register/Excel | Lag between sale and stock update |
| **Damage/Loss** | Rarely tracked systematically | Silent profit erosion |
| **Reconciliation** | Monthly physical count vs records | Time-consuming, reveals issues too late |
| **Reporting** | No reports or basic Excel sheets | No trend analysis, no actionable insights |

### 2.2 Root Causes

**Operational Issues:**
1. **Fragmented Systems:** WhatsApp, Excel, paper ledgers, mental notes
2. **No Single Source of Truth:** Different numbers in different places
3. **Reactive Culture:** Act only when crisis hits (stockout/overstock)
4. **Time Poverty:** Owners focused on sales, inventory becomes secondary

**Financial Implications:**
1. **Dead Stock:** 20-30% inventory doesn't move for 6+ months → capital blocked
2. **Damage Leakage:** Tiles break, sanitaryware cracks → unaccounted losses (5-8% annually)
3. **Opportunity Cost:** Wrong SKU mix → lost sales + excess holding costs
4. **Margin Erosion:** Forced discounts to clear dead stock

**Strategic Barriers:**
1. **No Data for Decisions:** Can't identify what sells, what doesn't
2. **Supplier Dependence:** No leverage without purchase history insights
3. **Scale Paralysis:** "If I can't manage 200 SKUs, how can I handle 500?"

---

## 3. Proposed Solutions

### 3.1 Tech-Based Solutions

#### **Solution 1: Real-Time Inventory Tracking System** ⭐ *Core*
**What:** Digital system recording every stock movement (inward, outward, damage, transfer)  
**How:** Mobile-friendly web app with barcode/QR integration capability  
**Why:** Eliminates lag between physical movement and system update  
**Impact:** Live stock accuracy, foundation for all other features

#### **Solution 2: Intelligent Analytics Dashboard**
**What:** Visual dashboard showing stock value, turnover velocity, aging, alerts  
**How:** Automated daily calculations with color-coded health indicators  
**Why:** Transforms data into actionable insights at a glance  
**Impact:** 10-min daily review vs 2-hour monthly reconciliation

#### **Solution 3: Predictive Reorder System**
**What:** Algorithm suggesting reorder quantities based on velocity + lead time  
**How:** Machine learning on historical sales + manual override capability  
**Why:** Shifts from gut feel to data-driven procurement  
**Impact:** 30% reduction in stockouts, 25% reduction in overstock

#### **Solution 4: Profit Leakage Detector**
**What:** Automated identification of slow movers, high-damage SKUs, negative-margin items  
**How:** Weekly reports flagging SKUs needing attention with recommended actions  
**Why:** Makes invisible problems visible and urgent  
**Impact:** 10-15% margin improvement by pruning poor performers

#### **Solution 5: Audit Trail & Accountability**
**What:** Log of every stock change with who/when/why  
**How:** Automatic logging with role-based access control  
**Why:** Reduces theft, errors; increases staff accountability  
**Impact:** 40% reduction in unexplained discrepancies

### 3.2 Non-Tech / Process Improvements

| Improvement | Description | Effort | Impact |
|-------------|-------------|--------|--------|
| **SKU Rationalization** | Eliminate bottom 20% of SKUs by revenue | Low | High - frees cash, reduces complexity |
| **ABC Classification** | Tag SKUs as A (top 20% revenue), B, C | Low | Medium - prioritize management attention |
| **Minimum Order Quantities (MOQ)** | Set MOQ rules per SKU category | Low | Medium - prevents over-purchasing |
| **Weekly Stock Reviews** | 15-min team huddle on stock health | Medium | High - creates inventory culture |
| **Supplier Scorecards** | Track delivery time, damage rates | Medium | Medium - better supplier negotiations |
| **Damage Incentives** | Tie staff bonuses to damage reduction | Medium | High - aligns team incentives |
| **Dead Stock Clearance SOP** | Quarterly clearance sales for 6+ month stock | Low | Medium - prevents buildup |

**Why Non-Tech Matters:**  
Technology enables visibility, but *culture and process* drive action. Best results come from combining both.

---

## 4. System Design Overview

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ Dashboard  │  │ SKU Mgmt     │  │ Stock Movement    │   │
│  │ (Insights) │  │ (CRUD)       │  │ (In/Out/Damage)   │   │
│  └────────────┘  └──────────────┘  └───────────────────┘   │
│         Next.js + TypeScript + Tailwind + Shadcn/UI         │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│                    Express.js REST APIs                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Auth API    │  │ Inventory API│  │ Analytics API    │   │
│  │ /auth/*     │  │ /api/sku     │  │ /api/insights    │   │
│  │             │  │ /api/stock   │  │ /api/reports     │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Stock Engine   │  │ Analytics      │  │ Alert Engine │  │
│  │ - Calculate    │  │ - Velocity     │  │ - Low stock  │  │
│  │ - Validate     │  │ - Dead stock   │  │ - Overstock  │  │
│  │ - Update       │  │ - Profit loss  │  │ - Damage     │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│                    MongoDB (Chosen)                          │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Users    │  │ SKUs       │  │ Movements│  │ Audit Log│  │
│  │ - Admin  │  │ - Product  │  │ - In/Out │  │ - Who    │  │
│  │ - Staff  │  │ - Pricing  │  │ - Damage │  │ - When   │  │
│  │ - Roles  │  │ - Category │  │ - Stock  │  │ - What   │  │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow: Stock Movement Example

```
Staff scans item → Frontend captures data → API validates
     ↓
API calls Stock Engine → Engine calculates new stock level
     ↓
Update SKU stock → Create movement record → Create audit log
     ↓
Analytics Engine recalculates → Update dashboard metrics
     ↓
Alert Engine checks thresholds → Send notifications if needed
     ↓
Response to frontend → UI updates → User sees confirmation
```

### 4.3 Database Choice: MongoDB

**Why MongoDB over PostgreSQL for this use case:**

| Factor | MongoDB | PostgreSQL | Winner |
|--------|---------|------------|--------|
| **Schema Flexibility** | SKU attributes vary by category (tiles ≠ sanitaryware) | Rigid schema | MongoDB ✓ |
| **Read-Heavy Workload** | Optimized for dashboard queries | Transactional focus | MongoDB ✓ |
| **Rapid Prototyping** | Fast iteration on data model | Schema migrations needed | MongoDB ✓ |
| **Document Structure** | Nested data (SKU + variants + history) natural | Requires JOINs | MongoDB ✓ |
| **Horizontal Scaling** | Easier sharding for future growth | Vertical scaling | MongoDB ✓ |
| **ACID Transactions** | Supported (4.0+) for critical operations | Native strength | PostgreSQL ✓ |
| **Complex Queries** | Good aggregation pipeline | Superior SQL | PostgreSQL ✓ |

**Decision:** MongoDB for POC. Consider PostgreSQL if strict financial compliance or complex relational queries become critical.

### 4.4 Key Technical Decisions

1. **Next.js App Router:** Modern, fast, SEO-ready (for future marketing pages)
2. **TypeScript:** Type safety reduces bugs in critical inventory calculations
3. **Shadcn/UI:** Consistent, accessible, customizable components
4. **Zustand:** Lightweight state management (simpler than Redux for this scale)
5. **REST over GraphQL:** Simpler for team, adequate for data needs
6. **JWT Auth:** Stateless, scalable, familiar to most developers

---

## 5. Impact Analysis

### 5.1 Margin Improvement Pathways

| Improvement Area | Current State | With System | Annual Impact* |
|------------------|---------------|-------------|----------------|
| **Dead Stock Reduction** | 25% inventory dead (₹25L of ₹1Cr) | 10% dead (better decisions) | +₹15L freed capital |
| **Damage Prevention** | 7% annual loss (₹7L) | 3% (accountability) | +₹4L saved |
| **Stockout Prevention** | ₹5L missed sales/year | ₹1L (better stock) | +₹4L revenue |
| **Optimal SKU Mix** | 30% SKUs contribute 80% profit | Focus on winners | +₹3L margin |
| **Staff Time Savings** | 40 hrs/month reconciliation | 5 hrs/month | ₹80k labor cost |
| **Supplier Negotiation** | No data leverage | 5% better pricing via data | +₹2L cost reduction |
| **Total Annual Benefit** | — | — | **₹28.8L** |

*Estimated for a mid-sized material business with ₹1Cr inventory value, ₹5Cr annual revenue

**Net Margin Math:**
- Current: ₹5Cr revenue × 5% margin = ₹25L profit
- With system: ₹5Cr revenue × 8.8% margin = ₹44L profit
- **Improvement: 76% profit increase**

### 5.2 Scalability Enablers

**Before System:**
- Managing 200 SKUs feels chaotic
- Owner/manager must remember everything
- Adding SKUs = adding complexity linearly

**After System:**
- 500 SKUs as manageable as 50 (system remembers, not humans)
- Opening 2nd location: replicate system, unified view
- New staff onboarding: 2 days vs 2 weeks (system has SOPs built-in)
- Adding categories: extend data model, reuse logic

**Confidence Factors:**
1. **Data-Driven Expansion:** Know which SKUs to stock in new showroom
2. **Remote Management:** Monitor all locations from dashboard
3. **Delegation:** Staff can operate independently with audit trail
4. **Investor-Ready:** Clean data attracts better financing terms

---

## 6. Assumptions & Constraints

### 6.1 Assumptions

1. **User Capability:** Staff can use smartphone/tablet for data entry
2. **Internet Access:** Basic 4G connectivity available at location
3. **Business Size:** ₹50L-₹10Cr inventory value (sweet spot)
4. **SKU Volume:** 50-1000 SKUs (not suitable for <20 SKUs or >5000 without scaling)
5. **Warehouse Setup:** Physical organization exists (bins/racks identified)
6. **Owner Buy-In:** Management commits to using system daily for 90 days (habit formation)
7. **Starting Data Quality:** Willing to do one-time accurate stock count to bootstrap

### 6.2 Constraints

**Technical:**
- POC built for single business (multi-tenant SaaS is Phase 2)
- No offline mode (requires internet)
- Manual barcode entry (scanning hardware integration is Phase 2)
- English + Hindi UI (regional languages Phase 2)

**Business:**
- Requires cultural shift from "gut feel" to "data-driven"
- Initial 2-4 weeks of dual entry (old system + new) during transition
- ROI visible in 3-6 months (not instant)

**Operational:**
- Needs daily 10-min discipline (dashboard review)
- One "system champion" in business required
- Integration with accounting software (Tally) is future scope

---

## 7. Why This Solution Fits Indian AEC Businesses

### 7.1 India-Specific Considerations

| Factor | How Solution Addresses It |
|--------|---------------------------|
| **Price Sensitivity** | Cloud-based = ₹2-5k/month vs ₹5L ERP. No hardware needed. |
| **Low Digital Maturity** | Simple UI, mobile-first, minimal training needed |
| **Multi-Location Chaos** | Unified view across showroom + warehouse + site stocks |
| **Staff Turnover** | System retains knowledge, easy onboarding |
| **Seasonal Demand** | Historical data helps predict festivals/wedding season spikes |
| **Relationship-Driven** | Audit logs don't replace trust, they enhance accountability |
| **Cash Flow Focus** | Dead stock reports directly address working capital trap |
| **Vernacular Comfort** | Can extend to Hindi/regional languages easily |

### 7.2 AEC Industry Specifics

**Tiles Example:**
- Variants: Size (2x2, 2x4), finish (glossy, matte), design (100+ patterns)
- Challenge: Managing 500+ SKUs that "look similar"
- Solution: Image upload, detailed categorization, variant management

**Sanitaryware Example:**
- High-value items (₹5k-₹50k/piece)
- Fragile (damage = big loss)
- Solution: Damage tracking with photo upload, accountability

**Lighting Example:**
- Fast-changing trends (what's hot changes every 6 months)
- Solution: Velocity tracking shows what's moving, dead stock alerts for old designs

**Stone/Marble Example:**
- Sold by sq.ft not pieces
- Solution: Unit flexibility (pieces, sq.ft, kg, boxes)

### 7.3 Competitive Differentiation

**vs Traditional ERPs (Tally, SAP):**
- ❌ ERPs: Complex, expensive, overkill for SMBs
- ✅ Our Solution: Inventory-focused, affordable, quick setup

**vs Generic Inventory Apps:**
- ❌ Generic: Built for e-commerce/warehouses
- ✅ Our Solution: AEC-specific workflows (damage heavy, variant complexity, showroom-warehouse split)

**vs Excel:**
- ❌ Excel: No real-time, error-prone, no insights
- ✅ Our Solution: Live data, automated analytics, mobile access

**Unique Value Props:**
1. **Insights, Not Just Data:** Tells you *what to do*, not just *what is*
2. **Quick Win:** See value in Week 1 (not Month 6)
3. **Designed for AEC:** Not retrofitted e-commerce software
4. **Growth Partner:** Designed to scale with business (50 SKUs → 5000 SKUs)

---

## 8. Success Metrics (90-Day Pilot)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Stock Accuracy | 70% (post-monthly reconciliation) | 95% (daily) | Physical count match |
| Dead Stock % | 25% of total value | 15% | <90 days no movement |
| Reconciliation Time | 40 hrs/month | 5 hrs/month | Time tracking |
| Stockout Incidents | 8/month | 2/month | Lost sales log |
| User Adoption | 0% | 80% daily active | Login analytics |
| Decision Confidence | Qualitative | Survey score >8/10 | Owner feedback |

---

## 9. Implementation Roadmap (Beyond POC)

**Phase 1 (POC - 4 weeks):**
- Core inventory tracking
- Basic dashboard
- Stock movements
- 1 pilot customer

**Phase 2 (MVP - 8 weeks):**
- Advanced analytics
- Mobile app (React Native)
- Barcode scanning
- 10 paying customers
- Customer feedback loop

**Phase 3 (Scale - 6 months):**
- Multi-tenant SaaS
- Accounting integrations (Tally, Zoho)
- Purchase order management
- Supplier portal
- WhatsApp alerts
- 100+ customers

**Phase 4 (Platform - 12 months):**
- Marketplace (connect dealers ↔ suppliers)
- Financing partnerships (inventory-backed loans)
- Predictive AI (demand forecasting)
- Industry benchmarks ("You're top 10% in inventory turnover")

---

## 10. Conclusion

Inventory invisibility is not just an operational annoyance—it's a **strategic ceiling** preventing AEC material businesses from reaching their potential. By making the invisible visible and the complex simple, we empower business owners to:

1. **Reclaim 10-15% margins** lost to dead stock and damage
2. **Scale confidently** knowing systems, not memory, run the business
3. **Make data-driven decisions** on what to buy, what to discontinue, when to expand

This solution is not about replacing people—it's about **augmenting their judgment** with data, freeing them from firefighting to focus on growth.

The POC demonstrates technical feasibility. The real opportunity is building a category-defining product that becomes as essential to AEC businesses as Tally is for accounting.

---

**Document End**

*Prepared for: Insyd Product Team*  
*Focus: Practical, India-specific, business-first solution design*
