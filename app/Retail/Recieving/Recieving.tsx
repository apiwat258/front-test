"use client";
export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

const Recieving = () => {

    // for province fetching
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);
    const searchParams = useSearchParams();
    const trackingId = searchParams.get("trackingId");

    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");

    useEffect(() => {
        fetch("/data/geography.json")
            .then((res) => res.json())
            .then((data: GeoData[]) => {
                setGeoData(data);

                // ดึงจังหวัดที่ไม่ซ้ำ (ใช้ภาษาไทยให้ตรงกับ selectedProvince)
                const provinces = Array.from(new Set(data.map((item) => item.provinceNameEn)));
                setProvinceList(provinces);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const filteredDistricts = Array.from(
                new Set(
                    geoData.filter((item) => item.provinceNameEn === selectedProvince).map((item) => item.districtNameEn)
                )
            );

            setDistrictList(filteredDistricts);
            setSelectedDistrict("");
            setSubDistrictList([]);
            setSelectedSubDistrict("");
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const filteredSubDistricts = Array.from(
                new Set(
                    geoData.filter((item) => item.districtNameEn === selectedDistrict).map((item) => item.subdistrictNameEn)
                )
            );

            setSubDistrictList(filteredSubDistricts);
            setSelectedSubDistrict("");
        }
    }, [selectedDistrict]);
    // end province fetching function

    // Step status update function
    const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
    const shippingAddressRef = useRef<HTMLDivElement>(null);
    const [stepStatus, setStepStatus] = useState({
        step1: 'in-progress',
        step2: 'not-started',
        step3: 'not-started'
    });

    const handleNextClick = () => {
        setShowShippingAddress(true);
        setStepStatus({
            step1: 'completed',
            step2: 'in-progress',
            step3: 'not-started'
        });

        setTimeout(() => {
            shippingAddressRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure the section is rendered
    };
    // end step status update function
// ✅ บันทึก Tracking ID ลง Local Storage
useEffect(() => {
    if (trackingId) {
        localStorage.setItem("trackingId", trackingId);
        console.log("📌 Tracking ID Saved:", trackingId);
    }
}, [trackingId]);

// ✅ ดึง Tracking ID จาก Local Storage ถ้ามีอยู่
const [storedTrackingId, setStoredTrackingId] = useState<string | null>(null);
useEffect(() => {
    const savedTrackingId = localStorage.getItem("trackingId");
    if (savedTrackingId) {
        setStoredTrackingId(savedTrackingId);
    }
}, []);

// ✅ ตั้งค่าเริ่มต้นของฟอร์ม และเพิ่ม trackingId เข้าไป
const [recievedForm, setFormData] = useState({
    trackingId: storedTrackingId || "", // ✅ เพิ่ม trackingId เข้าไป
    RecipientInfo: {
        personInCharge: "",
        location: "",
        pickUpTime: ""
    },
    Quantity: {
        quantity: 0,
        quantityUnit: "Crate",
        temp: 0,
        tempUnit: "Celcius",
        pH: 0,
        fat: 0,
        protein: 0,
        bacteria: false,
        bacteriaInfo: "",
        contaminants: false,
        contaminantInfo: "",
        abnormalChar: false,
        abnormalType: {
            smellBad: false,
            smellNotFresh: false,
            abnormalColor: false,
            sour: false,
            bitter: false,
            cloudy: false,
            lumpy: false,
            separation: false
        }
    }
});

// ✅ โหลดข้อมูลจาก Local Storage เมื่อหน้าเว็บโหลด
useEffect(() => {
    if (typeof window !== "undefined") {
        const savedData = localStorage.getItem("recievedForm");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData({
                ...parsedData,
                trackingId: storedTrackingId || parsedData.trackingId // ✅ ถ้ามี trackingId ใน Local Storage ให้ใช้
            });
        }
    }
}, [storedTrackingId]);

// ✅ บันทึกข้อมูลลง Local Storage ทุกครั้งที่ recievedForm เปลี่ยน
useEffect(() => {
    if (typeof window !== "undefined") {
        localStorage.setItem("recievedForm", JSON.stringify(recievedForm));
    }
}, [recievedForm]);


    // ✅ บันทึกข้อมูลลง localStorage ทุกครั้งที่ recieveForm เปลี่ยน
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("recievedForm", JSON.stringify(recievedForm));
        }
    }, [recievedForm]);

    // ✅ ฟังก์ชัน handleFormDataChange รองรับ text, select และ checkbox
    const handleFormDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = event.target;
        const checked = type === "checkbox" ? (event.target as HTMLInputElement).checked : undefined;
        const keys = name.split(".");

        setFormData((prevData) => {
            const updatedData = { ...prevData }; // Clone ข้อมูลเดิม
            let temp: any = updatedData;

            for (let i = 0; i < keys.length - 1; i++) {
                temp = temp[keys[i]] as any;
            }

            // ถ้าเป็น checkbox ให้ใช้ checked ถ้าไม่ใช่ให้ใช้ value
            temp[keys[keys.length - 1]] = type === "checkbox" ? checked : value;

            // อัปเดต province, district และ subdistrict
            if (name === "RecipientInfo.province") {
                setSelectedProvince(value);
            } else if (name === "RecipientInfo.district") {
                setSelectedDistrict(value);
            } else if (name === "RecipientInfo.subDistrict") {
                setSelectedSubDistrict(value);
            }

            return updatedData;
        });
    };

    // ✅ ฟังก์ชัน handleAbnormalChange → เช็ค abnormalChar และโชว์ abnormalType
    const handleAbnormalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFormDataChange(event);
        setShowAbnormalInfo(event.target.checked);
    };

    // ✅ ฟังก์ชัน handleNestedCheckboxChange สำหรับ abnormalType
    const handleNestedCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setFormData((prevData) => {
            const updatedData = { ...prevData };
            let temp: Record<string, boolean> = updatedData.Quantity.abnormalType;

            temp[name.split('.').pop()!] = checked;

            return updatedData;
        });
    };

    // ✅ ฟังก์ชัน Submit → บันทึกข้อมูลลง localStorage
    const saveToLocalStorage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem("recievedForm", JSON.stringify(recievedForm));
        console.log(recievedForm);
    };
    // end save form Data

    const router = useRouter();

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100">
            {/* Detail Status */}
            <div className="flex items-center w-full mt-10 h-full p-10">
                <div className="flex border shadow-xl w-full h-full p-5 rounded-3xl gap-8">
                    {/* First Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-full" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 12h8v2H8zm2 8H6V4h7v5h5v3.1l2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4zm-2-2h4.1l.9-.9V16H8zm12.2-5c.1 0 .3.1.4.2l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2m0 3.9L14.1 23H12v-2.1l6.1-6.1z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 w-full' : 'bg-yellow-400 w-1/5'}`}></div>
                        </div>
                        <p className="text-xl font-semibold">STEP 1</p>
                        <h1 className="text-3xl font-semibold mb-3">Recipient Info</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step1 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Second Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step2 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 w-0'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step2 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>STEP 2</p>
                        <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step2 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>Quality</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step2 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                    {/* Third Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className="flex bg-gray-200 w-14 text-center text-gray-500 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-600 h-2 rounded-full w-0"></div>
                        </div>
                        <p className="text-xl font-semibold text-gray-500">STEP 3</p>
                        <h1 className="text-3xl font-semibold mb-3 text-gray-500">Check Details</h1>
                        <div className="flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 bg-gray-200 text-gray-500">
                            <p className="text-lg font-semibold">Not finished</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            {/* Form Section */}
            <form className="flex flex-col w-5/6 h-full p-20 m-10" onSubmit={saveToLocalStorage}>
                {/* Milk Tank Info Section */}
                <div className="flex flex-col items-center w-full h-full text-xl gap-5">
                    <h1 className="text-5xl font-bold">Recipient Information</h1>
                    {/* Person in charge */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="personInCharge" className="font-semibold">Person In Charge</label>
                        <input type="text" name="RecipientInfo.personInCharge" id="personInCharge"
                            placeholder="Enter name of person in charge" className="border rounded-full p-3 w-full"
                            value={recievedForm.RecipientInfo.personInCharge} onChange={handleFormDataChange} />
                    </div>
                    {/* Location */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="location" className="font-semibold">Location</label>
                        <input type="text" id="location"
                            placeholder="Enter location" className="border rounded-full p-3 w-full"
                            name="RecipientInfo.location" value={recievedForm.RecipientInfo.location} onChange={handleFormDataChange} />
                    </div>
                    {/* Pick up time */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="pickUpTime" className="font-semibold">Pick up time</label>
                        <input type="datetime-local" id="pickUpTime" placeholder="Pick up date time." className="border rounded-full p-3 w-full"
                            name="RecipientInfo.pickUpTime" value={recievedForm.RecipientInfo.pickUpTime} onChange={handleFormDataChange} />
                    </div>

                    <button
                        type="button"
                        className={`flex text-center justify-center self-end bg-[#C2CC8D] text-[#52600A] p-3 w-1/12 rounded-full hover:bg-[#C0E0C8] ${showShippingAddress ? 'hidden' : ''}`}
                        onClick={handleNextClick}
                    >
                        Next
                    </button>
                </div>

                {/* Shipping Address section */}
                {showShippingAddress && (
                    <div ref={shippingAddressRef} className="flex flex-col items-center w-full h-full text-xl gap-8 mt-20">
                        <h1 className="text-5xl font-bold mb-10">Quality</h1>
                        {/* Quantity + temperature */}
                        <div className="flex w-full items-start gap-3">
                            {/* Quantity */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="quantity" className="font-semibold">Quantity Per Unit</label>
                                <div className="flex gap-3 w-full">
                                    <input type="number" name="Quantity.quantity" id="quantity"
                                        className="border rounded-full p-3 w-4/5" placeholder="0.00" step="0.01"
                                        value={recievedForm.Quantity.quantity} onChange={handleFormDataChange} />
                                    <select name="Quantity.quantityUnit" id="quantityUnit" className="border rounded-full p-3 w-1/5 font-semibold"
                                        value={recievedForm.Quantity.quantityUnit} onChange={handleFormDataChange}>
                                        <option value="Ton">Crate</option>
                                        <option value="Liter">Box</option>
                                    </select>
                                </div>
                            </div>
                            {/* Temperature */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="temp" className="font-semibold">Temperature</label>
                                <div className="flex w-full items-start gap-3">
                                    <input type="number" name="Quantity.temp" id="temp" className="p-3 rounded-full borcder w-4/5" placeholder="0.00" step="0.01"
                                        value={recievedForm.Quantity.temp} onChange={handleFormDataChange} />
                                    <select name="Quantity.tempUnit" id="tempUnit" className="border rounded-full p-3 w-1/5 font-semibold"
                                        value={recievedForm.Quantity.tempUnit} onChange={handleFormDataChange}>
                                        <option value="Celcius">°C</option>
                                        <option value="Farenheit">°F</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* pH of Milk */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="pH" className="font-semibold">pH of Milk</label>
                            <input type="number" name="Quantity.pH" id="pH" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={recievedForm.Quantity.pH} onChange={handleFormDataChange} />
                        </div>
                        {/* Fat + Protein */}
                        <div className="flex w-full items-start gap-3">
                            {/* Fat */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="fat" className="font-semibold">Fat (%)</label>
                                <input type="number" name="Quantity.fat" id="fat" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                                    value={recievedForm.Quantity.fat} onChange={handleFormDataChange} />
                            </div>
                            {/* Protein */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="protein" className="font-semibold">Protein (%)</label>
                                <input type="number" name="Quantity.protein" id="protein" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                                    value={recievedForm.Quantity.protein} onChange={handleFormDataChange} />
                            </div>
                        </div>
                        {/* bacteria testing */}
                        <div className="flex flex-col w-full justify-center gap-3">
                            <div className="flex w-full items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="Quantity.bacteria"
                                    id="bacteria"
                                    className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"
                                    onChange={handleFormDataChange}
                                    checked={recievedForm.Quantity.bacteria}
                                />
                                <label htmlFor="bacteria" className="font-semibold">Bacteria Testing</label>
                            </div>
                            {recievedForm.Quantity.bacteria && (
                                <input
                                    type="text"
                                    name="Quantity.bacteriaInfo"
                                    id="bacteriaInfo"
                                    className="border rounded-full p-3"
                                    placeholder="Please fill additional information"
                                    value={recievedForm.Quantity.bacteriaInfo}
                                    onChange={handleFormDataChange}
                                />
                            )}
                        </div>
                        {/* Contaminants */}
                        <div className="flex flex-col w-full justify-center gap-3">
                            <div className="flex w-full items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="Quantity.contaminants"
                                    id="contaminants"
                                    className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"
                                    onChange={handleFormDataChange}
                                    checked={recievedForm.Quantity.contaminants}
                                />
                                <label htmlFor="contaminants" className="font-semibold">Contaminants</label>
                            </div>
                            {recievedForm.Quantity.contaminants && (
                                <input
                                    type="text"
                                    name="Quantity.contaminantInfo"
                                    id="contaminantInfo"
                                    className="border rounded-full p-3"
                                    placeholder="Please fill additional information"
                                    value={recievedForm.Quantity.contaminantInfo}
                                    onChange={handleFormDataChange}
                                />
                            )}
                        </div>
                        {/* Abnormal Characteristic */}
                        <div className="flex flex-col w-full justify-center items-start gap-3">
                            <div className="flex w-full items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="Quantity.abnormalChar"
                                    id="abnormalChar"
                                    className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"
                                    onChange={handleAbnormalChange}
                                    checked={recievedForm.Quantity.abnormalChar}
                                />
                                <label htmlFor="abnormalChar" className="font-semibold">Abnormal Characteristic</label>
                            </div>
                            {recievedForm.Quantity.abnormalChar && (
                                <div className="flex flex-col w-full items-center gap-3 px-8">
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.smellBad" id="smellBad" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.smellBad} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="smellBad" className="font-semibold">Smell Bad</label>
                                    </div>
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.smellNotFresh" id="smellNotFresh" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.smellNotFresh} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="smellNotFresh" className="font-semibold">Smell not fresh</label>
                                    </div>
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.abnormalColor" id="abnormalColor" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.abnormalColor} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="abnormalColor" className="font-semibold">Abnormal Color</label>
                                        <p className="text-gray-500">ex. yellow or green</p>
                                    </div>
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.sour" id="sour" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.sour} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="sour" className="font-semibold">Sour taste</label>
                                    </div>
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.bitter" id="bitter" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.bitter} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="bitter" className="font-semibold">Bitter taste</label>
                                    </div>
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.cloudy" id="cloudy" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.cloudy} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="cloudy" className="font-semibold">Cloudy Appearance</label>
                                    </div>
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.lumpy" id="lumpy" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.lumpy} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="lumpy" className="font-semibold">Lumpy Appearance</label>
                                    </div>
                                    <div className="flex w-full items-center gap-3">
                                        <input type="checkbox" name="Quantity.abnormalType.separation" id="separation" className="border w-4 h-4"
                                            checked={recievedForm.Quantity.abnormalType.separation} onChange={handleNestedCheckboxChange} />
                                        <label htmlFor="separation" className="font-semibold">Separation between water and fat</label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="flex text-center self-end w-1/12 justify-center bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8]"
                            onClick={() => router.push("/Retail/Recieving/CheckDetails")}
                        >
                            Next
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};
export default Recieving;