"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProductLot } from "@/services/productlotService";


interface Quality {
    temp?: string;
    tempUnit?: string;
    pH?: string;
    fat?: string;
    protein?: string;
    bacteria?: boolean;
    bacteriaInfo?: string;
    contaminants?: boolean;
    contaminantInfo?: string;
    abnormalChar?: boolean;
    abnormalType?: {
        smellBad?: boolean;
        smellNotFresh?: boolean;
        abnormalColor?: boolean;
        sour?: boolean;
        bitter?: boolean;
        cloudy?: boolean;
        lumpy?: boolean;
        separation?: boolean;
    };
}

interface GeneralInfo {
    productName?: string;
    category?: string;
    description?: string;
    quantity?: string;
    quantityUnit?: string;
}

interface Nutrition {
    calories?: string;
    totalFat?: string;
    cholesterol?: string;
    sodium?: string;
    potassium?: string;
    totalCarbohydrates?: string;
    fiber?: string;
    sugar?: string;
    vitaminC?: string;
    calcium?: string;
    iron?: string;
    vitaminD?: string;
    vitaminB6?: string;
    vitaminB12?: string;
    magnesium?: string;
}

interface ShippingAddress {
    companyName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    areaCode?: string;
    phoneNumber?: string;
    address?: string;
    province?: string;
    district?: string;
    subDistrict?: string;
    postalCode?: string;
    location?: string;
}

interface Data {
    GeneralInfo: GeneralInfo;
    selectMilkTank: Record<string, unknown>;
    Quality: Quality;
    nutrition: Nutrition;
    shippingAddresses: ShippingAddress[];
}

interface StepStatus {
    [key: string]: 'completed' | 'in-progress' | 'not-started';
}

