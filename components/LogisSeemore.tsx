"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface LogisSeemoreProps {
    isOpen: boolean;
    onClose: () => void;
    logistics: any; // เพิ่ม prop นี้เข้ามา
}


export default function LogisSeemore({ isOpen, onClose, logistics }: LogisSeemoreProps) {
    const [data, setData] = useState<any>({ before: [], during: [], after: [] });

    useEffect(() => {
        if (logistics) {
            setData({
                before: logistics.beforeCheckpoints ? [logistics.beforeCheckpoints[0]] : [],
                during: logistics.duringCheckpoints ? [logistics.duringCheckpoints[0]] : [],
                after: logistics.afterCheckpoints ? [logistics.afterCheckpoints[0]] : [],
            });
        }
    }, [logistics]);
    
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-lg lg:max-w-7xl h-auto max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition"
                >
                    <X className="w-5 h-5" />
                </button>
                <h1 className="text-4xl font-bold mb-4 text-center">Logistics Detail</h1>

                {/* ✅ แสดงข้อมูลแยก Before, During, After */}
                {["before", "during", "after"].map((stage) => (
                    <div key={stage}>
                        <h1 className="text-center self-center text-4xl font-bold mt-10">
                            {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </h1>

                        {data[stage].length > 0 ? (
                            data[stage].map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14"
                                >
                                    {/* General Info */}
                                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white p-4 md:p-10 text-base md:text-xl">
                                        <h1 className="text-xl sm:text-3xl font-bold text-center">
                                            General Info
                                        </h1>
                                        <div className="flex flex-col space-y-2 gap-3">
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Receive Status:</p>
                                                <p>{stage.charAt(0).toUpperCase() + stage.slice(1)}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Person In Charge:</p>
                                                <p>{item.personInCharge || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Detail */}
                                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 p-4 md:p-10 text-base md:text-xl">
                                        <h1 className="text-xl sm:text-3xl font-bold text-center">
                                            Product Detail
                                        </h1>
                                        <div className="flex flex-col space-y-2 gap-3">
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Quantity:</p>
                                                <p>
                                                    {item.quantity || "-"} {item.unit || "-"}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Temperature:</p>
                                                <p>{item.temperature || "-"}°C</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Company Name:</p>
                                                <p>{item.receiverInfo?.companyName || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Name:</p>
                                                <p>
                                                    {item.receiverInfo?.firstName || "-"}{" "}
                                                    {item.receiverInfo?.lastName || "-"}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Email:</p>
                                                <p>{item.receiverInfo?.email || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Phone:</p>
                                                <p>{item.receiverInfo?.phone || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Address:</p>
                                                <p>{item.receiverInfo?.address || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Province:</p>
                                                <p>{item.receiverInfo?.province || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">District:</p>
                                                <p>{item.receiverInfo?.district || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Sub-District:</p>
                                                <p>{item.receiverInfo?.subDistrict || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Zip Code:</p>
                                                <p>{item.receiverInfo?.postalCode || "-"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Location:</p>
                                                <p>{item.receiverInfo?.location || "-"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-lg text-gray-500">
                                No data available for {stage}.
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
