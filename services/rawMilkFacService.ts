import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/factory/milk/`;

export const getFactoryRawMilkTanks = async (mode: "list" | "selection" = "list"): Promise<any> => {
    try {
        const response = await fetch(API_URL + "list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("❌ Failed to fetch factory milk tanks, Status:", response.status);
            throw new Error("Failed to fetch factory milk tanks");
        }

        const data = await response.json();
        console.log("📡 API Response:", data);

        if (!data || typeof data !== "object" || !Array.isArray(data.displayedMilkTanks)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        // ✅ ถ้า `mode` เป็น "list" ให้ใช้โครงสร้างเดิมของ receiveRM.tsx
        if (mode === "list") {
            return data.displayedMilkTanks.map((tank: any) => ({
                milkTankInfo: {
                    tankId: tank?.moreInfoLink?.split("=")[1]?.trim() || "",
                    personInCharge: tank?.personInCharge || "Unknown",
                },
                status: tank?.status === 0 ? "Pending" : tank?.status === 1 ? "Received" : "Rejected",
                id: tank?.moreInfoLink?.split("=")[1]?.trim() || "",
            }));
        }

        // ✅ ถ้า `mode` เป็น "selection" ให้ใช้โครงสร้างใหม่สำหรับการเลือกแท็งก์
        return data.displayedMilkTanks
            .filter((tank: any) => tank.status === 1) // ✅ กรองเฉพาะแท็งก์ที่ `status === "Received"`
            .map((tank: any) => ({
                tankId: tank?.moreInfoLink?.split("=")[1]?.trim() || "",
                quantity: tank?.quantity || "Unknown",
                temperature: tank?.temperature || "Unknown",
                farmName: tank?.farmName || "Unknown",
                location: tank?.location || "Unknown",
            }));

    } catch (error) {
        console.error("❌ Error fetching factory raw milk tanks:", error);
        return [];
    }
};


// ✅ อัปเดตสถานะของแท็งก์นมดิบ (Approve/Reject)
export const updateMilkTankStatus = async (
    tankId: string,
    approved: boolean,
    input: any
): Promise<any> => {
    try {
        const requestBody = {
            tankId,
            approved,
            input
        };

        console.log("📡 Sending Update Request:", requestBody);

        const response = await fetch(API_URL + "update-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            console.error("❌ Failed to update milk tank status, Status:", response.status);
            throw new Error("Failed to update milk tank status");
        }

        const data = await response.json();
        console.log("✅ Milk Tank Status Updated:", data);
        return data;
    } catch (error) {
        console.error("❌ Error updating milk tank status:", error);
        return null;
    }
};