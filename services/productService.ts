import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/products/`;

export const createProduct = async (data: any): Promise<{ 
    success: boolean; 
    message?: string; 
    txHash?: string; 
    productId?: string;  // ✅ ใช้ productId เพื่อให้ Frontend สามารถ Redirect หรือแสดงข้อมูลได้
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
            message: "Product Created Successfully!",
            txHash: result.txHash,
            productId: result.productId, // ✅ ส่ง productId กลับไปให้ Frontend ใช้
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error: Unable to reach the server",
        };
    }
};

export const fetchFactoryProducts = async (searchQuery = ""): Promise<any> => {
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
            console.error(`❌ Failed to fetch factory products, Status: ${response.status}`);
            throw new Error("Failed to fetch factory products");
        }

        const data = await response.json();
        console.log("📡 API Response:", JSON.stringify(data, null, 2));

        // ✅ ตรวจสอบว่ามี `displayedProducts` และเป็นอาร์เรย์
        if (!data.displayedProducts || !Array.isArray(data.displayedProducts)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        return data.displayedProducts; // ✅ ส่งเฉพาะ Array กลับไป
    } catch (error) {
        console.error("❌ Error fetching factory products:", error);
        return [];
    }
};

export const fetchProductDetails = async (productId: string): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch product details, Status: ${response.status}`);
            throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        console.log("📡 API Response:", JSON.stringify(data, null, 2));

        return data; // ✅ ส่งข้อมูลให้ Frontend ใช้ตรงๆ
    } catch (error) {
        console.error("❌ Error fetching product details:", error);
        return null;
    }
};
