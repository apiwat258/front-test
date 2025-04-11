# TRACEABILITY SYSTEM FOR ORGANIC DAIRY PRODUCTS USING BLOCKCHAIN TECHNOLOGY (FRONTEND)

This is the frontend (web application) of the Organic Dairy Product Traceability System. It is built using **Next.js** and connects to a backend API powered by **Go (Fiber)** to allow users to trace, manage, and verify dairy products through every stage of the supply chain.

---

## 🌐 Live Demo (Optional)

> If deployed, add link here  
> Example: https://your-project-frontend.vercel.app/

---

## 🧰 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **QR Scanner:** react-qr-scanner
- **HTTP Client:** Axios
- **Environment Config:** dotenv
- **Backend Communication:** via REST API

---

## 📁 Project Structure Overview

front-test/ ├── app/ # Pages (App Router structure) ├── components/ # Reusable UI components ├── hooks/ # Custom React hooks ├── lib/ # Utility functions ├── providers/ # Context/state providers ├── public/ # Static assets ├── services/ # API service modules │ └── apiConfig.ts # Backend base URL config ├── thailand-geography-json/ # JSON for Thai locations ├── tailwind.config.ts # Tailwind setup ├── next.config.ts # Next.js config ├── .env.local # Environment file └── README.md

yaml
Copy
Edit

---

## 🔌 Connecting to Backend

All API calls are configured in:

```ts
// services/apiConfig.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081/api/v1";
export default API_BASE_URL;
To customize the backend URL, create a .env.local file in the root:

env
Copy
Edit
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
This URL should match the backend server (running on Go).

⚙️ Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/front-test.git
cd front-test
2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Create Environment File
bash
Copy
Edit
cp .env.example .env.local
Edit .env.local as needed:

env
Copy
Edit
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
4. Run Development Server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000

🚀 Features
Multi-role support: Farmer, Factory, Logistics, Retailer

Profile and product registration forms

QR Code generation and scanning for tracking

Integration with backend blockchain system

Dynamic location autocomplete (Thai geography)

Tracking system: pending, in-transit, delivered

🧪 Recommended Versions
Tool	Version
Node.js	>= 18.x
npm	>= 9.x
Git	Latest
📦 Production Build
bash
Copy
Edit
npm run build
npm start
✅ Notes
The backend must be running before testing frontend APIs.

Compatible with Vercel deployment. Make sure to set NEXT_PUBLIC_API_URL as an environment variable in your Vercel project settings.

👥 Contributors
Frontend Developer: Apiwat W.

UI/UX Designer: [Name]

Blockchain Integration: [Name]

📄 License
This project is licensed under the MIT License.
