import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/tracking/`;

export const fetchAllTrackingIds = async (): Promise<any[]> => {
    try {
        const url = `${API_URL}ids`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch tracking IDs, Status: ${response.status}`);
            throw new Error("Failed to fetch tracking IDs");
        }

        const data = await response.json();
        console.log("📡 API Response:", JSON.stringify(data, null, 2));

        // ✅ ตรวจสอบว่ามี `trackingList` และเป็นอาร์เรย์
        if (!data.trackingList || !Array.isArray(data.trackingList)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        return data.trackingList; // ✅ ส่งเฉพาะ Array กลับไป
    } catch (error) {
        console.error("❌ Error fetching tracking IDs:", error);
        return [];
    }
};


export const updateLogisticsCheckpoint = async (trackingId: string, checkpoints: any): Promise<any> => {
    try {
        const response = await fetch(API_URL + "logistics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ trackingId, checkpoints }),
        });

        if (!response.ok) {
            console.error("❌ Failed to update logistics checkpoint, Status:", response.status);
            throw new Error("Failed to update logistics checkpoint");
        }

        const data = await response.json();
        console.log("📡 API Response (Logistics Checkpoint):", data);

        return data;
    } catch (error) {
        console.error("❌ Error updating logistics checkpoint:", error);
        return null;
    }
};

// ✅ ดึงข้อมูล Checkpoints ตาม Tracking ID
export const getLogisticsCheckpointsByTrackingId = async (trackingId: string) => {
    try {
        const response = await fetch(`${API_URL}logistics/checkpoints?trackingId=${trackingId}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch logistics checkpoints, Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Logistics Checkpoints:", data);
        return data;
    } catch (error) {
        console.error("❌ Error fetching logistics checkpoints:", error);
        return null;
    }
};

export const getRetailerTracking = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL + "retailer", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("❌ Failed to fetch retailer tracking IDs, Status:", response.status);
            throw new Error("Failed to fetch retailer tracking IDs");
        }

        const data = await response.json();
        console.log("📡 API Response:", data);

        if (!data || typeof data !== "object" || !Array.isArray(data.trackingList)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        // ✅ แปลงข้อมูลครบทุก field
        return data.trackingList.map((tracking: any) => ({
            trackingId: tracking?.trackingId || "Unknown",
            moreInfoLink: tracking?.moreInfoLink || "#",
            personInCharge: tracking?.personInCharge || "Unknown",
            productLotId: tracking?.productLotId || "Unknown",
            status: tracking?.status || 0,
        }));

    } catch (error) {
        console.error("❌ Error fetching retailer tracking IDs:", error);
        return [];
    }
};



export const retailerReceiveProduct = async (trackingId: string, formData: any) => {
    try {
        // ✅ ตรวจสอบและแปลงค่า quantity ให้เป็น float
        formData.Quantity.quantity = parseFloat(formData.Quantity.quantity);
        formData.Quantity.temp = parseFloat(formData.Quantity.temp);
        formData.Quantity.pH = parseFloat(formData.Quantity.pH);
        formData.Quantity.fat = parseFloat(formData.Quantity.fat);
        formData.Quantity.protein = parseFloat(formData.Quantity.protein);

        console.log("📡 Sending to API:", JSON.stringify({
            trackingId,
            Input: formData,
        }, null, 2));

        const response = await fetch(`${API_URL}retailer/receive`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                trackingId,
                Input: formData,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Failed to submit retailer receive product:", error);
        return null;
    }
};

export const getRetailerReceivedProduct = async (trackingId: string) => {
    try {
        const response = await fetch(`${API_URL}retailer/received?trackingId=${trackingId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Failed to fetch retailer received product:", error);
        return null;
    }
};

