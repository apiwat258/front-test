"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/map";
import { updateUserRole } from "@/services/authService"; // ✅ ใช้ updateUserRole
import { getRetailerInfo, updateRetailerInfo, createRetailer } from "@/services/retailerService";
import { getUserCertifications, uploadCertificateAndCheck, handleDeleteCertificate, deleteCertificate, storeCertification } from "@/services/certificateService";
import { handleFileChange } from "@/services/fileService";
import { getGeoData, getProvinceList, getDistrictList, getSubDistrictList } from "@/services/geoService";


interface GeoData {
    id: number;
    provinceCode: number;
    provinceNameEn: string;
    provinceNameTh: string;
    districtCode: number;
    districtNameEn: string;
    districtNameTh: string;
    subdistrictCode: number;
    subdistrictNameEn: string;
    subdistrictNameTh: string;
    postalCode: number;
}


const GeneralInfo = () => {
    const [retailerData, setRetailerData] = useState<any>({});
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [fileNames, setFileNames] = useState<string[]>(["No file selected."]);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [certificateData, setCertificateData] = useState<any[]>([]);
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [certificatesToDelete, setCertificatesToDelete] = useState<string[]>([]);

    // ✅ ตรวจสอบว่าผู้ใช้มีร้านค้าหรือยัง
useEffect(() => {
    const fetchRetailerData = async () => {
        try {
            const data = await getRetailerInfo(); // ✅ เปลี่ยนจาก getFactoryInfo เป็น getRetailerInfo
            console.log("📌 Retailer Data:", data); // ✅ ตรวจสอบว่ามีข้อมูลร้านค้าหรือไม่

            if (data) {
                setRetailerData(data);
                setSelectedProvince(data.province || "");
                setSelectedDistrict(data.district || "");
                setSelectedSubDistrict(data.subdistrict || "");
                setIsCreating(false);
                setIsEditable(false);
            } else {
                console.warn("🚨 No retailer found → Switching to Create Mode");
                setIsCreating(true);
                setIsEditable(true);
            }
        } catch (error) {
            console.error("❌ Error fetching retailer data:", error);
            setIsCreating(true);
            setIsEditable(true);
        }
    };

    const fetchCertificates = async () => {
        try {
            const data = await getUserCertifications();
            setCertificateData(data);
        } catch (error) {
            console.error("❌ Error fetching certification data:", error);
        }
    };

    fetchRetailerData(); // ✅ เรียกข้อมูลร้านค้าแทนโรงงาน
    fetchCertificates();
}, []);

useEffect(() => {
    console.log("🔄 Updated isCreating:", isCreating);
    console.log("🔄 Updated isEditable:", isEditable);
    console.log("🛠 DEBUG → retailerData:", retailerData);
}, [isCreating, isEditable]);    

// ✅ ดึงข้อมูลภูมิศาสตร์
useEffect(() => {
    const fetchGeoData = async () => {
        const data = await getGeoData();
        setGeoData(data);
        setProvinceList(getProvinceList(data)); // ✅ ใช้ geoService
    };
    fetchGeoData();
}, []);

// ✅ ดึง Districts เมื่อ Province เปลี่ยน
useEffect(() => {
    if (selectedProvince && geoData.length > 0) {
        const filteredDistricts = [...new Set(
            geoData.filter((item) => item.provinceNameEn === selectedProvince).map((item) => item.districtNameEn)
        )];
        setDistrictList(filteredDistricts);
        if (!filteredDistricts.includes(selectedDistrict)) {
            setSelectedDistrict(retailerData?.district || ""); // ✅ เปลี่ยนจาก factoryData เป็น retailerData
        }
    }
}, [selectedProvince, geoData]);

// ✅ ดึง Sub-Districts เมื่อ District เปลี่ยน
useEffect(() => {
    if (selectedDistrict && geoData.length > 0) {
        const filteredSubDistricts = [...new Set(
            geoData.filter((item) => item.districtNameEn === selectedDistrict).map((item) => item.subdistrictNameEn)
        )];
        setSubDistrictList(filteredSubDistricts);
        if (!filteredSubDistricts.includes(selectedSubDistrict)) {
            setSelectedSubDistrict(retailerData?.subdistrict || ""); // ✅ เปลี่ยนจาก factoryData เป็น retailerData
        }
    }
}, [selectedDistrict, geoData]);

// ✅ ดึงข้อมูลใบเซอร์ของร้านค้าปลีก (Retailer)
useEffect(() => {
    if (!retailerData || !retailerData.retailerID) return;
    const fetchCertificate = async () => {
        try {
            const cert = await getUserCertifications();
            console.log("📌 [DEBUG] Loaded Certificates:", cert);
            setCertificateData(cert || []);
        } catch (error) {
            console.error("❌ Error fetching certificate:", error);
            setCertificateData([]);
        }
    };
    fetchCertificate();
}, [retailerData]);

useEffect(() => {
    if (!retailerData) return;

    setRetailerData((prevData: any) => ({
        ...prevData,
        province: selectedProvince || "",  // ✅ บันทึกลง `retailerData`
        district: selectedDistrict || "",
        subdistrict: selectedSubDistrict || "",
    }));

    console.log("📌 Updated retailerData (Province/District/Sub-District):", {
        province: selectedProvince,
        district: selectedDistrict,
        subdistrict: selectedSubDistrict,
    });
}, [selectedProvince, selectedDistrict, selectedSubDistrict]);

// ✅ อัปเดตค่า input
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!retailerData) return;
    const { name, value } = e.target;

    setRetailerData((prevData: any) => {
        if (!prevData) prevData = {};
        return {
            ...prevData,
            [e.target.name]: e.target.value.trim(),
        };
    });
};

