"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRetailerTracking } from "@/services/trackingService"; // ✅ ดึงฟังก์ชันจาก trackingService.ts

const Recieve = () => {
    const [trackingData, setTrackingData] = useState<{ trackingId: string; moreInfoLink: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRetailerTracking();
            setTrackingData(response || []); // ✅ ตั้งค่าให้เป็นอาร์เรย์ว่างถ้าไม่มีข้อมูล
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-semibold">Received Orders</h1>

                {/* Tracking Items */}
                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {trackingData.length > 0 ? (
                        trackingData.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-center items-center w-full md:w-1/3 h-40 gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                    <span className="text-xl md:text-2xl font-semibold">
                                        Tracking ID: <p className="font-normal inline">{item.trackingId || "Unknown"}</p>
                                    </span>
                                    <div className="flex gap-2 text-center items-center rounded-xl text-lg md:text-xl text-[#ffc107] bg-[#fff3cd] px-2 py-1 mt-2 md:mt-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
                                            />
                                        </svg>
                                        <p className="font-semibold">Pending</p> {/* ✅ สถานะให้เป็น "Pending" ไว้ก่อน */}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                    <span className="text-xl md:text-2xl font-semibold">
                                        Person In Charge: <p className="inline font-normal">Unknown</p> {/* ✅ ค่าเริ่มต้นเป็น Unknown */}
                                    </span>
                                    <Link
                                        href={`/Retail/Recieved/Details?trackingId=${item.trackingId}`} // ✅ เพิ่ม Tracking ID ในลิงก์
                                        className="text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-lg md:text-xl font-semibold mt-2 md:mt-0"
                                    >
                                        Receive Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xl text-gray-500">No tracking data found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recieve;
