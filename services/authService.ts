import axios from "axios"; 
import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/auth`;
// ... แล้วใช้ API_URL ปกติ


// ✅ ฟังก์ชัน Login (คืนค่า role และ URL ที่ต้อง Redirect)
export const login = async (email: string, password: string) => {
    console.log("📡 [Login] Sending Request to API...");
    
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    });

    const data = await response.json();
    console.log("📡 [Login] API Response:", response.status, data);

    if (!response.ok) {
        console.error("❌ [Login Error]:", data.error);
        throw new Error(data.error || "Login failed");
    }

    console.log("✅ [Login] Success! Redirecting to:", data.role);

    return {
        role: data.role,
        redirectUrl: getRedirectUrl(data.role),
    };
};

// ✅ ฟังก์ชัน Logout
export const logout = async (): Promise<boolean> => {
    try {
        const response = await axios.post(`${API_URL}/logout`, {}, {
            withCredentials: true, // ✅ ให้ลบคุกกี้ `auth_token`
        });

        if (response.status !== 200) {
            console.error("❌ [Logout] Failed:", response.status);
            return false;
        }

        console.log("✅ [Logout] Success");
        return true;
    } catch (error) {
        console.error("❌ [Logout] Error:", error);
        return false;
    }
};

// ✅ ฟังก์ชันดึง Role ของผู้ใช้จาก Backend
export const getUserRole = async (): Promise<string | null> => {
    console.log("📡 [GetUserRole] Fetching Role...");

    const response = await fetch(`${API_URL}/get-role`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        console.warn("⚠️ [GetUserRole] User role not found.");
        return null; // ✅ ถ้าไม่มี Role ให้คืนค่า null
    }

    const data = await response.json();
    console.log("✅ [GetUserRole] User Role:", data.role);

    return data.role;
};

// ✅ ฟังก์ชันเลือก URL ตาม Role
export const getRedirectUrl = (userRole: string) => {
    console.log("🔄 [Redirect] User Role:", userRole);

    switch (userRole) {
        case "farmer":
            return "/Farmer/Profile";
        case "factory":
            return "/Factory/Profile";
        case "logistics":
            return "/Logistic/Profile";
        case "retailer":
            return "/Retailer/Profile";
        case null:
            return "/select-role"; // ✅ ถ้ายังไม่มี Role ให้เลือก Role ก่อน
        default:
            return "/SignUp/SelectRole"; // ✅ Default
    }
};

// ✅ อัปเดต Role ของผู้ใช้ (หลังสมัครหรือเปลี่ยน Role)
export const updateUserRole = async (email: string, role: string, entityID: string) => {
    try {
        console.log(`📡 [UpdateUserRole] Updating user role to ${role}...`);

        const response = await fetch(`${API_URL}/update-role`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role, entityID }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user role: ${response.status}`);
        }

        console.log("✅ [UpdateUserRole] User role updated successfully");
        return true;
    } catch (error) {
        console.error("❌ [ERROR] Updating user role failed:", error);
        return false;
    }
};

// ✅ ฟังก์ชันดึงข้อมูลผู้ใช้จาก Backend
export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/user-info`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};

// ✅ ฟังก์ชันสมัครสมาชิก (ล็อกอินอัตโนมัติหลังสมัครเสร็จ)
export const registerUser = async (username: string, email: string, password: string, router: any) => {
    try {
        console.log("📡 [Register] Registering user...");

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Registration failed");

        console.log("✅ [Register] Success! Logging in automatically...");
        
        // ✅ ล็อกอินอัตโนมัติ
        await login(email, password);

        // ✅ Reload หน้าเพื่อดึงโทเค็นจากคุกกี้
        console.log("🔄 [Register] Reloading page to apply token...");
        router.refresh();

        // ✅ พาไปหน้าเลือก Role
        router.push("/SignUp/SelectRole");
    } catch (error) {
        console.error("❌ [SignUp] Error:", error);
        throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
};

export const updateUserInfo = async (
    email: string,
    telephone: string,
    firstName: string,
    lastName: string,
    password?: string,
    profileImage?: File
): Promise<boolean> => {
    console.log("📡 [UpdateUserInfo] Updating user info...");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("telephone", telephone);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (password) {
        formData.append("password", password);
    }
    if (profileImage) {
        formData.append("profileImage", profileImage);
    }

    try {
        const response = await axios.put(`${API_URL}/update-user`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });

        if (response.status !== 200) {
            console.error("❌ [UpdateUserInfo] Failed:", response.status);
            return false;
        }

        console.log("✅ [UpdateUserInfo] Success");
        return true;
    } catch (error) {
        console.error("❌ [UpdateUserInfo] Error:", error);
        return false;
    }
};

// ✅ ตรวจสอบว่าอีเมลซ้ำหรือไม่
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/check-email?email=${email}`);
        const data = await response.json();
        return data.available;
    } catch (error) {
        console.error("❌ [Check Email] Error:", error);
        return false;
    }
};

export const refreshToken = async (): Promise<string | null> => {
    console.log("📡 [RefreshToken] Requesting new token...");

    try {
        const response = await fetch(`${API_URL}/refresh-token`, {
            method: "POST",
            credentials: "include", // ส่ง Cookie ไปด้วย
        });

        if (!response.ok) {
            console.warn("⚠️ [RefreshToken] Refresh token failed.");
            return null;
        }

        const data = await response.json();
        console.log("✅ [RefreshToken] Token refreshed successfully:", data.token);

        return data.token; // คืนค่า Token ใหม่
    } catch (error) {
        console.error("❌ [RefreshToken] Error:", error);
        return null;
    }
};

// ✅ ฟังก์ชัน Fetch API พร้อม Refresh Token ถ้าหมดอายุ
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
    console.log("📡 [fetchWithAuth] Fetching:", url);

    let response = await fetch(url, {
        ...options,
        credentials: "include", // ✅ ส่ง Cookie ไปด้วย
    });

    if (response.status === 401) { // 🔄 ถ้า Token หมดอายุ
        console.warn("⚠️ [fetchWithAuth] Token expired. Refreshing...");

        const newToken = await refreshToken();
        if (newToken) {
            console.log("🔄 [fetchWithAuth] Retrying API call with new token...");

            response = await fetch(url, {
                ...options,
                credentials: "include", // ✅ ใช้ Token ใหม่
            });
        } else {
            console.error("❌ [fetchWithAuth] Refresh token failed. Redirecting to login...");
            window.location.href = "/login"; // ✅ พาผู้ใช้ไปล็อกอินใหม่
            return null;
        }
    }

    return response.json();
};

