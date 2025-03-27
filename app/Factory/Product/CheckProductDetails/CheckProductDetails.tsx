"use client";
export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createProduct } from "@/services/productService"; // ✅ Import API Service

interface GeneralInfo {
    productName: string;
    category: string;
    description: string;
    quantity: string;
}

interface Nutrition {
    quantity: string;
    quantityUnit: string;
    temp: string;
    tempUnit: string;
    pH: string;
    fat: string;
    protein: string;
    calories: string;
    totalFat: string;
    cholesterol: string;
    sodium: string;
    potassium: string;
    totalCarbohydrates: string;
    fiber: string;
    sugar: string;
    vitaminC: string;
    calcium: string;
    iron: string;
    vitaminD: string;
    vitaminB6: string;
    vitaminB12: string;
    magnesium: string;
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
}

interface ProductData {
    GeneralInfo: GeneralInfo;
    Nutrition: Nutrition;
}

const CheckProductDetails = () => {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("addProductForm"); // ✅ เปลี่ยนจาก receivedForm → addProductForm
        if (storedData) {
            try {
                setData(JSON.parse(storedData));
            } catch (error) {
                console.error("Error parsing stored data:", error);
                setData(null);
            }
        }
    }, []);
    

    // ✅ จัดการ Step Status ของหน้า UI
    const shippingAddressRef = useRef<HTMLDivElement>(null);
    const [showShippingAddress, setShowShippingAddress] = useState(false);
    const [stepStatus, setStepStatus] = useState({
        step1: "completed",
        step2: "completed",
        step3: "in-progress",
    });

    const handleNextClick = () => {
        setShowShippingAddress(true);
        setStepStatus({
            step1: "completed",
            step2: "in-progress",
            step3: "not-started",
        });

        setTimeout(() => {
            shippingAddressRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // ✅ ฟังก์ชัน Submit เพื่อสร้าง Product บน Blockchain
    const handleSubmit = async () => {
        if (!data) {
            alert("No data available to submit.");
            return;
        }

        try {
            // ✅ ส่งข้อมูลไป Backend ผ่าน Service
            const response = await createProduct(data);

            if (response.success) {
                alert("Product Created Successfully!");
                router.push(`/Factory/Product/Details?productId=${response.productId}`);
            } else {
                alert(`Error: ${response.message}`);
            }
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Failed to create product. Please try again.");
        }
    };

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
                        <p className="text-xl font-semibold text-black">STEP 1</p>
                        <h1 className="text-3xl font-semibold mb-3 text-black">General Info</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-black'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step1 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Second Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-black'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 w-full' : 'bg-gray-200 w-0'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold text-black`}>STEP 2</p>
                        <h1 className={`text-3xl font-semibold mb-3 text-black`}>Nutrition</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-black'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step2 === 'completed' ? 'Completed' : 'Not finished'}</p>
                        </div>
                    </div>
                    {/* Third Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-black'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 w-0'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold text-black`}>STEP 3</p>
                        <h1 className={`text-3xl font-semibold mb-3 text-black`}>Check Details</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-black'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step3 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* General Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">General Information</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Product Name:</p>
                                <p>{data?.GeneralInfo?.productName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Category:</p>
                                <p>{data?.GeneralInfo?.category}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Description:</p>
                                <p>{data?.GeneralInfo?.description}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data?.GeneralInfo?.quantity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Nutrition</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data?.Nutrition?.quantity} {data?.Nutrition?.quantityUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data?.Nutrition?.temp} {data?.Nutrition?.tempUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">pH:</p>
                                <p>{data?.Nutrition?.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data?.Nutrition?.fat} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data?.Nutrition?.protein} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Calories:</p>
                                <p>{data?.Nutrition?.calories}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Total Fat:</p>
                                <p>{data?.Nutrition?.totalFat}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">cholesterol:</p>
                                <p>{data?.Nutrition?.cholesterol}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sodium:</p>
                                <p>{data?.Nutrition?.sodium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Potassium:</p>
                                <p>{data?.Nutrition?.potassium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Total Carbohydrates:</p>
                                <p>{data?.Nutrition?.totalCarbohydrates}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fiber:</p>
                                <p>{data?.Nutrition?.fiber}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sugar:</p>
                                <p>{data?.Nutrition?.sugar}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin C:</p>
                                <p>{data?.Nutrition?.vitaminC}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Calcium:</p>
                                <p>{data?.Nutrition?.calcium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Iron:</p>
                                <p>{data?.Nutrition?.iron}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin D:</p>
                                <p>{data?.Nutrition?.vitaminD}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin B6:</p>
                                <p>{data?.Nutrition?.vitaminB6}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin B12:</p>
                                <p>{data?.Nutrition?.vitaminB12}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Magnesium:</p>
                                <p>{data?.Nutrition?.magnesium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data?.Nutrition?.bacteria === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.bacteriaInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data?.Nutrition?.contaminants === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.contaminantInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold">Abnormal Characteristic:</p>
                                    <div className="flex flex-col gap-3">
                                        <p className="font-semibold">Smell Bad:</p>
                                        <p className="font-semibold">Smell Not Fresh:</p>
                                        <p className="font-semibold">Abnormal Color:</p>
                                        <p className="font-semibold">Sour:</p>
                                        <p className="font-semibold">Bitter:</p>
                                        <p className="font-semibold">Cloudy:</p>
                                        <p className="font-semibold">Lumpy:</p>
                                        <p className="font-semibold">Separation of milk and water:</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>{data?.Nutrition?.abnormalChar === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.smellBad === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.smellNotFresh === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.abnormalColor === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.sour === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.bitter === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.cloudy === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.lumpy === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.separation === true ? "True" : "False"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button className="text-white font-semibold text-xl bg-emerald-500 rounded-full self-end mx-20 p-3 mb-10"
            onClick={handleSubmit}>Submit</button>
        </div>
    );
};
export default CheckProductDetails;