// ✅ อัปเดตค่า Select
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!retailerData) return;
    const { name, value } = e.target;

    setRetailerData((prevData: any) => {
        const updatedData = {
            ...prevData,
            [name]: value,
        };

        console.log("📌 Updated retailerData (Select):", updatedData);
        return updatedData;
    });

    // ✅ ถ้าเลือก Area Code ให้บันทึกลง `retailerData.areaCode`
    if (name === "areaCode") {
        setRetailerData((prevData: any) => ({
            ...prevData,
            areaCode: value,
        }));
    }
};

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    console.log("📌 Selected file:", file.name);
    setFileNames([file.name]);
    setCertificateFile(file);

    // ✅ อัปโหลดและตรวจสอบใบเซอร์
    const certCID = await uploadCertificateAndCheck(file);
    if (!certCID) {
        console.error("🚨 Certificate already used. Please upload a new one.");
        alert("❌ ใบเซอร์นี้ถูกใช้ไปแล้ว กรุณาใช้ใบเซอร์ใหม่");
        setFileNames(["No file selected."]);
        setCertificateFile(null);
        return;
    }

    console.log("✅ Certificate uploaded successfully, CID:", certCID);
};

const handleSaveEditToggle = () => {
    if (isCreating) {
        setIsEditable(true); // ✅ ถ้าเป็น Create Mode บังคับให้ `isEditable = true`
    } else {
        setIsEditable(!isEditable);
    }
};

// ✅ จัดการอัปโหลดไฟล์ใบเซอร์สำหรับ Retailer
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const files = Array.from(event.target.files).map((file) => file.name);
        setFileNames(files.length ? files : ["ยังไม่ได้เลือกไฟล์"]);
    } else {
        setFileNames(["ยังไม่ได้เลือกไฟล์"]);
    }
};

const handleCreateRetailer = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!retailerData) {
        console.error("🚨 RetailerData is missing");
        return;
    }

    if (!certificateFile) {
        alert("❌ กรุณาอัปโหลดใบเซอร์ก่อนสร้างร้านค้าปลีก");
        return;
    }

    console.log("📌 Uploading certificate...");
    const certCID = await uploadCertificateAndCheck(certificateFile);
    if (!certCID) {
        console.error("🚨 Certificate check failed. Cannot create retailer.");
        return;
    }

    // ✅ ตรวจสอบค่า `subDistrict`, `areaCode`, `phone` ให้แน่ใจว่าไม่เป็น `undefined`
    const cleanRetailerData = {
        retailerName: retailerData.retailerName || "",
        email: retailerData.email || "",
        address: retailerData.address || "",
        district: retailerData.district || "",
        subdistrict: retailerData.subdistrict || "",
        province: retailerData.province || "",
        phone: retailerData.telephone || "",
        areaCode: retailerData.areaCode || "",
        location: retailerData.location || "",
        certCID: certCID, // ✅ ใส่ certCID ที่ได้จาก IPFS
    };

    console.log("📌 Creating retailer with cleaned data:", cleanRetailerData);

    const response = await createRetailer(cleanRetailerData);
    if (!response) {
        console.error("🚨 Failed to create retailer.");
        return;
    }

    console.log("✅ Retailer created successfully:", response);
    setIsCreating(false);
    setIsEditable(false);
};

