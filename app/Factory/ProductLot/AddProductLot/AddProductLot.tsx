"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GeneralInfo from "@/app/Logistic/GeneralInfo/GeneralInfo";
import { fetchFactoryProducts, fetchProductDetails } from "@/services/productService";
import { fetchRetailers, fetchRetailerByID, fetchRetailerUsernames} from "@/services/retailerService";
import { getFactoryRawMilkTanks } from "@/services/rawMilkFacService";



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

interface ProductLotForm {
    GeneralInfo: {
        productName: string;
        category: string;
        description: string;
        quantity: number;
        quantityUnit: string;
    };
    selectMilkTank: string; // Change this line
    Quality: {
        temp: number;
        tempUnit: string;
        pH: number;
        fat: number;
        protein: number;
        bacteria: boolean;
        bacteriaInfo: string;
        contaminants: boolean;
        contaminantInfo: string;
        abnormalChar: boolean;
        abnormalType: {
            smellBad: boolean;
            smellNotFresh: boolean;
            abnormalColor: boolean;
            sour: boolean;
            bitter: boolean;
            cloudy: boolean;
            lumpy: boolean;
            separation: boolean;
        };
    };
    nutrition: {
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
    };
    shippingAddress: {
        companyName: string;
        firstName: string;
        lastName: string;
        email: string;
        areaCode: string;
        phoneNumber: string;
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        postalCode: string;
        location: string;
    };
}

interface StepStatus {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
}

const AddProductLot = () => {
    // for province fetching
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [milkTanks, setMilkTanks] = useState<any[]>([]);
    const [selectedMilkTanks, setSelectedMilkTanks] = useState<string[]>([]);

    const [retailers, setRetailers] = useState<any[]>([]);
    const [filteredRetailers, setFilteredRetailers] = useState<any[]>([]);
    const [showRetailerDropdown, setShowRetailerDropdown] = useState<boolean>(false);
    const [usernames, setUsernames] = useState<any[]>([]);
const [filteredUsernames, setFilteredUsernames] = useState<any[]>([]);
const [showUsernameDropdown, setShowUsernameDropdown] = useState<boolean>(false);

// ✅ ดึง Usernames เมื่อ



//ชิปปิ้งแอดเดรส//
const fetchRetailersData = async (searchQuery: string) => {
    try {
        const data = await fetchRetailers(searchQuery);
        setRetailers(data);
        setFilteredRetailers(data);
    } catch (error) {
        console.error("❌ Error fetching retailers:", error);
    }
};

const handleRetailerSearch = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value.trim();
    handleShippingAddressChange(index, event);

    if (searchText.length < 2) {
        setFilteredRetailers([]);
        setShowRetailerDropdown(false);
        return;
    }

    try {
        const data = await fetchRetailers(searchText);

        // 🟢 ใช้ฟังก์ชันกรอง
        const filtered = filterSelectedRetailers(data, index);

        setFilteredRetailers(filtered);
        setShowRetailerDropdown(filtered.length > 0);
    } catch (error) {
        console.error("❌ Error fetching retailers:", error);
    }
};

const filterSelectedRetailers = (data: any[], currentIndex: number) => {
    const selectedRetailerIds = productLotForm.shippingAddresses
        .filter((_, idx) => idx !== currentIndex) // ยกเว้นตัวเอง
        .map(address => address.retailerId);

    // กรองออก
    return data.filter(retailer => !selectedRetailerIds.includes(retailer.retailer_id));
};




const handleSelectRetailer = async (index: number, retailer: any) => {
    console.log("🟢 Selecting Retailer:", retailer.retailer_id);

    setFormData(prev => {
        const newShippingAddresses = [...prev.shippingAddresses];
        newShippingAddresses[index] = {
            ...newShippingAddresses[index],
            retailerId: retailer.retailer_id,
            companyName: retailer.company_name,
            email: retailer.email,
            phoneNumber: retailer.telephone,
            address: retailer.address,
            province: retailer.province,
            district: retailer.district,
            subDistrict: retailer.subdistrict,
            postalCode: retailer.post_code,
            location: retailer.location_link,
            firstName: "", // 🟢 เคลียร์ First Name
            lastName: "",  // 🟢 เคลียร์ Last Name
            usernames: [], // 🟢 รีเซ็ต usernames
        };
        return { ...prev, shippingAddresses: newShippingAddresses };
    });

    try {
        // ✅ ดึง Usernames ใหม่
        const usernames = await fetchRetailerUsernames(retailer.retailer_id);
        setFormData(prev => {
            const newShippingAddresses = [...prev.shippingAddresses];
            newShippingAddresses[index].usernames = usernames;
            return { ...prev, shippingAddresses: newShippingAddresses };
        });

        console.log("✅ Updated usernames:", usernames);
    } catch (error) {
        console.error("❌ Error fetching usernames:", error);
    }

    setShowRetailerDropdown(false);
};




// ✅ ค้นหา Username
const handleUsernameSearch = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value.trim();
    handleShippingAddressChange(index, event); // ✅ เซฟลง local storage

    const allUsernames = productLotForm.shippingAddresses[index]?.usernames || [];

    if (searchText.length < 2 || allUsernames.length === 0) {
        // ❗ ถ้ายังไม่มี usernames หรือยังไม่เลือก retailer
        setFilteredUsernames([]);
        setShowUsernameDropdown(false);
        return;
    }

    const filtered = allUsernames.filter(user =>
        user.first_name.toLowerCase().includes(searchText) || user.last_name.toLowerCase().includes(searchText)
    );

    setFilteredUsernames(filtered);
    setShowUsernameDropdown(true);
};



