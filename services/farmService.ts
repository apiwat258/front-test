import API_BASE_URL from './apiConfig';
import { refreshToken } from "./authService"; // ✅ Import refreshToken

const API_URL = `${API_BASE_URL}/farmers`;

import {
    uploadCertificate,
} from "./certificateService";

// ✅ ฟังก์ชันอัปเดตข้อมูลฟาร์ม
export const updateFarmInfo = async (farmData: any) => {
    try {
        const formData = new FormData();
        formData.append("farmName", farmData?.farmName || "");
        formData.append("address", farmData?.address || "");
        formData.append("district", farmData?.district || "");
        formData.append("subdistrict", farmData?.subdistrict || "");
        formData.append("province", farmData?.province || "");
        formData.append("postCode", farmData?.postCode || "");
        formData.append("phone", farmData?.telephone || "");
        formData.append("areaCode", farmData?.areaCode || "");
        formData.append("location_link", farmData?.location || "");

        console.log("📌 [DEBUG] Sending updateFarmInfo → FormData:");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const response = await fetch(`${API_URL}/update`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Updating farm failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error updating farm:", error);
        throw error;
    }
};



export const getFarmInfo = async (): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 403) {
            console.warn("🚨 User is not a farmer (403 Forbidden)");
            return null;
        }

        if (response.status === 404) {
            console.warn("🚨 No farm found (404 Not Found)");
            return null;
        }

        if (!response.ok) {
            throw new Error(`Fetching farm data failed: ${response.status}`);
        }

        const data = await response.json();

        // ✅ แปลงชื่อ property ให้ตรงกับ React
        return {
            farmName: data.farm_name,  // ✅ ตรงกับ React
            email: data.email,
            address: data.address,
            district: data.district,
            subdistrict: data.subdistrict,
            province: data.province,
            telephone: data.telephone,
            areaCode: data.areaCode,
            location: data.location_link,  // ✅ ตรงกับ React
        };
    } catch (error) {
        console.error("❌ [ERROR] Fetching farm data failed:", error);
        return null;
    }
};


// ✅ ฟังก์ชันสร้างฟาร์มใหม่
export const createFarm = async (farmData: any): Promise<any | null> => {
    try {
        const formData = new FormData();
        formData.append("farmName", farmData.farmName);
        formData.append("email", farmData.email);
        formData.append("address", farmData.address);
        formData.append("district", farmData.district);
        formData.append("subdistrict", farmData.subdistrict);
        formData.append("province", farmData.province);
        formData.append("phone", farmData.phone);
        formData.append("areaCode", farmData.areaCode);
        formData.append("location_link", farmData.location);
        formData.append("cert_cid", farmData.certCID);

        console.log("📌 Final FormData before sending:", formData);

        const response = await fetch(`${API_URL}/create`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to create farm: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Farm created successfully:", result);

        // ✅ เรียก Refresh Token หลังจากสร้างฟาร์มสำเร็จ
        const token = await refreshToken();
        if (token) {
            console.log("🔄 Token refreshed after farm creation.");
        } else {
            console.warn("⚠️ Failed to refresh token after farm creation.");
        }

        return result;
    } catch (error) {
        console.error("❌ [ERROR] Creating farm failed:", error);
        alert("เกิดข้อผิดพลาดขณะสร้างฟาร์ม");
        return null;
    }
};


