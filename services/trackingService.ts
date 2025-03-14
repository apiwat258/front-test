const API_URL = "http://127.0.0.1:8080/api/v1/tracking/";

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

        // ✅ แปลงข้อมูลให้เป็นรูปแบบที่ frontend ใช้
        return data.trackingList.map((tracking: any) => ({
            trackingId: tracking?.trackingId || "Unknown",
            moreInfoLink: tracking?.moreInfoLink || "#",
        }));

    } catch (error) {
        console.error("❌ Error fetching retailer tracking IDs:", error);
        return [];
    }
};