// ✅ อัปเดตค่าหลังเลือก Username
const handleSelectUsername = (index: number, user: any) => {
    setFormData(prev => {
        const updatedAddresses = [...prev.shippingAddresses];
        updatedAddresses[index] = {
            ...updatedAddresses[index],
            firstName: user.first_name, // ✅ เซ็ตค่าตรงๆ ไม่มีเงื่อนไข
            lastName: user.last_name,   // ✅ ใช้ค่า last_name ตามที่ได้มา
        };

        return { ...prev, shippingAddresses: updatedAddresses };
    });

    setShowUsernameDropdown(false);
};


//จบชิปปิ้ง///    
//ช่องนม///
    useEffect(() => {
        const fetchMilkTanks = async () => {
            try {
                const response = await getFactoryRawMilkTanks("selection"); // ✅ ต้องระบุ "selection"
                
                if (response) {
                    console.log("✅ Filtered Milk Tanks:", response); // Debugging
                    setMilkTanks(response);
                }
            } catch (error) {
                console.error("❌ Error fetching milk tanks:", error);
            }
        };
    
        fetchMilkTanks();
    }, []);
    
    

    const handleMilkTankSelection = (tankId: string) => {
        setFormData((prevData) => {
            const updatedTanks = prevData.selectMilkTank.tanks.includes(tankId)
                ? prevData.selectMilkTank.tanks.filter(id => id !== tankId) // ✅ ถ้าเลือกซ้ำให้เอาออก
                : [...prevData.selectMilkTank.tanks, tankId]; // ✅ ถ้ายังไม่เลือกให้เพิ่มเข้าไป
    
            return {
                ...prevData,
                selectMilkTank: { ...prevData.selectMilkTank, tanks: updatedTanks }
            };
        });
    };

//จบนม///

///ช่องโปรดัก////
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchFactoryProducts();
                setProducts(data);
            } catch (error) {
                console.error("❌ Error fetching factory products:", error);
            }
        };
        fetchProducts();
    }, []);
    
    
    const handleProductSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value;
        setFormData(prev => ({
            ...prev,
            GeneralInfo: {
                ...prev.GeneralInfo,
                productName: searchText
            }
        }));
    
        if (!searchText) {
            // ✅ ถ้าไม่มี searchText → แสดงสินค้าทั้งหมด
            setFilteredProducts(products);
            setShowDropdown(true);
            return;
        }
    
        const filtered = products.filter((product) =>
            product.productName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
        setShowDropdown(filtered.length > 0);
    };
    
    

    const handleSelectProduct = (product: any) => {
        setFormData(prev => ({
            ...prev,
            GeneralInfo: {
                ...prev.GeneralInfo,
                productName: product.productName,
                productId: product.productId,
                category: product.category,
                description: product.GeneralInfo?.description || "Auto-filled description",
                quantityUnit: product.Nutrition?.quantityUnit || "Ton" // ✅ ย้ายมาอยู่ที่ GeneralInfo
            }
        }));
    
        setShowDropdown(false);
    };
    
    

    
    
