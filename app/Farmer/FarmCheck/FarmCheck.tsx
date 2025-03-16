"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createMilkTank } from "@/services/rawMilkService";


// Define the type for the data state
interface MilkTankInfo {
    farmName: string;
    milkTankNo: string;
    personInCharge: string;
    quantity: number;
    quantityUnit: string;
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
}

interface ShippingAddress {
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
}

interface FormData {
    milkTankInfo: MilkTankInfo;
    shippingAddress: ShippingAddress;
}

const FarmCheck = () => {
    const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
    const shippingAddressRef = useRef<HTMLDivElement | null>(null);
    const [data, setData] = useState<any | null>(null); // ✅ เพิ่ม Type ให้ state
    const router = useRouter();

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("formData");
            if (storedData) {
                setData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Error parsing formData from localStorage:", error);
            localStorage.removeItem("formData"); // ลบข้อมูลที่เสียหาย
        }
    }, []);


    const handleSubmit = async () => {
        if (!data) {
            alert("No data to submit!");
            return;
        }
    
        try {
            const result = await createMilkTank(data);
    
            if (result.success) {
                alert("Milk Tank Created Successfully!");
                localStorage.removeItem("formData"); // ✅ ล้างข้อมูลหลังจากส่ง
                router.push(`/Farmer/FarmDetails?id=${result.tankId}`); // ✅ Redirect ไปยังหน้า FarmDetails พร้อม tankId
            } else {
                alert(result.message || "Failed to create milk tank");
            }
        } catch (error) {
            alert("Network error: Unable to reach the server");
        }
    };
    
    
    // Step status update function
    const [stepStatus, setStepStatus] = useState<{
        step1: "completed" | "in-progress" | "not-started";
        step2: "completed" | "in-progress" | "not-started";
        step3: "completed" | "in-progress" | "not-started";
    }>({
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
    
        if (shippingAddressRef.current) {
            setTimeout(() => {
                shippingAddressRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100); // ✅ ตรวจสอบก่อนเรียกใช้ scroll
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
                        <p className="text-xl font-semibold">STEP 1</p>
                        <h1 className="text-3xl font-semibold mb-3">Milk Tank Info</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step1 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Second Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 w-full' : 'bg-yellow-400 w-1/5'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step2 === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>STEP 2</p>
                        <h1 className={`text-3xl font-semibold mb-3`}>Shipping Address</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step2 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Third Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 w-0'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step3 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>STEP 3</p>
                        <h1 className={`text-3xl font-semibold mb-3`}>Confirm Details</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step3 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            <h1 className="font-bold text-5xl">Check Details</h1>
            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* Milk tank info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Milk Tank Info</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Farm Name:</p>
                                <p>{data.milkTankInfo.farmName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Person in charge:</p>
                                <p>{data.milkTankInfo.personInCharge}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data.milkTankInfo.quantity} {data.milkTankInfo.quantityUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data.milkTankInfo.temp} {data.milkTankInfo.tempUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">pH:</p>
                                <p>{data.milkTankInfo.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data.milkTankInfo.fat} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data.milkTankInfo.protein} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.milkTankInfo.bacteria === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.bacteriaInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.milkTankInfo.contaminants === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.contaminantInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold">Abnormal characteristic:</p>
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
                                    <p>{data.milkTankInfo.abnormalChar === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.smellBad === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.smellNotFresh === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.abnormalColor === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.sour === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.bitter === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.cloudy === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.lumpy === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.separation === true ? "True" : "False"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Shipping Address</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Company Name:</p>
                                <p>{data.shippingAddress.companyName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">First Name:</p>
                                <p>{data.shippingAddress.firstName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Last Name:</p>
                                <p>{data.shippingAddress.lastName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Email:</p>
                                <p>{data.shippingAddress.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Phone:</p>
                                <div className="flex gap-2">
                                    <p>{data.shippingAddress.areaCode}</p>
                                    <p>{data.shippingAddress.phoneNumber}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Address:</p>
                                <p>{data.shippingAddress.address}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Province:</p>
                                <p>{data.shippingAddress.province}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">District:</p>
                                <p>{data.shippingAddress.district}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sub-district:</p>
                                <p>{data.shippingAddress.subDistrict}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Postal Code:</p>
                                <p>{data.shippingAddress.postalCode}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Location URL:</p>
                                <p className="w-1/2 whitespace-normal break-all">{data.shippingAddress.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button type="button" onClick={handleSubmit} className="text-xl bg-emerald-400 p-3 mb-5 self-end mx-14 rounded-3xl text-white font-semibold">Submit</button>
        </div>
    );
}

export default FarmCheck;