const CheckDetails = () => {
    const router = useRouter();
    const [data, setData] = useState<Data>({
        GeneralInfo: {},
        selectMilkTank: {},
        Quality: {},
        nutrition: {},
        shippingAddresses: []
    });

    useEffect(() => {
        const storedData = localStorage.getItem("productLotForm");
        if (storedData) {
            const parsedData: Data = JSON.parse(storedData);
            console.log("Retrieved data:", parsedData); // Debugging line
            setData(parsedData);
        }
    }, []);

    const handleSubmit = async () => {
        try {
            // ✅ เตรียมข้อมูลสำหรับ API
            const requestData = {
                productId: data.GeneralInfo.productId,
                grade: true,  // สมมติให้ Grade เป็น true (ปรับตามเงื่อนไขจริง)
                milkTankIds: data.selectMilkTank.tanks || [],
                qualityData: {
                    quality: data.Quality,
                    nutrition: data.nutrition,
                },
                shippingAddresses: data.shippingAddresses || [], // ✅ เพิ่ม Shipping Addresses
            };
    
            console.log("📌 Sending data to Backend:", JSON.stringify(requestData, null, 2)); // Debugging log
    
            // ✅ เรียก API
            const response = await createProductLot(requestData);
    
            if (response.success) {
                alert("Product Lot Created Successfully!");
    
                // ✅ ส่งไปที่หน้ารายละเอียด พร้อม `lotId` และ `productId`
                router.push(`/Factory/ProductLot/Details?lotId=${response.lotId}`);
            } else {
                alert(`Error: ${response.message}`);
            }
        } catch (error) {
            alert("An unexpected error occurred.");
        }
    };
    
    

    // Step status update function
    const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
    const shippingAddressRef = useRef<HTMLDivElement>(null);
    const [stepStatus, setStepStatus] = useState<StepStatus>({
        step1: 'completed',
        step2: 'completed',
        step3: 'completed',
        step4: 'completed',
        step5: 'completed',
        step6: 'in-progress'
    });

    const [visibleSection, setVisibleSection] = useState<number>(1);

    const handleNextClick = (currentStep: number) => {
        const nextStep = currentStep + 1;
        setStepStatus((prevStatus) => {
            const newStatus: StepStatus = { ...prevStatus, [`step${currentStep}`]: 'completed' };
            if (nextStep <= 6) {
                newStatus[`step${nextStep}`] = 'in-progress';
            }
            return newStatus;
        });
        setVisibleSection(nextStep);
        setTimeout(() => {
            document.getElementById(`section${nextStep}`)?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure the section is rendered
    };

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100 text-black">
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
                            <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step6 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step6 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                                </svg>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${stepStatus.step6 === 'completed' ? 'bg-emerald-500 w-full' : stepStatus.step6 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200'}`}></div>
                            </div>
                            <p className={`text-xl font-semibold ${stepStatus.step6 === 'completed' ? 'text-black' : stepStatus.step6 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>STEP 6</p>
                            <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step6 === 'completed' ? 'text-black' : stepStatus.step6 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>Check Details</h1>
                            <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step6 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step6 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                                <p className="text-lg font-semibold">{stepStatus.step6 === 'completed' ? 'Completed' : stepStatus.step6 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                            </div>
                        </div>
                        {/* Fifth Step */}
                        <div className="flex flex-col w-1/3 h-full">
                            <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step5 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                    <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                                </svg>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${stepStatus.step5 === 'completed' ? 'bg-emerald-500 w-full' : 'bg-yellow-500 w-1/4'}`}></div>
                            </div>
                            <p className={`text-xl font-semibold ${stepStatus.step5 === 'completed' ? 'text-black' : 'text-gray-500'}`}>STEP 5</p>
                            <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step5 === 'completed' ? 'text-black' : 'text-gray-500'}`}>Shipping</h1>
                            <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step5 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                                <p className="text-lg font-semibold">{stepStatus.step5 === 'completed' ? 'Completed' : 'In progress'}</p>
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

            <h1 className="text-5xl font-bold mt-10 text-black">Product Lot Check Detail</h1>
            {data && (
                <div className="flex flex-col gap-10 w-full p-4 md:p-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* General Information */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">General Information</h1>
                            <div className="flex flex-col space-y-2 gap-3">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Product Name:</p>
                                    <p>{data.GeneralInfo.productName}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Category:</p>
                                    <p>{data.GeneralInfo.category}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Description:</p>
                                    <p>{data.GeneralInfo.description}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Quantity Per Unit:</p>
                                    <p>{data.GeneralInfo.quantity} {data.GeneralInfo.quantityUnit}</p>
                                </div>
                            </div>
                        </div>

                        {/* Select Milk Tank */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">Select Milk Tank</h1>
                            
                            {/* ✅ ตรวจสอบว่ามีค่าใน tanks ก่อน render */}
                            {data?.selectMilkTank?.tanks && data.selectMilkTank.tanks.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {data.selectMilkTank.tanks.map((tank: string, index: number) => (
                                        <div key={index} className="p-4 border rounded-xl shadow-md text-center bg-gray-100">
                                            <p className="font-semibold text-black">{tank}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No milk tanks selected</p>
                            )}
                        </div>



                        {/* Quality */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">Quality</h1>
                            <div className="flex flex-col space-y-2 gap-3">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Temperature:</p>
                                    <p>{data.Quality.temp} {data.Quality.tempUnit}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">pH:</p>
                                    <p>{data.Quality.pH}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Fat:</p>
                                    <p>{data.Quality.fat} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Protein:</p>
                                    <p>{data.Quality.protein} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Bacteria:</p>
                                    <p>{data.Quality.bacteria ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Bacteria Info:</p>
                                    <p>{data.Quality.bacteriaInfo}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Contaminants:</p>
                                    <p>{data.Quality.contaminants ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Contaminant Info:</p>
                                    <p>{data.Quality.contaminantInfo}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Abnormal Characteristic:</p>
                                    <p>{data.Quality.abnormalChar ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <p className="font-semibold">Abnormal Type:</p>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Smell Bad:</p>
                                        <p>{data.Quality.abnormalType?.smellBad ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Smell Not Fresh:</p>
                                        <p>{data.Quality.abnormalType?.smellNotFresh ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Abnormal Color:</p>
                                        <p>{data.Quality.abnormalType?.abnormalColor ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Sour:</p>
                                        <p>{data.Quality.abnormalType?.sour ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Bitter:</p>
                                        <p>{data.Quality.abnormalType?.bitter ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Cloudy:</p>
                                        <p>{data.Quality.abnormalType?.cloudy ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Lumpy:</p>
                                        <p>{data.Quality.abnormalType?.lumpy ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Separation:</p>
                                        <p>{data.Quality.abnormalType?.separation ? "Yes" : "No"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nutrition */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">Nutrition</h1>
                            <div className="flex flex-col space-y-2 gap-3">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Calories:</p>
                                    <p>{data.nutrition.calories}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Total Fat:</p>
                                    <p>{data.nutrition.totalFat} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Cholesterol:</p>
                                    <p>{data.nutrition.cholesterol} mg</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Sodium:</p>
                                    <p>{data.nutrition.sodium} mg</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Potassium:</p>
                                    <p>{data.nutrition.potassium} mg</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Total Carbohydrates:</p>
                                    <p>{data.nutrition.totalCarbohydrates} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Fiber:</p>
                                    <p>{data.nutrition.fiber} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Sugar:</p>
                                    <p>{data.nutrition.sugar} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin C:</p>
                                    <p>{data.nutrition.vitaminC} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Calcium:</p>
                                    <p>{data.nutrition.calcium} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Iron:</p>
                                    <p>{data.nutrition.iron} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin D:</p>
                                    <p>{data.nutrition.vitaminD} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin B6:</p>
                                    <p>{data.nutrition.vitaminB6} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin B12:</p>
                                    <p>{data.nutrition.vitaminB12} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Magnesium:</p>
                                    <p>{data.nutrition.magnesium} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">pH Level:</p>
                                    <p>{data.nutrition.pH}</p>
                                </div>
                                    <div className="flex justify-between">
                                    <p className="font-semibold">Fat:</p>
                                    <p>{data.nutrition.fat} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Protein:</p>
                                    <p>{data.nutrition.protein} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Temperature:</p>
                                    <p>{data.nutrition.temp} {data.nutrition.tempUnit}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {data.shippingAddresses && data.shippingAddresses.length > 0 ? (
                            data.shippingAddresses.map((address, index) => (
                                <div key={index} className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                                    <h1 className="text-xl md:text-3xl font-bold text-center text-black">Shipping Address {index + 1}</h1>
                                    <div className="flex flex-col space-y-2 gap-3">
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Company Name:</p>
                                            <p>{address.companyName}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">First Name:</p>
                                            <p>{address.firstName}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Last Name:</p>
                                            <p>{address.lastName}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Email:</p>
                                            <p>{address.email}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Phone Number:</p>
                                            <p>{address.areaCode} {address.phoneNumber}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Address:</p>
                                            <p>{address.address}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Province:</p>
                                            <p>{address.province}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">District:</p>
                                            <p>{address.district}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Sub-District:</p>
                                            <p>{address.subDistrict}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Postal Code:</p>
                                            <p>{address.postalCode}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Location:</p>
                                            <p>{address.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                                <h1 className="text-xl md:text-3xl font-bold text-center text-black">Shipping Address</h1>
                                <p>No shipping addresses available.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <button className="bg-emerald-500 text-white font-semibold text-xl rounded-full p-3 self-end mx-20 mb-10" onClick={handleSubmit}>Submit</button>
        </div>
    );
};
export default CheckDetails;