/////จบช่องโปรดัก///
    useEffect(() => {
        fetch("/data/geography.json")
            .then((res) => res.json())
            .then((data: GeoData[]) => {
                setGeoData(data);

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
    const [stepStatus, setStepStatus] = useState<StepStatus>({
        step1: 'in-progress',
        step2: 'not-started',
        step3: 'not-started',
        step4: 'not-started',
        step5: 'not-started',
        step6: 'not-started'
    });

    const [visibleSection, setVisibleSection] = useState<number>(1);

    const handleNextClick = (currentStep: number) => {
        const nextStep = currentStep + 1;
        setStepStatus((prevStatus) => {
            const newStatus = { ...prevStatus, [`step${currentStep}`]: 'completed' } as StepStatus;
            if (nextStep <= 6) {
                newStatus[`step${nextStep}` as keyof StepStatus] = 'in-progress';
            }
            return newStatus;
        });
        setVisibleSection(nextStep);
        setTimeout(() => {
            document.getElementById(`section${nextStep}`)?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure the section is rendered
    };
    // end step status update function

    // save form Data
    const [productLotForm, setFormData] = useState<ProductLotForm>({
        GeneralInfo: {
            productId: "",  
            productName: "",
            category: "",
            description: "",
            quantity: 0,
            quantityUnit: "Ton"
        },
        selectMilkTank: {
            tanks: []
        },
        Quality: {
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
        },
        nutrition: {
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
            magnesium: 0
        },
        // เปลี่ยนจาก shippingAddress เป็น shippingAddresses เป็น array ของ object
        shippingAddresses: [{
            retailerId: "", 
            companyName: "",
            firstName: "",
            lastName: "",
            email: "",
            areaCode: "+66",
            phoneNumber: "",
            address: "",
            province: "",
            district: "",
            subDistrict: "",
            postalCode: "",
            location: ""
        }]
    });
    

    useEffect(() => {
        const selectedProductId = productLotForm.GeneralInfo.productId; // ✅ ดึง productId จาก form
    
        if (!selectedProductId) return; // ✅ ถ้าไม่มีค่าให้หยุดทำงาน
    
        const fetchDetails = async () => {
            const productData = await fetchProductDetails(selectedProductId);
            if (productData) {
                setFormData((prevData) => ({
                    ...prevData,
                    GeneralInfo: {
                        ...prevData.GeneralInfo,
                        description: productData.GeneralInfo.description,
                        quantity: productData.GeneralInfo.quantity,
                        quantityUnit: productData.Nutrition?.quantityUnit || "Ton" // ✅ เอา quantityUnit ออกจาก Nutrition มาใส่ GeneralInfo
                    },
                    nutrition: {
                        ...prevData.nutrition,
                        calories: Number(productData.Nutrition.calories) || 0,
                        totalFat: Number(productData.Nutrition.totalFat) || 0,
                        colestoral: Number(productData.Nutrition.colestoral) || 0,
                        sodium: Number(productData.Nutrition.sodium) || 0,
                        potassium: Number(productData.Nutrition.potassium) || 0,
                        totalCarbohydrates: Number(productData.Nutrition.totalCarbohydrates) || 0,
                        fiber: Number(productData.Nutrition.fiber) || 0,
                        sugar: Number(productData.Nutrition.sugar) || 0,
                        vitaminC: Number(productData.Nutrition.vitaminC) || 0,
                        calcium: Number(productData.Nutrition.calcium) || 0,
                        iron: Number(productData.Nutrition.iron) || 0,
                        vitaminD: Number(productData.Nutrition.vitaminD) || 0,
                        vitaminB6: Number(productData.Nutrition.vitaminB6) || 0,
                        vitaminB12: Number(productData.Nutrition.vitaminB12) || 0,
                        magnesium: Number(productData.Nutrition.magnesium) || 0,
                        temp: Number(productData.Nutrition.temp) || 0,
                        tempUnit: productData.Nutrition.tempUnit || "Celcius",
                        pH: Number(productData.Nutrition.pH) || 0,
                        fat: Number(productData.Nutrition.fat) || 0,
                        protein: Number(productData.Nutrition.protein) || 0
                    }
                }));
            }
        };
        fetchDetails();
    }, [productLotForm.GeneralInfo.productId]); // ✅ ใช้ productId เป็น dependency
    
    
     
    useEffect(() => {
        productLotForm.shippingAddresses.forEach(async (address, index) => {
            if (!address.retailerId) return; // ✅ ข้ามถ้าไม่มี retailerId
    
            try {
                // ✅ ดึงข้อมูล Retailer
                const retailerData = await fetchRetailerByID(address.retailerId);
                if (retailerData) {
                    setFormData(prev => {
                        const updatedAddresses = [...prev.shippingAddresses];
                        updatedAddresses[index] = {
                            ...updatedAddresses[index],
                            companyName: retailerData.company_name,
                            email: retailerData.email,
                            phoneNumber: retailerData.telephone,
                            address: retailerData.address,
                            province: retailerData.province,
                            district: retailerData.district,
                            subDistrict: retailerData.subdistrict,
                            postalCode: updatedAddresses[index].postalCode || retailerData.post_code, // ✅ ถ้า user กรอกไว้แล้ว ไม่ overwrite
                            location: retailerData.location_link,
                        };
                        return { ...prev, shippingAddresses: updatedAddresses };
                    });
                }
    
                // ✅ ดึง Usernames ใหม่
                const usernames = await fetchRetailerUsernames(address.retailerId);
                setFormData(prev => {
                    const updatedAddresses = [...prev.shippingAddresses];
                    updatedAddresses[index].usernames = usernames;
                    return { ...prev, shippingAddresses: updatedAddresses };
                });
    
                console.log(`✅ Updated retailer & usernames for ${address.retailerId}`);
            } catch (error) {
                console.error(`❌ Error fetching data for retailer ${address.retailerId}:`, error);
            }
        });
    }, [productLotForm.shippingAddresses.map(addr => addr.retailerId).join(",")]); // ✅ ติดตาม retailerId เปลี่ยน
    
    
    // ✅ ดึง Usernames เมื่อเลือก Retailer
    useEffect(() => {
        productLotForm.shippingAddresses.forEach(async (address, index) => {
            if (!address.retailerId) return; // ✅ ถ้าไม่มี retailerId ข้ามไป
    
            try {
                const usernames = await fetchRetailerUsernames(address.retailerId);
                setFormData(prev => {
                    const newShippingAddresses = [...prev.shippingAddresses];
                    newShippingAddresses[index].usernames = usernames;
                    return { ...prev, shippingAddresses: newShippingAddresses };
                });
    
                console.log(`✅ Updated usernames for retailer ${address.retailerId}:`, usernames);
            } catch (error) {
                console.error(`❌ Error fetching usernames for retailer ${address.retailerId}:`, error);
            }
        });
    }, [productLotForm.shippingAddresses.map(addr => addr.retailerId).join(",")]); // ✅ ติดตาม retailerId เปลี่ยน
    

    
    const addShippingAddress = () => {
        console.log("📌 Before Add:", productLotForm.shippingAddresses);
    
        setFormData(prev => {
            const updatedShippingAddresses = [
                ...prev.shippingAddresses,
                {
                    retailerId: "", 
                    companyName: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    areaCode: "+66",
                    phoneNumber: "",
                    address: "",
                    province: "",
                    district: "",
                    subDistrict: "",
                    postalCode: "",
                    location: "",
                    usernames: [] // ✅ เพิ่ม usernames ในแต่ละ Shipping Address
                }
            ];
            
            console.log("✅ After Add:", updatedShippingAddresses);
    
            return { ...prev, shippingAddresses: updatedShippingAddresses };
        });
    };
    
    
    

    const handleFormDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value, checked } = event.target as HTMLInputElement;
        const keys = name.split(".");
    
        setFormData((prevData) => {
            const updatedData = { ...prevData };
            let temp: any = updatedData;
    
            // ใช้ reduce เพื่อเข้าถึง Object ซ้อนกัน
            temp = keys.slice(0, -1).reduce((obj, key) => {
                if (!obj[key]) obj[key] = {};
                return obj[key];
            }, updatedData);
    
            // ✅ ตรวจสอบว่าค่าเป็น number หรือไม่
            if (type === "number") {
                temp[keys[keys.length - 1]] = value === "" ? "" : parseFloat(value);
            } else if (type === "checkbox") {
                temp[keys[keys.length - 1]] = checked;
            } else {
                temp[keys[keys.length - 1]] = value;
            }
    
            return updatedData;
        });
    };
    


    // ฟังก์ชันสำหรับอัปเดต checkbox ที่อยู่ใน object ซ้อนกัน
    const handleNestedCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setFormData((prevData) => {
            const updatedData = { ...prevData };

            // ตรวจสอบว่า `Quality.abnormalType` มีค่าอยู่แล้วหรือไม่
            if (!updatedData.Quality) updatedData.Quality = {
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
            };
            if (!updatedData.Quality.abnormalType) updatedData.Quality.abnormalType = {
                smellBad: false,
                smellNotFresh: false,
                abnormalColor: false,
                sour: false,
                bitter: false,
                cloudy: false,
                lumpy: false,
                separation: false
            };

            const key = name.split('.').pop() as keyof typeof updatedData.Quality.abnormalType;
            updatedData.Quality.abnormalType[key] = checked;

            return updatedData;
        });
    };

    const handleShippingAddressChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prev => {
            const newShippingAddresses = [...prev.shippingAddresses];
            newShippingAddresses[index] = { ...newShippingAddresses[index], [name]: value };
            return { ...prev, shippingAddresses: newShippingAddresses };
        });
    
        // หากมีการเปลี่ยน province, district, หรือ subDistrict ให้จัดการแยกเพิ่มเติม
        if (name === "province") setSelectedProvince(value);
        if (name === "district") setSelectedDistrict(value);
        if (name === "subDistrict") setSelectedSubDistrict(value);
    };
    

    const [showAbnormalInfo, setShowAbnormalInfo] = useState(false);

    const handleAbnormalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            Quality: {
                ...prevData.Quality,
                abnormalChar: event.target.checked,
            }
        }));

        setShowAbnormalInfo(event.target.checked);
    };

    

    const saveToLocalStorage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formDataWithShipping = { ...productLotForm,  selectMilkTank: { ...productLotForm.selectMilkTank } };
        localStorage.setItem("productLotForm", JSON.stringify(formDataWithShipping));
        console.log("Saved data:", formDataWithShipping); // Debugging line
    };
    

    const router = useRouter();


    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-20">
            {/* Detail Status */}
            <div className="flex flex-col items-center w-full h-full p-10 mt-10">

                <div className="flex flex-col items-center w-full h-full border shadow-xl rounded-3xl p-10">
                    <div className="flex w-full h-full p-5 gap-8">
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
                            <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                    <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                                </svg>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 w-full' : stepStatus.step2 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 text-gray-500'}`}></div>
                            </div>
                            <p className={`text-xl font-semibold ${stepStatus.step2 === 'completed' ? 'text-black' : stepStatus.step2 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>STEP 2</p>
                            <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step2 === 'completed' ? 'text-black' : stepStatus.step2 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>Select Milk Tank</h1>
                            <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <p className="text-lg font-semibold">{stepStatus.step2 === 'completed' ? 'Completed' : stepStatus.step2 === 'in-progress' ? 'In Progress' : 'Not finish'}</p>
                            </div>
                        </div>
                        {/* Third Step */}
                        <div className="flex flex-col w-1/3 h-full">
                            <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step3 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                                </svg>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full w-0 ${stepStatus.step3 === 'completed' ? 'bg-emerald-500 w-full' : stepStatus.step3 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200'}`}></div>
                            </div>
                            <p className={`text-xl font-semibold ${stepStatus.step3 === 'completed' ? 'text-black' : stepStatus.step3 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>STEP 3</p>
                            <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step3 === 'completed' ? 'text-black' : stepStatus.step3 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>Quality</h1>
                            <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step3 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <p className="text-lg font-semibold">{stepStatus.step3 === 'completed' ? 'Completed' : stepStatus.step3 === 'in-progress' ? 'In Progress' : 'Not finish'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Second row */}
                    <div className="flex w-full h-full p-5 gap-8 mt-5">
                        {/* Sixth Step */}
                        <div className="flex flex-col w-1/3 h-full">
                            <div className="flex bg-gray-200 w-14 text-center text-gray-500 p-2 rounded-full mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                                </svg>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-emerald-600 h-2 rounded-full w-0"></div>
                            </div>
                            <p className="text-xl font-semibold text-gray-500">STEP 6</p>
                            <h1 className="text-3xl font-semibold mb-3 text-gray-500">Check Details</h1>
                            <div className="flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 bg-gray-200 text-gray-500">
                                <p className="text-lg font-semibold">Not finished</p>
                            </div>
                        </div>
                        {/* Fifth Step */}
                        <div className="flex flex-col w-1/3 h-full">
                            <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step5 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                    <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                                </svg>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${stepStatus.step5 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 w-0'}`}></div>
                            </div>
                            <p className={`text-xl font-semibold ${stepStatus.step5 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>STEP 5</p>
                            <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step5 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>Shipping</h1>
                            <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step5 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <p className="text-lg font-semibold">{stepStatus.step5 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                            </div>
                        </div>
                        {/* Fourth Step */}
                        <div className="flex flex-col w-1/3 h-full">
                            <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step4 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step4 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-full" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M8 12h8v2H8zm2 8H6V4h7v5h5v3.1l2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4zm-2-2h4.1l.9-.9V16H8zm12.2-5c.1 0 .3.1.4.2l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2m0 3.9L14.1 23H12v-2.1l6.1-6.1z" />
                                </svg>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${stepStatus.step4 === 'completed' ? 'bg-emerald-500 w-full' : stepStatus.step4 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200'}`}></div>
                            </div>
                            <p className={`text-xl font-semibold ${stepStatus.step4 === 'completed' ? 'text-black' : stepStatus.step4 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>STEP 4</p>
                            <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step4 === 'completed' ? 'text-black' : stepStatus.step4 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>Nutrition</h1>
                            <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step4 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step4 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <p className="text-lg font-semibold">{stepStatus.step4 === 'completed' ? 'Completed' : stepStatus.step4 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            {/* Form Section */}
            <form className="flex flex-col w-5/6 h-full p-20 m-10" onSubmit={saveToLocalStorage}>
                {/* General info */}
                <div id="section1" className={`flex flex-col items-center w-full h-full text-xl gap-5 ${visibleSection >= 1 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">General Information</h1>
                    {/* Product name */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="productName" className="font-semibold">Product Name</label>
                        <input
                            type="text"
                            name="GeneralInfo.productName"
                            id="productName"
                            placeholder="Enter product name"
                            className="border rounded-full p-3 w-full"
                            value={productLotForm.GeneralInfo.productName}
                            onChange={handleProductSearch} // ✅ ใช้ handleProductSearch ที่เรียก handleFormDataChange
                            onFocus={() => {
                                // ✅ เมื่อ focus → โชว์ dropdown ทั้งหมดเลย
                                setFilteredProducts(products); 
                                setShowDropdown(true); 
                            }}
                        />
                        {showDropdown && (
                            <ul className="absolute w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <li
                                        key={product.productId}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSelectProduct(product)}
                                    >
                                        {product.productName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Category */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="category" className="font-semibold">Category</label>
                        <input type="text" id="category"
                            placeholder="Enter category" className="border rounded-full p-3 w-full"
                            name="RecipientInfo.category" value={productLotForm.GeneralInfo.category} onChange={handleFormDataChange}
                        />
                    </div>
                    {/* Description */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="description" className="font-semibold">Description</label>
                        <input type="text" id="description" placeholder="Write description" className="border rounded-full p-3 w-full"
                            name="RecipientInfo.description" value={productLotForm.GeneralInfo.description} onChange={handleFormDataChange}
                        />
                    </div>
                    {/* Quauntity per unit */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="quantity" className="font-semibold">Quantity per unit</label>
                        <div className="flex gap-3 w-full items-center">
                            <input type="number" name="RecipientInfo.quantity" className="border rounded-full w-5/6 p-3" placeholder="0.00" step={0.01}
                                value={productLotForm.GeneralInfo.quantity} onChange={handleFormDataChange}
                            />
                            <select name="GeneralInfo.quantityUnit" id="Unit" className="border rounded-full p-3 w-1/6 font-semibold text-center"
                                value={productLotForm.GeneralInfo.quantityUnit} onChange={handleFormDataChange}
                            >
                                <option value="Liter">Liter</option>
                                <option value="Milliliter">Milliliter</option>
                                <option value="Gallon">Gallon</option>
                                <option value="cc">cc</option>
                                <option value="ton">Ton</option>
                                <option value="Ounce">Ounce</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8] ${stepStatus.step1 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(1)}
                    >
                        Next
                    </button>
                </div>

                {/* Select Milk Tank Section */}
                {/* Select Milk Tank */}
                <div id="section2" className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 2 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Select Milk Tank</h1>

                    {/* ✅ Drop-down เลือกแท็งก์ */}
                    <select 
                        name="milkTank" 
                        id="milkTank" 
                        className="border rounded-full p-3 w-1/2 text-center"
                        value="" 
                        onChange={(e) => handleMilkTankSelection(e.target.value)}
                    >
                        <option value="">Select a Milk Tank</option>
                        {milkTanks.map((tank) => (
                            <option key={tank.tankId} value={tank.tankId}>
                                {tank.tankId} ({tank.quantity})
                            </option>
                        ))}
                    </select>

                    {/* ✅ แสดงแท็งก์นมแบบกล่องคลิกได้ */}
                    {milkTanks.map((tank) => (
                        <div 
                            key={tank.tankId}
                            onClick={() => handleMilkTankSelection(tank.tankId)} 
                            className={`cursor-pointer flex flex-col justify-center items-center w-1/2 h-fit gap-5 p-5 border rounded-2xl shadow-xl 
                                ${productLotForm.selectMilkTank.tanks.includes(tank.tankId) ? "bg-[#C2CC8D] text-[#52600A] border-[#52600A]" : "bg-white text-slate-500"}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <span className="text-xl md:text-2xl font-semibold">Milk Tank No: 
                                    <p className="font-normal inline">{tank.tankId}</p>
                                </span>
                                <span className="text-xl md:text-2xl font-semibold">Quantity: 
                                    <p className="font-normal inline">{tank.quantity}</p>
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <span className="text-xl md:text-2xl font-semibold">Farm Name: 
                                    <p className="inline font-normal">{tank.farmName}</p>
                                </span>
                                <span className="text-xl md:text-2xl font-semibold">Temperature: 
                                    <p className="inline font-normal">{tank.temperature}</p>
                                </span>
                            </div>
                            <div className="flex flex-col justify-center items-start w-full">
                                <span className="text-xl md:text-2xl font-semibold">Location: 
                                    <p className="inline font-normal">{tank.location}</p>
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* ✅ ปุ่ม Next */}
                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8] ${stepStatus.step2 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(2)}
                    >
                        Next
                    </button>
                </div>



                {/* Quality */}
                <div id="section3" className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 3 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Quality</h1>
                    {/* Temperature */}
                    <div className="flex w-full items-start gap-3">
                        {/* Temperature */}
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="temp" className="font-semibold">Temperature</label>
                            <div className="flex w-full items-start gap-3">
                                <input type="number" name="Quality.temp" id="temp" className="p-3 rounded-full border w-4/5" placeholder="0.00" step="0.01"
                                    value={productLotForm?.Quality?.temp} onChange={handleFormDataChange} />
                                <select name="Quality.tempUnit" id="tempUnit" className="border rounded-full p-3 w-1/5 font-semibold"
                                    value={productLotForm?.Quality?.tempUnit} onChange={handleFormDataChange}>
                                    <option value="Celcius">°C</option>
                                    <option value="Farenheit">°F</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* pH of Milk */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="pH" className="font-semibold">pH of Milk</label>
                        <input type="number" name="Quality.pH" id="pH" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                            value={productLotForm?.Quality?.pH} onChange={handleFormDataChange} />
                    </div>
                    {/* Fat + Protein */}
                    <div className="flex w-full items-start gap-3">
                        {/* Fat */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="fat" className="font-semibold">Fat (%)</label>
                            <input type="number" name="Quality.fat" id="fat" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                                value={productLotForm?.Quality?.fat} onChange={handleFormDataChange} />
                        </div>
                        {/* Protein */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="protein" className="font-semibold">Protein (%)</label>
                            <input type="number" name="Quality.protein" id="protein" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                                value={productLotForm?.Quality?.protein} onChange={handleFormDataChange} />
                        </div>
                    </div>
                    {/* bacteria testing */}
                    <div className="flex flex-col w-full justify-center gap-3">
                        <div className="flex w-full items-center gap-3">
                            <input
                                type="checkbox"
                                name="Quality.bacteria"
                                id="bacteria"
                                className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"
                                onChange={handleFormDataChange}
                                checked={productLotForm?.Quality?.bacteria}
                            />
                            <label htmlFor="bacteria" className="font-semibold">Bacteria Testing</label>
                        </div>
                        {productLotForm?.Quality?.bacteria && (
                            <input
                                type="text"
                                name="Quality.bacteriaInfo"
                                id="bacteriaInfo"
                                className="border rounded-full p-3"
                                placeholder="Please fill additional information"
                                value={productLotForm?.Quality?.bacteriaInfo}
                                onChange={handleFormDataChange}
                            />
                        )}
                    </div>
                    {/* Contaminants */}
                    <div className="flex flex-col w-full justify-center gap-3">
                        <div className="flex w-full items-center gap-3">
                            <input
                                type="checkbox"
                                name="Quality.contaminants"
                                id="Quality.contaminants"
                                className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"
                                onChange={handleFormDataChange}
                                checked={productLotForm?.Quality?.contaminants}
                            />
                            <label htmlFor="contaminants" className="font-semibold">Contaminants</label>
                        </div>
                        {productLotForm?.Quality?.contaminants && (
                            <input
                                type="text"
                                name="Quality.contaminantInfo"
                                id="Quality.contaminantInfo"
                                className="border rounded-full p-3"
                                placeholder="Please fill additional information"
                                value={productLotForm?.Quality?.contaminantInfo}
                                onChange={handleFormDataChange}
                            />
                        )}
                    </div>
                    {/* Abnormal Characteristic */}
                    <div className="flex flex-col w-full justify-center items-start gap-3">
                        <div className="flex w-full items-center gap-3">
                            <input
                                type="checkbox"
                                name="Quality.abnormalChar"
                                id="abnormalChar"
                                className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"
                                onChange={handleAbnormalChange}
                                checked={productLotForm?.Quality?.abnormalChar}
                            />
                            <label htmlFor="abnormalChar" className="font-semibold">Abnormal Characteristic</label>
                        </div>
                        {showAbnormalInfo && (
                            <div className="flex flex-col w-full items-center gap-3 px-8">
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.smellBad" id="smellBad" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.smellBad} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="smellBad" className="font-semibold">Smell Bad</label>
                                </div>
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.smellNotFresh" id="smellNotFresh" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.smellNotFresh} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="smellNotFresh" className="font-semibold">Smell not fresh</label>
                                </div>
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.abnormalColor" id="abnormalColor" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.abnormalColor} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="abnormalColor" className="font-semibold">Abnormal Color</label>
                                    <p className="text-gray-500">ex. yellow or green</p>
                                </div>
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.sour" id="sour" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.sour} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="sour" className="font-semibold">Sour taste</label>
                                </div>
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.bitter" id="bitter" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.bitter} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="bitter" className="font-semibold">Bitter taste</label>
                                </div>
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.cloudy" id="cloudy" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.cloudy} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="cloudy" className="font-semibold">Cloudy Appearance</label>
                                </div>
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.lumpy" id="lumpy" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.lumpy} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="lumpy" className="font-semibold">Lumpy Appearance</label>
                                </div>
                                <div className="flex w-full items-center gap-3">
                                    <input type="checkbox" name="Quality.abnormalType.separation" id="separation" className="border w-4 h-4"
                                        checked={productLotForm?.Quality?.abnormalType?.separation} onChange={handleNestedCheckboxChange} />
                                    <label htmlFor="separation" className="font-semibold">Separation between water and fat</label>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8] ${stepStatus.step3 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(3)}
                    >
                        Next
                    </button>
                </div>

                {/* Nutrition */}
                <div id="section4" ref={shippingAddressRef} className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 4 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Nutrition</h1>
                    {/* Calories */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="calories" className="font-semibold">Calories per 100 grams  </label>
                        <input type="number" name="nutrition.calories" id="calories" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.calories} onChange={handleFormDataChange}/>                    </div>
                    {/* Total Fat */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="totalFat" className="font-semibold">Total Fat (g)</label>
                        <input type="number" name="nutrition.totalFat" id="totalFat" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.totalFat} onChange={handleFormDataChange}/>                        
                    </div>
                    {/* Colestoral */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="colestoral" className="font-semibold">Colestoral (mg)</label>
                        <input type="number" name="nutrition.colestoral" id="colestoral" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.colestoral} onChange={handleFormDataChange}/>                        
                    </div>
                    {/* Sodium */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="sodium" className="font-semibold">Sodium (mg)</label>
                        <input type="number" name="nutrition.sodium" id="sodium" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.sodium} onChange={handleFormDataChange}/>                        
                    </div>
                    {/* Potassium */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="potassium" className="font-semibold">Potassium (mg)</label>
                        <input type="number" name="nutrition.potassium" id="potassium" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.potassium} onChange={handleFormDataChange}/>                        
                    </div>
                    {/* Total Carbohydrates */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="totalCarbohydrates" className="font-semibold">Total Carbohydrates (g)</label>
                        <input type="number" name="nutrition.totalCarbohydrates" id="totalCarbohydrates" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.totalCarbohydrates} onChange={handleFormDataChange}/>                        
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="fiber" className="font-semibold" >Dietary Fiber (g)</label>
                                <input type="number" name="nutrition.fiber" id="fiber" className="border rounded-full w-full p-3" placeholder="0.00" step="0.01" value={productLotForm.nutrition.fiber} onChange={handleFormDataChange}/>                                
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="sugar" className="font-semibold">Sugar (g)</label>
                                <input type="number" name="nutrition.sugar" id="sugar" className="border rounded-full w-full p-3" placeholder="0.00" step="0.01" value={productLotForm.nutrition.sugar} onChange={handleFormDataChange}/>                                
                            </div>
                        </div>
                    </div>
                    {/*temperature */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="temp" className="font-semibold">Temperature</label>
                        <div className="flex w-full items-start gap-3">
                        <input type="number" name="nutrition.temp" id="temp" className="border p-3 rounded-full borcder w-4/5" placeholder="0.00" step="0.01" value={productLotForm.nutrition.temp} onChange={handleFormDataChange}/>                            
                        <select name="nutrition.tempUnit" id="tempUnit" className="border rounded-full p-3 w-1/6 font-semibold" value={productLotForm.nutrition.tempUnit} onChange={handleFormDataChange}>
                            <option value="Celcius">°C</option>
                            <option value="Farenheit">°F</option>
                        </select>
                        </div>
                    </div>
                    {/* pH of Milk */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="pH" className="font-semibold">pH of Milk</label>
                        <input type="number" name="nutrition.pH" id="pH" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.pH} onChange={handleFormDataChange}/>                        
                    </div>
                    {/* Fat + Protein */}
                    <div className="flex w-full items-start gap-3">
                        {/* Fat */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="fat" className="font-semibold">Fat (%)</label>
                            <input type="number" name="nutrition.fat" id="fat" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01" value={productLotForm.nutrition.fat} onChange={handleFormDataChange}/>                            
                        </div>
                        {/* Protein */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="protein" className="font-semibold">Protein (%)</label>
                            <input type="number" name="nutrition.protein" id="protein" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01" value={productLotForm.nutrition.protein} onChange={handleFormDataChange}/>                            
                        </div>
                    </div>
                    {/* Vitamins and Minerals */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminC" className="font-semibold">Vitamin C (%)</label>
                                <input type="number" name="nutrition.vitaminC" id="vitaminC" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.vitaminC} onChange={handleFormDataChange}/>                                
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="calcium" className="font-semibold">Calcium (%)</label>
                                <input type="number" name="nutrition.calcium" id="calcium" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.calcium} onChange={handleFormDataChange}/>                                
                            </div>
                        </div>
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="iron" className="font-semibold">Iron (%)</label>
                                <input type="number" name="nutrition.iron" id="iron" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.iron} onChange={handleFormDataChange}/>                                
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminD" className="font-semibold">Vitamin D (%)</label>
                                <input type="number" name="nutrition.vitaminD" id="vitaminD" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.vitaminD} onChange={handleFormDataChange}/>                                
                            </div>
                        </div>
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminB6" className="font-semibold">Vitamin B6 (%)</label>
                                <input type="number" name="nutrition.vitaminB6" id="vitaminB6" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.vitaminB6} onChange={handleFormDataChange}/>                                
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminB12" className="font-semibold">Vitamin B12 (%)</label>
                                <input type="number" name="nutrition.vitaminB12" id="vitaminB12" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.vitaminB12} onChange={handleFormDataChange}/>                                
                            </div>
                        </div>
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="magnesium" className="font-semibold">Magnesium (%)</label>
                            <input type="number" name="nutrition.magnesium" id="magnesium" className="border rounded-full p-3 w-full" placeholder="0.00" step="0.01" value={productLotForm.nutrition.magnesium} onChange={handleFormDataChange}/>                            
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8] ${stepStatus.step4 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(4)}
                    >
                        Next
                    </button>
                </div>

                {/* Shipping Address section */}
                <div id="section5" ref={shippingAddressRef} className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 5 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Shipping Address</h1>
                    {productLotForm.shippingAddresses.length > 0 && productLotForm.shippingAddresses.map((address, index) => (
                        <div key={index} className="flex flex-col w-full gap-8 mt-10">
                            {/* Company Name */}
                            <div className="flex flex-col w-full gap-5">
                                <label htmlFor={`companyName-${index}`} className="font-semibold">Company Name</label>
                                <input type="text" name="companyName" id={`companyName-${index}`} className="border p-3 rounded-full" placeholder="Enter your company name"
                                    value={address.companyName}  onChange={(e) => handleRetailerSearch(index, e)} onFocus={async () => {
                                        let data = retailers;
                                    
                                        if (retailers.length === 0) {
                                            const fetched = await fetchRetailers(""); // ดึงทั้งหมด
                                            setRetailers(fetched);
                                            data = fetched;
                                        }
                                    
                                        // 🟢 กรองก่อนโชว์
                                        const filtered = filterSelectedRetailers(data, index);
                                        setFilteredRetailers(filtered);
                                        setShowRetailerDropdown(filtered.length > 0);
                                    }}
                                    />

                                {/* ✅ Dropdown แสดงรายการ */}
    {showRetailerDropdown && (
        <ul className="absolute w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredRetailers.map((retailer) => (
                <li
                    key={retailer.retailer_id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectRetailer(index, retailer)}
                >
                    {retailer.company_name}
                </li>
            ))}
        </ul>
    )}
                            </div>
                            {/* First name + Last name */}
<div className="flex items-center w-full gap-5">
    <div className="flex flex-col w-1/2 gap-3 relative">
        <label htmlFor={`firstName-${index}`} className="font-semibold">First Name</label>
        <input 
            type="text" 
            name="firstName" 
            id={`firstName-${index}`} 
            className="border p-3 rounded-full" 
            placeholder="Enter first name"
            value={address.firstName} 
            onChange={(e) => handleUsernameSearch(index, e)}
            onFocus={() => {
                const allUsernames = productLotForm.shippingAddresses[index]?.usernames || [];
                    if (allUsernames.length > 0) {
                    setFilteredUsernames(allUsernames);  // ✅ ใช้ข้อมูล usernames ที่โหลดไว้แล้ว
                    setShowUsernameDropdown(true);
                }
            }}
        />
        
        {/* Dropdown Results */}
        {showUsernameDropdown && filteredUsernames.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 z-50">
                {filteredUsernames.map((user, idx) => (
                    <li
                        key={idx}
                        className="p-3 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelectUsername(index, user)}
                    >
                        {user.first_name} {user.last_name}
                    </li>
                ))}
            </ul>
        )}
    </div>

    <div className="flex flex-col w-1/2 gap-3">
        <label htmlFor={`lastName-${index}`} className="font-semibold">Last Name</label>
        <input 
            type="text" 
            name="lastName" 
            id={`lastName-${index}`} 
            className="border p-3 rounded-full" 
            placeholder="Enter last name"
            value={address.lastName} 
            onChange={(e) => handleShippingAddressChange(index, e)}
        />
    </div>
</div>

                            {/* Email */}
                            <div className="flex flex-col w-full gap-3">
                                <label htmlFor={`email-${index}`} className="font-semibold">Email</label>
                                <input type="text" name="email" id={`email-${index}`} className="border p-3 rounded-full" placeholder="Enter your Email"
                                    value={address.email} onChange={(e) => handleShippingAddressChange(index, e)} />
                            </div>
                            {/* Phone Number */}
                            <div className="flex flex-col w-full text-start gap-3">
                                <label htmlFor={`phoneNumber-${index}`} className="font-semibold">Phone Number</label>
                                <div className="flex flex-row gap-3">
                                    {/* Area Code */}
                                    <div className="flex flex-col">
                                        <label htmlFor={`areaCode-${index}`} className="sr-only">Area Code</label>
                                        <select
                                            name="areaCode"
                                            id={`areaCode-${index}`}
                                            className="border border-gray-300 rounded-full p-3 w-auto text-center"
                                            value={address.areaCode} onChange={(e) => handleShippingAddressChange(index, e)}
                                        >
                                            <option value="+66">+66</option>
                                        </select>
                                    </div>
                                    {/* Phone Input */}
                                    <input
                                        type="tel"
                                        id={`phoneNumber-${index}`}
                                        name="phoneNumber"
                                        className="border border-gray-300 rounded-full p-3 flex-1 w-10/12"
                                        placeholder="Enter your phone number"
                                        value={address.phoneNumber} onChange={(e) => handleShippingAddressChange(index, e)}
                                    />
                                </div>
                            </div>
                            {/* Address */}
                            <div className="flex flex-col text-start font-medium w-full h-40 gap-3">
                                <label htmlFor={`address-${index}`}>Address</label>
                                <textarea name="address" id={`address-${index}`} className="border border-gray-300 rounded-3xl p-3 flex-1 w-full"
                                    value={address.address} onChange={(e) => handleShippingAddressChange(index, e)}></textarea>
                            </div>
                            {/* Province */}
                            <div className="flex flex-col w-full text-start gap-3">
                                <label htmlFor={`province-${index}`} className="font-semibold">Province</label>
                                <select name="province" id={`province-${index}`} className="border border-gray-300 rounded-full p-3 text-center"
                                    value={address.province} onChange={(e) => handleShippingAddressChange(index, e)}>
                                    <option value="">Select province</option>
                                    {provinceList.map((prov, idx) => (
                                        <option key={idx} value={prov}>
                                            {prov}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* District + Sub-District */}
                            <div className="flex flex-row w-full gap-4">
                                <div className="flex flex-col text-start w-6/12 gap-3">
                                    <label htmlFor={`district-${index}`} className="font-semibold">District</label>
                                    <select name="district" id={`district-${index}`} className="border border-gray-300 rounded-full p-3 text-center"
                                        value={address.district} onChange={(e) => handleShippingAddressChange(index, e)} disabled={!address.province}>
                                        <option value="">Select district</option>
                                        {districtList.map((dist, idx) => (
                                            <option key={idx} value={dist}>
                                                {dist}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col text-start w-6/12 gap-3">
                                    <label htmlFor={`subDistrict-${index}`} className="font-semibold">Sub-District</label>
                                    <select name="subDistrict" id={`subDistrict-${index}`} className="border border-gray-300 rounded-full p-3 text-center"
                                        value={address.subDistrict} onChange={(e) => handleShippingAddressChange(index, e)} disabled={!address.district}>
                                        <option value="">Select sub-district</option>
                                        {subDistrictList.map((subDist, idx) => (
                                            <option key={idx} value={subDist}>
                                                {subDist}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Zip/Postal Code */}
                            <div className="flex flex-col text-start w-full gap-3">
                                <label htmlFor={`postalCode-${index}`} className="font-semibold">Zip/Postal Code</label>
                                <input type="text" name="postalCode" id={`postalCode-${index}`} className="border border-gray-300 rounded-full p-3 w-full" placeholder="Enter postal code"
                                    value={address.postalCode} onChange={(e) => handleShippingAddressChange(index, e)} />
                            </div>
                            {/* Location */}
                            <div className="flex flex-col text-start w-full gap-3">
                                <label htmlFor={`location-${index}`} className="font-semibold">Location</label>
                                <input type="text" name="location" id={`location-${index}`} className="border border-gray-300 rounded-full p-3 flex-1 w-full"
                                    placeholder="Paste location url" value={address.location} onChange={(e) => handleShippingAddressChange(index, e)} />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="underline hover:text-[#52600A]" onClick={addShippingAddress}>+ Add more shipping address</button>
                    <button
                        type="submit"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8]`}
                        onClick={() => {
                            const formDataWithShipping = { ...productLotForm };
                            localStorage.setItem("productLotForm", JSON.stringify(formDataWithShipping));
                            console.log("Navigating with data:", formDataWithShipping); // Debugging line
                            router.push('/Factory/ProductLot/CheckDetails');
                        }}
                    >
                        Next
                    </button>
                </div>
            </form>
        </div >
    );
};
export default AddProductLot;