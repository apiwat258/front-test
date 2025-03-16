'use client';
export const dynamic = 'force-dynamic';

"use client";

import { useEffect, useState } from "react";
import { getFactoryRawMilkTanks } from "@/services/rawMilkFacService";
import Link from "next/link";

const RecieveRM = () => {
    const [token, setToken] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        setToken(document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] || null);

        const fetchData = async () => {
            try {
                // ✅ ดึงข้อมูลจาก API จริง
                const data = await getFactoryRawMilkTanks();

                // ✅ กรองเฉพาะแท็งก์ที่ `status === "Received"`
                const receivedMilkTanks = data.filter((item: { status: string }) => item.status === "Received");

                setFilteredData(receivedMilkTanks);
            } catch (error) {
                console.error("❌ Error fetching factory raw milk tanks:", error);
            }
        };

        fetchData();
    }, []);

    console.log("🚀 Debug: filteredData in RecieveRM.tsx", filteredData);

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-semibold">Recieved Order</h1>

                {/* Raw milk item */}
                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {filteredData.length > 0 ? (
                        filteredData.map((item: { milkTankInfo: { tankId: string, personInCharge: string }, status: string }, index: number) => (
                            <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-40 gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                                <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                    <span className="text-xl md:text-2xl font-semibold">Milk Tank no: 
                                    <span className="font-normal">{`${item.milkTankInfo.tankId.split("-")[0].slice(-4)}-${item.milkTankInfo.tankId.split("-")[1].slice(6, 8)}/${item.milkTankInfo.tankId.split("-")[1].slice(4, 6)}-${item.milkTankInfo.tankId.split("-")[2]}`}</span>
                                    </span>
                                    <div className="flex gap-2 text-center items-center rounded-xl text-lg md:text-xl 
                                        text-[#198755] bg-[#d1e7dd] px-2 py-1 mt-2 md:mt-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" />
                                        </svg>
                                        <p className="font-semibold">{item.status}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                    <span className="text-xl md:text-2xl font-semibold">Person In Charge: 
                                        <p className="inline font-normal">{item.milkTankInfo.personInCharge}</p>
                                    </span>
                                    <Link href={`/Factory/FactoryDetails?id=${item.milkTankInfo.tankId}`} className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0">
                                        More info
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-2xl text-gray-500">No data available</p> // ✅ แสดงข้อความถ้าไม่มีข้อมูล
                    )}
                </div>
            </div>
            {/* end Raw Milk Item */}
        </div>
    );
};
export default RecieveRM;
