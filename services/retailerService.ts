import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/retailers`;

import {
    uploadCertificate,
} from "./certificateService";

// ✅ ฟังก์ชันอัปเดตข้อมูลร้านค้า
export const updateRetailerInfo = async (retailerData: any) => {
    try {
        const formData = new FormData();
        formData.append("retailerName", retailerData?.retailerName || "");
        formData.append("address", retailerData?.address || "");
        formData.append("district", retailerData?.district || "");
        formData.append("subdistrict", retailerData?.subdistrict || "");
        formData.append("province", retailerData?.province || "");
        formData.append("postCode", retailerData?.postCode || "");
        formData.append("phone", retailerData?.telephone || "");
        formData.append("areaCode", retailerData?.areaCode || "");
        formData.append("location_link", retailerData?.location || "");

        console.log("📌 [DEBUG] Sending updateRetailerInfo → FormData:");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const response = await fetch(`${API_URL}/`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Updating retailer failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error updating retailer:", error);
        throw error;
    }
};

export const getRetailerInfo = async (): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 403) {
            console.warn("🚨 User is not a retailer owner (403 Forbidden)");
            return null;
        }

        if (response.status === 404) {
            console.warn("🚨 No retailer found (404 Not Found)");
            return null;
        }

        if (!response.ok) {
            throw new Error(`Fetching retailer data failed: ${response.status}`);
        }

        const data = await response.json();

        // ✅ แปลงชื่อ property ให้ตรงกับ React
        return {
            retailerName: data.retailerName,  // ✅ ตรงกับ React
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
        console.error("❌ [ERROR] Fetching retailer data failed:", error);
        return null;
    }
};

export const createRetailer = async (retailerData: any): Promise<any | null> => {
    try {
        // ✅ ใช้ `FormData` เพื่อส่งไป Backend
        const formData = new FormData();
        formData.append("retailerName", retailerData.retailerName);
        formData.append("email", retailerData.email);
        formData.append("address", retailerData.address);
        formData.append("district", retailerData.district);
        formData.append("subdistrict", retailerData.subdistrict); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("province", retailerData.province);
        formData.append("phone", retailerData.phone); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("areaCode", retailerData.areaCode); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("location_link", retailerData.location); // ✅ แก้ไขให้ตรงกับ backend
        formData.append("cert_cid", retailerData.certCID); // ✅ แก้ไขให้ตรงกับ backend

        console.log("📌 Final FormData before sending:", formData);

        // ✅ ส่งข้อมูลไปที่ Backend (แก้ URL)
        const response = await fetch(`${API_URL}/`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to create retailer: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Retailer created successfully:", result);

        return result;
    } catch (error) {
        console.error("❌ [ERROR] Creating retailer failed:", error);
        alert("เกิดข้อผิดพลาดขณะสร้างร้านค้าปลีก");
        return null;
    }
};

export const fetchRetailers = async (searchQuery = ""): Promise<any[]> => {
    try {
        let url = `${API_URL}/list`;
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
            console.error(`❌ Failed to fetch retailers, Status: ${response.status}`);
            throw new Error("Failed to fetch retailers");
        }

        const data = await response.json();
        console.log("📡 API Response:", JSON.stringify(data, null, 2));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("❌ Error fetching retailers:", error);
        return [];
    }
};

export const fetchRetailerByID = async (retailerID: string): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/${retailerID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch retailer details, Status: ${response.status}`);
            throw new Error("Failed to fetch retailer details");
        }

        const data = await response.json();
        console.log("📡 Retailer API Response:", JSON.stringify(data, null, 2));

        return data; // ✅ ส่งข้อมูลที่ได้กลับไป
    } catch (error) {
        console.error("❌ Error fetching retailer details:", error);
        return null;
    }
};

export const fetchRetailerUsernames = async (retailerID: string): Promise<any[]> => {
    try {
        const response = await fetch(`${API_URL}/usernames?retailer_id=${retailerID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch retailer usernames, Status: ${response.status}`);
            throw new Error("Failed to fetch retailer usernames");
        }

        const data = await response.json();
        console.log("📡 Retailer Usernames API Response:", JSON.stringify(data, null, 2));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("❌ Error fetching retailer usernames:", error);
        return [];
    }
};