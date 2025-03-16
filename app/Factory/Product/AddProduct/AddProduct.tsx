"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

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

interface Nutrition {
    quantity: number;
    quantityUnit: string;
    temp: number;
    tempUnit: string;
    pH: number;
    fat: number;
    protein: number;
    calories: number;
    totalFat: number;
    colestoral: number;
    sodium: number;
    potassium: number;
    totalCarbohydrates: number;
    fiber: number;
    sugar: number;
    vitaminC: number;
    calcium: number;
    iron: number;
    vitaminD: number;
    vitaminB6: number;
    vitaminB12: number;
    magnesium: number;
    abnormalType: { [key: string]: boolean }; // Update this line
}

interface FormData {
    GeneralInfo: {
        prodName: string;
        category: string;
        description: string;
        quantity: string;
    };
    Nutrition: Nutrition;
}

const AddProduct = () => {

    // for province fetching
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);

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

    // save form Data
    const [addProductForm, setFormData] = useState<FormData>({
        GeneralInfo: {
            prodName: "",
            category: "",
            description: "",
            quantity: ""
        },
        Nutrition: {
            quantity: 0,
            quantityUnit: "ton",
            temp: 0,
            tempUnit: "Celcius",
            pH: 0,
            fat: 0,
            protein: 0,
            calories: 0,
            totalFat: 0,
            colestoral: 0,
            sodium: 0,
            potassium: 0,
            totalCarbohydrates: 0,
            fiber: 0,
            sugar: 0,
            vitaminC: 0,
            calcium: 0,
            iron: 0,
            vitaminD: 0,
            vitaminB6: 0,
            vitaminB12: 0,
            magnesium: 0,
            abnormalType: {} // Ensure this is an object
        }
    });

    // ✅ ควบคุมการแสดงผลของ abnormalType
    const [showAbnormalInfo, setShowAbnormalInfo] = useState(false);

    // ✅ โหลดข้อมูลจาก localStorage เมื่อหน้าเว็บโหลด
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem("addProductForm");
            if (savedData) {
                setFormData(JSON.parse(savedData));
            }
        }
    }, []);

    // ✅ บันทึกข้อมูลลง localStorage ทุกครั้งที่ addProductForm เปลี่ยน
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("addProductForm", JSON.stringify(addProductForm));
        }
    }, [addProductForm]);

    // ✅ ฟังก์ชัน handleFormDataChange รองรับ text, select และ checkbox
    const handleFormDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = event.target;
        const checked = event.target instanceof HTMLInputElement ? event.target.checked : undefined;
        const keys = name.split(".");

        setFormData((prevData) => {
            const updatedData = { ...prevData };
            let temp: any = updatedData;
        
            for (let i = 0; i < keys.length - 1; i++) {
                if (!temp[keys[i]]) {
                    temp[keys[i]] = {}; // ✅ ถ้า object ไม่มี ให้สร้างใหม่
                }
                temp = temp[keys[i]];
            }
        
            // ✅ ตรวจสอบว่ามีค่าก่อนใช้งาน
            if (temp) {
                temp[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
            }

            // อัปเดต province, district และ subdistrict
            if (name === "GeneralInfo.province") {
                setSelectedProvince(value);
            } else if (name === "GeneralInfo.district") {
                setSelectedDistrict(value);
            } else if (name === "GeneralInfo.subDistrict") {
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
            let temp = updatedData.Nutrition.abnormalType;

            temp[name.split('.').pop()!] = checked;

            return updatedData;
        });
    };

    // ✅ ฟังก์ชัน Submit → บันทึกข้อมูลลง localStorage
    const saveToLocalStorage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem("recievedForm", JSON.stringify(addProductForm));
        console.log(addProductForm);
    };
    // end save form Data

    const router = useRouter();

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100">
            {/* Detail Status */}
            <div className="flex items-center w-full h-full p-10">
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
                        <h1 className="text-3xl font-semibold mb-3">General Info</h1>
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
                        <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step2 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>Nutrition</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step2 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                    {/* Third Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className="flex bg-gray-200 w-14 text-center text-gray-500 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M4 4a2 2 0 0 1 2-2h8a1 1 0 0 1 .707.293l5 5A1 1 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm13.586 4L14 4.414V8zM12 4H6v16h12V10h-5a1 1 0 0 1-1-1zm3.707 8.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 15.586l3.293-3.293a1 1 0 0 1 1.414 0" />
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
                {/* General info */}
                <div className="flex flex-col items-center w-full h-full text-xl gap-5">
                    <h1 className="text-5xl font-bold">General Information</h1>
                    {/* Product name */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="prodName" className="font-semibold">Product Name</label>
                        <input type="text" name="GeneralInfo.prodName" id="prodName"
                            placeholder="Enter product name" className="border rounded-full p-3 w-full"
                            value={addProductForm?.GeneralInfo?.prodName || ""} onChange={handleFormDataChange} />
                    </div>
                    {/* Category */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="category" className="font-semibold">Category</label>
                        <input type="text" id="category"
                            placeholder="Enter category" className="border rounded-full p-3 w-full"
                            name="GeneralInfo.category" value={addProductForm?.GeneralInfo?.category || ""} onChange={handleFormDataChange} />
                    </div>
                    {/* Description */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="description" className="font-semibold">Description</label>
                        <input type="text" id="description" placeholder="Write description of product" className="border rounded-full p-3 w-full"
                            name="GeneralInfo.description" value={addProductForm?.GeneralInfo?.description || ""} onChange={handleFormDataChange} />
                    </div>
                    {/* Quauntity per unit */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="quantity" className="font-semibold">Quantity per unit</label>
                        <div className="flex gap-3 w-full items-center">
                            <input type="number" name="GeneralInfo.quantity" className="border rounded-full w-5/6 p-3" placeholder="0.00" step={0.01}
                                value={addProductForm?.GeneralInfo?.quantity || ""} onChange={handleFormDataChange} />
                            <select name="Nutrition.quantityUnit" id="Unit" className="border rounded-full p-3 w-1/6 font-semibold text-center"
                                value={addProductForm?.Nutrition?.quantityUnit || ""} onChange={handleFormDataChange}>
                                <option value="liter">Liter</option>
                                <option value="milliliter">Milliliter</option>
                                <option value="gallon">Gallon</option>
                                <option value="cc">cc</option>
                                <option value="ton">Ton</option>
                                <option value="ounce">Ounce</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8] ${showShippingAddress ? 'hidden' : ''}`}
                        onClick={handleNextClick}
                    >
                        Next
                    </button>
                </div>

                {/* Nutrition */}
                {showShippingAddress && (
                    <div ref={shippingAddressRef} className="flex flex-col items-center w-full h-full text-xl gap-8 mt-20">
                        <h1 className="text-5xl font-bold">Nutrition</h1>
                        {/* Calories */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="calories" className="font-semibold">Calories per 100 grams  </label>
                            <input type="number" name="Nutrition.calories" id="calories" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={addProductForm?.Nutrition?.calories || ""} onChange={handleFormDataChange} />
                        </div>
                        {/* Total Fat */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="totalFat" className="font-semibold">Total Fat (g)</label>
                            <input type="number" name="Nutrition.totalFat" id="totalFat" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={addProductForm?.Nutrition?.totalFat || ""} onChange={handleFormDataChange} />
                        </div>
                        {/* Colestoral */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="colestoral" className="font-semibold">Colestoral (mg)</label>
                            <input type="number" name="Nutrition.colestoral" id="colestoral" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={addProductForm?.Nutrition?.colestoral || ""} onChange={handleFormDataChange} />
                        </div>
                        {/* Sodium */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="sodium" className="font-semibold">Sodium (mg)</label>
                            <input type="number" name="Nutrition.sodium" id="sodium" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={addProductForm?.Nutrition?.sodium || ""} onChange={handleFormDataChange} />
                        </div>
                        {/* Potassium */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="potassium" className="font-semibold">Potassium (mg)</label>
                            <input type="number" name="Nutrition.potassium" id="potassium" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={addProductForm?.Nutrition?.potassium || ""} onChange={handleFormDataChange} />
                        </div>
                        {/* Total Carbohydrates */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="totalCarbohydrates" className="font-semibold">Total Carbohydrates (g)</label>
                            <input type="number" name="Nutrition.totalCarbohydrates" id="totalCarbohydrates" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={addProductForm?.Nutrition?.totalCarbohydrates || ""} onChange={handleFormDataChange} />
                            <div className="flex w-full items-start gap-3">
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="fiber" className="font-semibold" >Dietary Fiber (g)</label>
                                    <input type="number" name="Nutrition.fiber" id="fiber" className="border rounded-full w-full p-3" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.fiber || ""} onChange={handleFormDataChange} />
                                </div>
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="sugar" className="font-semibold">Sugar (g)</label>
                                    <input type="number" name="Nutrition.sugar" id="sugar" className="border rounded-full w-full p-3" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.sugar || ""} onChange={handleFormDataChange} />
                                </div>
                            </div>
                        </div>
                        {/*temperature */}
                        <div className="flex w-full items-start gap-3">
                            {/* Temperature */}
                            <div className="flex flex-col w-full items-start gap-3">
                                <label htmlFor="temp" className="font-semibold">Temperature</label>
                                <div className="flex w-full items-start gap-3">
                                    <input type="number" name="Nutrition.temp" id="temp" className="p-3 rounded-full borcder w-11/12" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.temp || ""} onChange={handleFormDataChange} />
                                    <select name="Nutrition.tempUnit" id="tempUnit" className="border rounded-full p-3 w-1/12 font-semibold"
                                        value={addProductForm?.Nutrition?.tempUnit || ""} onChange={handleFormDataChange}>
                                        <option value="Celcius">°C</option>
                                        <option value="Farenheit">°F</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* pH of Milk */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="pH" className="font-semibold">pH of Milk</label>
                            <input type="number" name="Nutrition.pH" id="pH" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                                value={addProductForm?.Nutrition?.pH || ""} onChange={handleFormDataChange} />
                        </div>
                        {/* Fat + Protein */}
                        <div className="flex w-full items-start gap-3">
                            {/* Fat */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="fat" className="font-semibold">Fat (%)</label>
                                <input type="number" name="Nutrition.fat" id="fat" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                                    value={addProductForm?.Nutrition?.fat || ""} onChange={handleFormDataChange} />
                            </div>
                            {/* Protein */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="protein" className="font-semibold">Protein (%)</label>
                                <input type="number" name="Nutrition.protein" id="protein" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                                    value={addProductForm?.Nutrition?.protein || ""} onChange={handleFormDataChange} />
                            </div>
                        </div>
                        {/* Vitamins and Minerals */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <div className="flex w-full items-start gap-3">
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="vitaminC" className="font-semibold">Vitamin C (%)</label>
                                    <input type="number" name="Nutrition.vitaminC" id="vitaminC" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.vitaminC || ""} onChange={handleFormDataChange} />
                                </div>
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="calcium" className="font-semibold">Calcium (%)</label>
                                    <input type="number" name="Nutrition.calcium" id="calcium" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.calcium || ""} onChange={handleFormDataChange} />
                                </div>
                            </div>
                            <div className="flex w-full items-start gap-3">
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="iron" className="font-semibold">Iron (%)</label>
                                    <input type="number" name="Nutrition.iron" id="iron" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.iron || ""} onChange={handleFormDataChange} />
                                </div>
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="vitaminD" className="font-semibold">Vitamin D (%)</label>
                                    <input type="number" name="Nutrition.vitaminD" id="vitaminD" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.vitaminD || ""} onChange={handleFormDataChange} />
                                </div>
                            </div>
                            <div className="flex w-full items-start gap-3">
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="vitaminB6" className="font-semibold">Vitamin B6 (%)</label>
                                    <input type="number" name="Nutrition.vitaminB6" id="vitaminB6" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.vitaminB6 || ""} onChange={handleFormDataChange} />
                                </div>
                                <div className="flex flex-col w-1/2 items-start gap-3">
                                    <label htmlFor="vitaminB12" className="font-semibold">Vitamin B12 (%)</label>
                                    <input type="number" name="Nutrition.vitaminB12" id="vitaminB12" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                        value={addProductForm?.Nutrition?.vitaminB12 || ""} onChange={handleFormDataChange} />
                                </div>
                            </div>
                            <div className="flex flex-col w-full items-start gap-3">
                                <label htmlFor="magnesium" className="font-semibold">Magnesium (%)</label>
                                <input type="number" name="Nutrition.magnesium" id="magnesium" className="border rounded-full p-3 w-full" placeholder="0.00" step="0.01"
                                    value={addProductForm?.Nutrition?.magnesium || ""} onChange={handleFormDataChange} />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8]"
                            onClick={() => router.push("/Factory/Product/CheckProductDetails")}
                        >
                            Next
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};
export default AddProduct;