const handleUpdateRetailer = async (event: React.FormEvent) => {
    event.preventDefault();
    let retailerUpdateSuccess = false;
    let certTxHash: string | null = null;

    try {
        console.log("📌 Updating retailer data...");
        const payload = {
            retailerName: retailerData?.retailerName || "",
            address: retailerData?.address || "",
            district: retailerData?.district || "",
            subdistrict: retailerData?.subdistrict || "",
            province: retailerData?.province || "",
            postCode: retailerData?.postCode || "",
            telephone: retailerData?.telephone || "",
            areaCode: retailerData?.areaCode || "",
            location_link: retailerData?.location || "",
        };

        console.log("📌 [UpdateRetailer] Sending data:", payload);
        await updateRetailerInfo(payload);
        retailerUpdateSuccess = true;
        console.log("✅ [Update Retailer] Success");

    } catch (error) {
        console.error("❌ Error updating retailer:", error);
    }

    // ✅ อัปเดตใบเซอร์บน Blockchain (เฉพาะใบเซอร์ที่อัปโหลดใหม่)
    if (certificateFile) {
        console.log("📌 Uploading new certificate...");
        const certCID = await uploadCertificateAndCheck(certificateFile);
        console.log("📌 [DEBUG] certCID received from IPFS:", certCID);

        if (!certCID) {
            console.error("🚨 Certificate check failed. Cannot update certification.");
        } else {
            console.log("📌 Storing new certification on Blockchain...");
            try {
                certTxHash = await storeCertification(certCID);
                console.log("✅ Certification stored successfully:", certTxHash);
            } catch (error) {
                console.error("❌ [ERROR] Failed to store certification on blockchain:", error);
            }
        }
    }

    // ✅ ลบใบเซอร์จาก Blockchain (ถ้ามีรายการรอลบ)
    if (certificatesToDelete.length > 0) {
        console.log(`📌 Deleting ${certificatesToDelete.length} Certificates from Blockchain...`);

        await Promise.all(
            certificatesToDelete.map(async (eventID) => {
                if (!eventID) {
                    console.warn("🚨 [WARNING] Skipping deletion because eventID is missing!");
                    return;
                }
                console.log(`📌 Deleting Certificate from Blockchain: ${eventID}`);
                await deleteCertificate(eventID);
            })
        );

        console.log("✅ All selected certificates deleted.");
    } else {
        console.log("ℹ️ No certificates marked for deletion.");
    }

    // ✅ รีโหลดข้อมูลใหม่หลังจากอัปเดตเสร็จ
    console.log("📌 Fetching updated retailer and certification data...");
    const [updatedRetailer, updatedCertificates] = await Promise.all([
        getRetailerInfo(),
        getUserCertifications(),
    ]);

    console.log("✅ [Update Retailer] Reloaded Data:", updatedRetailer);
    console.log("✅ [Reload Certificates]", updatedCertificates);

    setRetailerData(updatedRetailer);
    setCertificateData(updatedCertificates);
    setCertificatesToDelete([]);

    if (retailerUpdateSuccess) {
        setIsEditable(false);
    }
};


