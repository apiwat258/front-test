'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchLogisticsWaitingForPickup } from "@/services/trackingService"; // ✅ เปลี่ยน service ใหม่

const Delivered = () => {
    const [trackingData, setTrackingData] = useState<
        { trackingId?: string; productLotId?: string; personInCharge?: string; status?: string }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchLogisticsWaitingForPickup(); // ✅ เปลี่ยนมาใช้ API ใหม่

                console.log("🔥 Debug - Filtered Tracking Data:", data);
                setTrackingData(data); // ✅ รับข้อมูลตรงๆ ไม่ต้อง filter แล้ว
            } catch (error) {
                console.error("❌ Error fetching tracking data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-screen pt-20">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-semibold text-center">Delivered Order</h1>

                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {trackingData.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-center items-center w-full md:w-1/3 h-auto gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                {item.trackingId && (
                                    <span className="text-xl md:text-2xl font-semibold">
                                        Tracking ID: <p className="font-normal inline">{item.trackingId}</p>
                                    </span>
                                )}
                                {item.status && (
                                    <div className="flex gap-2 text-center items-center rounded-xl text-lg md:text-xl text-[#ffc107] bg-[#fff3cd] px-2 py-1 mt-2 md:mt-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M6 4H4V2h16v2h-2v2c0 1.615-.816 2.915-1.844 3.977c-.703.726-1.558 1.395-2.425 2.023c.867.628 1.722 1.297 2.425 2.023C17.184 15.085 18 16.385 18 18v2h2v2H4v-2h2v-2c0-1.615.816-2.915 1.844-3.977c.703-.726 1.558-1.395 2.425-2.023c-.867-.628-1.722-1.297-2.425-2.023C6.816 8.915 6 7.615 6 6zm2 0v2c0 .685.26 1.335.771 2h6.458c.51-.665.771-1.315.771-2V4zm4 9.222c-1.045.738-1.992 1.441-2.719 2.192a7 7 0 0 0-.51.586h6.458a7 7 0 0 0-.51-.586c-.727-.751-1.674-1.454-2.719-2.192" />
                                        </svg>
                                        <p className="font-semibold">{item.status}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                {item.personInCharge && (
                                    <span className="text-xl md:text-2xl font-semibold">
                                        Person In Charge: <p className="inline font-normal">{item.personInCharge}</p>
                                    </span>
                                )}
                                {item.productLotId && (
                                    <Link
                                        href={`/Logistic/Deliver/Details??lotId=${item.productLotId}`}
                                        className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0"
                                    >
                                        More info
                                    </Link>
                                )}
                            </div>

                            {/* ✅ ปุ่มแยกตาม Status */}
                            {item.trackingId && (
                                <>
                                    {item.status === "Pending" && (
                                        <Link
                                            href={`/Logistic/Recieving?id=${item.trackingId}`}
                                            className="bg-[#198754] text-white p-2 w-full rounded-xl hover:bg-[#3eb055] text-center"
                                        >
                                            Receive
                                        </Link>
                                    )}
                                    {item.status === "SpecialMatch" && (
                                        <Link
                                            href={`/Logistic/Recieving?id=${item.trackingId}`}
                                            className="bg-[#0d6efd] text-white p-2 w-full rounded-xl hover:bg-[#3a8ffd] text-center"
                                        >
                                            Receive Again
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Delivered;
