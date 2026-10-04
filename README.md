# 🐾 Pet Store — Frontend Web Application

A modern, responsive, and boutique web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS v4** for the Pet Shop Management System.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with modern glassmorphism & micro-animations
- **Charts & Visualizations**: Recharts (Executive revenue & category breakdown)
- **Icons**: Lucide React
- **Runtime & Package Manager**: Bun (or Node.js / npm / pnpm)

---

## 🌐 Multi-Environment Support (DEV / UAT / PROD)

The application comes pre-configured with **3 isolated environment configurations**:

| Environment | Config File | Backend API Base URL | Debug Mode | Commands |
|---|---|---|---|---|
| **Development (DEV)** | `.env.dev` | `http://localhost:5000/api` | Enabled | `bun run dev`<br>`bun run build` |
| **Testing (UAT)** | `.env.uat` | `https://uat-api.petshop.local/api` | Enabled | `bun run dev:uat`<br>`bun run build:uat` |
| **Production (PROD)** | `.env.prod` | `https://api.petshop.com/api` | Disabled | `bun run dev:prod`<br>`bun run build:prod` |

---

## 📱 Page Features & Routing

### 1. Storefront Catalog (`/`)
- Promotional hero carousel with auto-advancing slides and adoption stories
- Filter by species categories (Dogs, Cats, Birds, Aquarium & Fish, Small Pets, Reptiles & Exotics)
- Real-time search keyword filter with instant result updates
- Status filter (Available / Adopted)
- Dynamic Pagination with customizable page sizes: **`20, 40, 60, 80, 100`** pets per page
- Interactive Pet Details dialog and One-Click Adoption flow
- Automatic image fallback handling (no broken image icons)

### 2. Authentication & Registration (`/login`)
- Unified modal card for **Sign In** and **Member Registration**
- Form fields with validation: Username, Password, Full Name, Telephone, and Email
- Auto-redirect upon successful login back to adoption checkout or dashboard
- Role-based redirection: Admins are directed to `/dashboard`, standard users to `/`

### 3. Executive Dashboard (`/dashboard` - Admin Only)
- Guarded with client-side & server-side RBAC; normal users receive an **Access Restricted** card
- Real-time KPI Metric cards: Total Inventory, Available Pets, Total Adoptions, and Total Revenue
- **Recharts Data Visualization**:
  - Interactive Bar Chart: Pet count per category
  - Pie / Donut Chart: Inventory availability breakdown
- Recent inventory entries and live adoption order transaction table

### 4. Inventory Administration (`/master` - Admin Only)
- Comprehensive inventory management with Table view and Grid view toggles
- Create, Read, Update, and Delete (CRUD) operations for pet profiles
- Quick toggle status button (Available ↔ Adopted)
- Add new species categories modal

---

## 📁 Component Architecture

```text
src/
├── app/                  # Next.js App Router Pages
│   ├── page.tsx          # Storefront Home & Catalog
│   ├── login/page.tsx    # Authentication (Login / Register)
│   ├── dashboard/page.tsx# Executive Analytics & Charts
│   ├── master/page.tsx   # Backoffice Inventory Administration
│   ├── layout.tsx        # Global Layout & Metadata
│   └── globals.css       # Tailwind CSS v4 Theme
│
├── components/           # Component Library
│   ├── Navbar.tsx        # Responsive Sticky Header & User Dropdown
│   ├── Footer.tsx        # Global Footer
│   │
│   ├── modals/           # ✨ Dedicated Domain Modal Dialogs
│   │   ├── AdoptModal.tsx       # Adoption Checkout & Payment Modal
│   │   ├── DeleteModal.tsx      # Record Deletion Confirmation Modal
│   │   ├── LoginPromptModal.tsx # Guest Sign-in Prompt Modal
│   │   ├── PetDetailModal.tsx   # Comprehensive Pet Profile Modal
│   │   ├── PetFormModal.tsx     # Pet Create & Edit Modal
│   │   └── index.ts             # Clean Barrel Export
│   │
│   └── ui/               # Reusable Atomic UI Primitives
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Counter.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Pagination.tsx
│       └── Select.tsx
│
├── context/              # State Providers
│   ├── AuthContext.tsx   # User Authentication & Role Management
│   └── ToastContext.tsx  # Global Toast Notification System
│
├── services/             # API Client
│   └── api.ts            # Typed HTTP Client with JWT Token Injection
│
└── types/                # System Type Definitions (TypeScript)
    └── index.ts          # Models, DTOs, and API Contracts
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or [Node.js 18+](https://nodejs.org/)

### Installation & Run

1. Navigate to the frontend directory:
   ```bash
   cd pet-shop-web
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run in your desired environment:
   ```bash
   # Development (Default):
   bun run dev

   # UAT Environment:
   bun run dev:uat

   # Production Environment:
   bun run dev:prod
   ```

4. Open [http://localhost:9999](http://localhost:9999) in your browser.

---

## 🔑 Pre-configured Accounts for Testing

| Role | Username | Password | Access Capabilities |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Dashboard Analytics, Inventory Management, Add/Edit/Delete Pets |
| **Standard User** | `user` | `user123` | Browse Catalog, Submit Adoption Orders, View Profile |

*(You can also use the **Click to register** link on the login page to create a brand new user anytime!)*
