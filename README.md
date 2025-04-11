
# Blockchain-Based Agricultural Supply Chain Frontend

This is the **frontend** system for the blockchain-based agricultural supply chain project. Built with **Next.js (App Router)** and **Tailwind CSS**, it connects to a Golang backend and interacts with smart contracts, IPFS, and blockchain data. The system supports role-based views for **Farmers, Factories, Logistics Providers**, and **Retailers**, and includes QR code generation and scan support.

## 🌐 Live Demo

👉 [https://front-test-s6zk.vercel.app](https://front-test-s6zk.vercel.app)

---

## 📁 Project Structure

```
front-test/
├── app/                    → Next.js App Router pages & layouts
├── components/             → Reusable UI components (cards, forms, layout)
├── hooks/                  → Custom React hooks
├── lib/                    → Utility functions and logic helpers
├── providers/              → Context providers (Auth, Theme, etc.)
├── public/                 → Static assets (images, icons, etc.)
├── services/               → API service handlers (auth, farm, logistics, etc.)
├── thailand-geography-json/ → Geo data for Thai provinces/districts
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Configuration

Before running the project, make sure to set the correct **API base URL** in `services/apiConfig.ts`.

```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081/api/v1";
export default API_BASE_URL;
```

If deploying to production (e.g., Vercel), set the environment variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.duckdns.org/api/v1
```

You can set this in `.env.local` (for local) or Vercel's **Project Settings > Environment Variables**.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Then open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 🧩 Main Features

- ✅ Role-Based Interface (Farmer, Factory, Logistics, Retailer)
- ✅ JWT Auth with Role Switching
- ✅ Form for General Information with Thai province dropdowns
- ✅ Certification Upload via IPFS
- ✅ Product Lot Creation & Preview
- ✅ Logistics Checkpoint Management
- ✅ QR Code Generation & Scanning
- ✅ Backend-connected using `services/*.ts`

---

## 🛠️ Services Overview (API Handlers)

| File Name              | Purpose                              |
|------------------------|--------------------------------------|
| `authService.ts`       | Login, Register, Update Role         |
| `farmService.ts`       | Create farmer profile                |
| `factoryService.ts`    | Create factory profile               |
| `logisticsService.ts`  | Logistics general info & tracking    |
| `retailerService.ts`   | Retailer profile                     |
| `rawMilkService.ts`    | Raw milk tank creation & view        |
| `productService.ts`    | Product info & nutrition             |
| `productlotService.ts` | Product lot creation, preview        |
| `certificateService.ts`| Upload & create IPFS certification   |
| `trackingService.ts`   | View checkpoints per role            |

---

## 🧪 Testing Pages (Optional)

- `/auth/register` – User registration
- `/dashboard` – Redirects after login
- `/farm`, `/factory`, `/logistics`, `/retailer` – Role-specific pages
- `/track/:productLotId` – Tracking & QR page

---

## 📦 Deployment

This frontend is designed for deployment on [Vercel](https://vercel.com). Example steps:

1. Push your code to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Set environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.duckdns.org/api/v1`

Done! Vercel will auto-deploy on every push.

---

## 🧾 License

MIT License © 2025
