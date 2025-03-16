import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/product-lots/`;

export const createProductLot = async (data: any): Promise<{ 
    success: boolean; 
    message?: string; 
    txHash?: string; 
    lotId?: string;  // ✅ ใช้ lotId เพื่อให้ Frontend สามารถ Redirect หรือแสดงข้อมูลได้
    ipfsCID?: string; // ✅ ส่ง CID ของ Quality & Nutrition กลับไปให้ Frontend ใช้
    inspector?: string; // ✅ ชื่อ Inspector ที่สร้าง Product Lot
}> => {
    try {
        const response = await fetch(API_URL + "create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            const errorResult = await response.json().catch(() => ({ error: "Unknown error occurred" }));
            return { success: false, message: errorResult.error };
        }

        const result = await response.json();

        return {
            success: true,
            message: "Product Lot Created Successfully!",
            txHash: result.txHash,
            lotId: result.lotId,  // ✅ รับ lotId จาก API
            ipfsCID: result.ipfsCID,  // ✅ รับ IPFS CID จาก API
            inspector: result.inspector,  // ✅ รับชื่อ Inspector จาก API
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error: Unable to reach the server",
        };
    }
};

export const fetchFactoryProductLots = async (searchQuery = ""): Promise<any[]> => {
    try {
        let url = `${API_URL}list`;
        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch factory product lots, Status: ${response.status}`);
            throw new Error("Failed to fetch factory product lots");
        }

        const data = await response.json();
        console.log("📡 API Response:", JSON.stringify(data, null, 2));

        // ✅ ตรวจสอบว่ามี `displayedProductLots` และเป็นอาร์เรย์
        if (!data.displayedProductLots || !Array.isArray(data.displayedProductLots)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        return data.displayedProductLots; // ✅ ส่งเฉพาะ Array กลับไป
    } catch (error) {
        console.error("❌ Error fetching factory product lots:", error);
        return [];
    }
};

export const fetchProductLotDetails = async (lotId: string): Promise<any> => {
    try {
        // สร้าง URL สำหรับดึงข้อมูล Product Lot ด้วย lotId
        const url = `${API_URL}${lotId}`;

        // ทำการส่ง request ไปยัง API
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        // เช็คสถานะของ response
        if (!response.ok) {
            console.error(`❌ Failed to fetch product lot details, Status: ${response.status}`);
            throw new Error("Failed to fetch product lot details");
        }

        // ดึงข้อมูลจาก response
        const data = await response.json();
        console.log("📡 API Response:", JSON.stringify(data, null, 2));

        // ส่งข้อมูลไปยัง Frontend
        return data; // ส่งข้อมูลตรงๆ ให้ Frontend
    } catch (error) {
        console.error("❌ Error fetching product lot details:", error);
        return null;
    }
};
