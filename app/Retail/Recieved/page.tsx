'use client';
export const dynamic = 'force-dynamic';

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRetailerTracking } from "@/services/trackingService";

interface TrackingItem {
    trackingId: string;
    productLotId: string;
    personInCharge: string;
    status: number;
}

const Recieve = () => {
    const [trackingData, setTrackingData] = useState<TrackingItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRetailerTracking();
                console.log("🔥 API Response:", res);

                // ✅ กรองเอาเฉพาะ status === 2
                const filtered = res.filter((item: TrackingItem) => item.status === 2);
                setTrackingData(filtered);
            } catch (error) {
                console.error("❌ Error fetching retailer tracking IDs:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>

            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-semibold">Received Order</h1>

                {/* Tracking Items */}
                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {trackingData.length === 0 ? (
                        <p className="text-xl text-gray-500">No received orders found.</p>
                    ) : (
                        trackingData.map((item, index) => (
                            <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-auto gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                                <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                    <span className="text-xl md:text-2xl font-semibold">
                                        Tracking ID: <p className="font-normal inline">{item.trackingId}</p>
                                    </span>

                                    {/* Status - Always Received */}
                                    <div className="flex gap-2 text-center items-center rounded-xl text-lg md:text-xl text-[#198755] bg-[#d1e7dd] px-2 py-1 mt-2 md:mt-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" />
                                        </svg>
                                        <p className="font-semibold">Received</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-3">
                                    <span className="text-xl md:text-2xl font-semibold">
                                        Person In Charge: <p className="inline font-normal">{item.personInCharge || "Unknown"}</p>
                                    </span>

                                    {/* More Info Button - ส่ง trackingId + productLotId */}
                                    <Link
                                        href={`/Retail/Recieved/Details?trackingId=${item.trackingId}&lotId=${item.productLotId}`}
                                        className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0"
                                    >
                                        More info
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recieve;