return (
    <div className="flex flex-col text-center w-full justify-center items-center h-full pt-20">
      <h1 className="text-3xl md:text-4xl font-bold my-4 md:my-8">
       General Information
      </h1>
  
      <div className="flex h-full w-11/12 md:w-8/12 h-11/12 p-4 md:p-5 shadow-xl justify-center items-center border rounded-2xl m-2 md:m-5">
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={isCreating ? handleCreateRetailer : handleUpdateRetailer}
        >
          {/* Retailer Name */}
          <div className="flex flex-col text-start w-full">
            <label htmlFor="retailerName" className="font-medium">
              Company Name
            </label>
            <input
              type="text"
              id="retailerName"
              name="retailerName"
              className="border border-gray-300 rounded-full p-2 w-full"
              required
              disabled={!isCreating && !isEditable}
              value={retailerData?.retailerName || ""}
              onChange={handleInputChange}
            />
          </div>
  
          {/* First & Last Name */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 text-start w-full">
            <div className="flex flex-col text-start w-full md:w-6/12">
              <label htmlFor="fName" className="font-medium">
                First Name
              </label>
              <input
                type="text"
                id="fName"
                name="fName"
                className="border border-gray-300 rounded-full p-2 w-full"
                required
                disabled={!isCreating && !isEditable}
                value={retailerData?.fName || ""}
                onChange={handleInputChange}
              />
            </div>
  
            <div className="flex flex-col text-start w-full md:w-6/12">
              <label htmlFor="lName" className="font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lName"
                name="lName"
                className="border border-gray-300 rounded-full p-2 w-full"
                required
                disabled={!isCreating && !isEditable}
                value={retailerData?.lName || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
  
          {/* Email */}
          <div className="flex flex-col text-start w-full">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-gray-300 rounded-full p-2"
              placeholder="Example@gmail.com"
              required
              disabled={!isCreating && !isEditable}
              value={retailerData?.email || ""}
              onChange={handleInputChange}
            />
          </div>
  
          {/* Phone */}
          <div className="flex flex-col text-start">
            <label htmlFor="tel" className="font-medium">
              Phone Number
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              {/* Area Code */}
              <div className="flex flex-col">
                <label htmlFor="areaCode" className="sr-only">
                  Area Code
                </label>
                <select
                  name="areaCode"
                  id="areaCode"
                  className="border border-gray-300 rounded-full p-2 w-full md:w-20 text-center"
                  required
                  disabled={!isCreating && !isEditable}
                  value={retailerData?.areaCode || "+66"}
                  onChange={handleSelectChange}
                >
                  <option value="+66">+66</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
              </div>
  
              {/* Phone Input */}
              <input
                type="tel"
                id="tel"
                name="telephone"
                className="border border-gray-300 rounded-full p-2 flex-1 w-full"
                placeholder="Enter your phone number"
                required
                disabled={!isCreating && !isEditable}
                value={retailerData?.telephone || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
  
          {/* Address */}
          <div className="flex flex-col text-start font-medium">
            <label htmlFor="address">Address</label>
            <textarea
              name="address"
              id="address"
              className="border border-gray-300 rounded-full p-2 flex-1 w-full"
              disabled={!isCreating && !isEditable}
              value={retailerData?.address || ""}
              onChange={handleInputChange}
            ></textarea>
          </div>
  
          {/* Province */}
          <div className="flex flex-col w-full text-start font-medium">
            <label htmlFor="province">Province</label>
            <select
              name="province"
              id="province"
              className="border border-gray-300 rounded-full p-2 text-center"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              disabled={!isCreating && !isEditable}
            >
              <option value="">Select province</option>
              {provinceList.map((prov, index) => (
                <option key={index} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
  
          {/* District & Sub-District */}
          <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="flex flex-col text-start font-medium w-full md:w-6/12">
              <label htmlFor="district">District</label>
              <select
                name="district"
                id="district"
                className="border border-gray-300 rounded-full p-2 text-center"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedProvince || !isCreating && !isEditable}
              >
                <option value="">Select district</option>
                {districtList.map((dist, index) => (
                  <option key={index} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="flex flex-col text-start font-medium w-full md:w-6/12">
              <label htmlFor="subDistrict">Sub-District</label>
              <select
                name="subDistrict"
                id="subDistrict"
                className="border border-gray-300 rounded-full p-2 text-center"
                value={selectedSubDistrict}
                onChange={(e) => setSelectedSubDistrict(e.target.value)}
                disabled={!selectedDistrict || !isCreating && !isEditable}
              >
                <option value="">Select sub-district</option>
                {subDistrictList.map((subDist, index) => (
                  <option key={index} value={subDist}>
                    {subDist}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Upload Certificate */}
          <label htmlFor="" className="font-semibold text-start">
            Upload Organic Certification
          </label>
          <div className="flex flex-col md:flex-row items-center justify-start gap-2 border rounded-full p-2">
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 bg-[#C98986] text-[#F7FCD4] rounded-full hover:bg-[#6C0E23] transition"
            >
              Import file
            </label>
            <span className="text-sm text-gray-600">
              {fileNames.length > 1
                ? `${fileNames.length} files selected`
                : fileNames[0]}
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={!isCreating && !isEditable}
            />
          </div>
  
          {/* Location */}
          <div className="flex flex-col font-medium text-start">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              className="border border-gray-300 rounded-full p-2 flex-1 w-full"
              disabled={!isCreating && !isEditable}
              value={retailerData?.location || ""}
              onChange={handleInputChange}
            />
          </div>
  
          {/* Submit Button */}
          <button
            type="button"
            className="flex items-center justify-center text-md md:text-xl bg-[#C98986] hover: w-full md:w-1/6 rounded-full p-2 px-3 text-[#F7FCD4] self-center"
            onClick={async (event) => {
              event.preventDefault();
  
              if (isEditable) {
                if (isCreating) {
                  await handleCreateRetailer(event);
                } else {
                  await handleUpdateRetailer(event);
                  setIsEditable(false);
                }
              } else {
                handleSaveEditToggle();
              }
            }}
          >
            {isEditable ? "Save" : "Edit"}
  
            {isEditable ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="ml-2 w-6 h-6">
                <path fill="currentColor" d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1-3 3a3 3 0 0 1-3-3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default GeneralInfo;