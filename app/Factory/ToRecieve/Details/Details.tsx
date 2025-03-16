"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
    address: string;
    areaCode: string;
    phoneNumber: string;
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

const Details = () => {
    const [data, setData] = useState<FormData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem("formData");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    const handleSubmit = () => {
        router.push("/Factory/FactoryDetails");
        // localStorage.clear(); // Clear the form data in localStorage after submission
    };

    const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
    const shippingAddressRef = useRef<HTMLDivElement>(null);
    const [stepStatus, setStepStatus] = useState({
        step1: 'completed',
        step2: 'completed',
        step3: 'in-progress'
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
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full min-h-screen pt-20">
            <h1 className="text-5xl font-bold mt-10">To Recieve Details</h1>
            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14 text-gray-500">
                    {/* Milk tank info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Milk Tank Info</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Farm Name:</p>
                                <p>{data.milkTankInfo.farmName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Tank ID:</p>
                                <p>{data.milkTankInfo.milkTankNo}</p>
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
                                <p className="font-semibold">ph:</p>
                                <p>{data.milkTankInfo.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data.milkTankInfo.fat}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data.milkTankInfo.protein}</p>
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
                            {/* <div className="flex justify-between">
                                <p className="font-semibold">Added By:</p>
                                <p></p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Added On:</p>
                                <p></p>
                            </div> */}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Shipping Address</h1>
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
                                <p className="font-semibold">Address:</p>
                                <p>{data.shippingAddress.address}</p>
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

            {/* Qrcode generate section: Require API */}
            <div className="flex">
                <h1 className="text-6xl">Qrcode Generate Section</h1>
            </div>
        </div>
    );
};
export default Details;