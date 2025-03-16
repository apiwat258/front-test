import axios from "axios";

import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/certifications`;
// ... ใช้ API_URL

// ✅ ดึงใบเซอร์ของฟาร์มของผู้ใช้ที่ล็อกอินอยู่
export const getUserCertifications = async (includeExpired: boolean = false) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            params: { includeExpired }, 
            withCredentials: true, 
        });

        console.log("📌 [DEBUG] Fetched Certifications:", response.data.certifications);
        return response.data.certifications; 
    } catch (error: any) {
        console.error("❌ Error fetching user certifications:", error.response?.data || error.message);
        throw error;
    }
};

export const storeCertification = async (certCID: string) => {
    console.log("📡 [StoreCertification] Storing certificate on Blockchain...");
    console.log("📌 [DEBUG] certCID:", certCID); // ✅ ตรวจสอบ certCID

    if (!certCID) {
        console.error("🚨 [ERROR] certCID is missing!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/store`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", 
            body: JSON.stringify({ certCID }),
        });

        console.log("📌 [DEBUG] storeCertification API Response Status:", response.status);

        if (!response.ok) {
            try {
                const errorData = await response.json();
                console.error("❌ [StoreCertification] Failed:", errorData.error);
                throw new Error(errorData.error || "Failed to store certification");
            } catch (err) {
                console.error("❌ [StoreCertification] Failed - Response is not JSON", response.statusText);
                throw new Error(`Failed to store certification: ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log("✅ [StoreCertification] Stored successfully. TX Hash:", data.blockchain_tx);
        return data;
    } catch (error) {
        console.error("❌ [ERROR] storeCertification Request Failed:", error);
        throw error;
    }
};



// ✅ อัปโหลดไฟล์ใบเซอร์ไป IPFS และคืนค่า CID
export const uploadCertificate = async (file: File): Promise<string | null> => {
    try {
        if (!file) throw new Error("No file provided for upload");

        const formData = new FormData();
        formData.append("file", file);

        console.log("📌 DEBUG - Uploading File:", file.name);

        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("📌 DEBUG - IPFS Response:", response.data);
        return response.data.cid;
    } catch (error: any) {
        console.error("❌ [ERROR] Uploading certificate:", error.response?.data || error.message);
        return null;
    }
};

export const uploadCertificateAndCheck = async (certificateFile: File): Promise<string | null> => {
    try {
        console.log("📌 Uploading certificate file:", certificateFile.name);
        const uploadResult = await uploadCertificate(certificateFile);

        if (!uploadResult) {
            throw new Error("❌ อัปโหลดใบเซอร์ไม่สำเร็จ");
        }

        console.log("📌 Received CID from IPFS:", uploadResult);

        // ✅ ตรวจสอบ `certCID` ซ้ำทันทีหลังจากอัปโหลด
        const certCheckResponse = await fetch(`${API_URL}/check/${uploadResult}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (!certCheckResponse.ok) {
            throw new Error("❌ ตรวจสอบใบเซอร์ล้มเหลว");
        }

        const certCheckData = await certCheckResponse.json();
        console.log("📌 Cert Check Result:", certCheckData);

        if (certCheckData.exists) {
            console.error("🚨 ใบเซอร์นี้เคยถูกใช้แล้ว → ไม่อนุญาตให้อัปโหลดใหม่");
            alert("❌ ใบเซอร์นี้ถูกใช้ไปแล้ว กรุณาใช้ใบเซอร์ใหม่");
            return null;
        }

        return uploadResult; // ✅ ส่ง `certCID` กลับไปใช้ต่อ
    } catch (error) {
        console.error("❌ [ERROR] Upload & Check Certificate Failed:", error);
        alert("❌ อัปโหลดใบเซอร์ล้มเหลว หรือใบเซอร์นี้เคยถูกใช้แล้ว");
        return null;
    }
};


export const deleteCertificate = async (eventID: string) => {
    try {
        if (!eventID) throw new Error("Event ID is required for deleting certificate");

        const response = await axios.delete(`${API_URL}/`, { // ✅ ใช้ `/` ตาม API ใหม่
            params: { eventID }, // ✅ ส่ง eventID ผ่าน Query Params
            withCredentials: true, // ✅ ส่ง Cookie/JWT เพื่อให้ backend ดึง entityID เอง
        });

        console.log("✅ Certification deleted:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [ERROR] Deleting certificate:", error.response?.data || error.message);
        return null;
    }
};


export const handleDeleteCertificate = async (
    eventID: string,
    setCertificatesToDelete: React.Dispatch<React.SetStateAction<string[]>>,
    setCertificateData: React.Dispatch<React.SetStateAction<any[]>>
) => {
    if (!eventID) {
        console.error("🚨 [ERROR] Missing eventID for deletion", eventID);
        return;
    }

    // ✅ ยืนยันก่อนลบ
    const confirmDelete = window.confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบใบเซอร์นี้?");
    if (!confirmDelete) return;

    console.log("📌 [DEBUG] Marking certificate for deletion. Event ID:", eventID);

    // ✅ อัปเดตรายการใบเซอร์ที่ต้องลบ
    setCertificatesToDelete((prev) => {
        const updatedList = [...prev, eventID];
        console.log("📌 [DEBUG] Updated certificatesToDelete List:", updatedList);
        return updatedList;
    });

    // ✅ ซ่อนใบเซอร์ที่ถูกลบออกจาก UI ชั่วคราว
    setCertificateData((prev) => {
        const updatedData = prev.filter((cert) => cert.EventID !== eventID);
        console.log("📌 [DEBUG] Certificate list after delete:", updatedData);
        return updatedData;
    });
};










