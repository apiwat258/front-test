"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { getFactoryRawMilkTanks } from "@/services/rawMilkFacService";
import Link from "next/link";


const DeliveredRM = () => {
    const [token, setToken] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        setToken(document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] || null);

        const fetchData = async () => {
            try {
                const data = await getFactoryRawMilkTanks();
                const pendingMilkTanks = data.filter(
                    (item: { status: string }) => item.status.toLowerCase() === "pending"
                );
                setFilteredData(pendingMilkTanks);
            } catch (error) {
                console.error("❌ Error fetching factory raw milk tanks:", error);
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
                <h1 className="text-4xl md:text-6xl font-bold text-center">To Recieve Order</h1>

                {/* Delivered item */}
                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {filteredData.map((item: { milkTankInfo: { tankId: string, personInCharge: string }, status: string }, index: number) => (
                        <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-auto gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                            <span className="text-xl md:text-2xl font-semibold">Milk Tank no: <span className="font-normal">{`${item.milkTankInfo.tankId.split("-")[0].slice(-4)}-${item.milkTankInfo.tankId.split("-")[1].slice(6, 8)}/${item.milkTankInfo.tankId.split("-")[1].slice(4, 6)}-${item.milkTankInfo.tankId.split("-")[2]}`}</span></span>
                                <div className={`flex gap-2 text-center items-center rounded-xl text-lg md:text-xl ${item.status.toLowerCase() === 'pending' ? 'text-[#ffc107] bg-[#fff3cd]' : item.status.toLowerCase() === 'received' ? 'text-[#198755] bg-[#d1e7dd]' : ''} px-2 py-1 mt-2 md:mt-0`}>
                                    {item.status.toLowerCase() === 'pending' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M6 4H4V2h16v2h-2v2c0 1.615-.816 2.915-1.844 3.977c-.703.726-1.558 1.395-2.425 2.023c.867.628 1.722 1.297 2.425 2.023C17.184 15.085 18 16.385 18 18v2h2v2H4v-2h2v-2c0-1.615.816-2.915 1.844-3.977c.703-.726 1.558-1.395 2.425-2.023c-.867-.628-1.722-1.297-2.425-2.023C6.816 8.915 6 7.615 6 6zm2 0v2c0 .685.26 1.335.771 2h6.458c.51-.665.771-1.315.771-2V4zm4 9.222c-1.045.738-1.992 1.441-2.719 2.192a7 7 0 0 0-.51.586h6.458a7 7 0 0 0-.51-.586c-.727-.751-1.674-1.454-2.719-2.192"/>
                                        </svg>
                                    )}
                                    {item.status.toLowerCase() === 'received' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"/>
                                        </svg>
                                    )}
                                    <p className="font-semibold">
                                        {item.status}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <span className="text-xl md:text-2xl font-semibold">Person In Charge: <p className="inline font-normal">{item.milkTankInfo.personInCharge}</p></span>
                                <Link href={`/Factory/DeliveredRM/Details?tankId=${item.milkTankInfo.tankId}`} className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0">More info</Link>
                            </div>
                            <Link href={`/Factory/Recieving?tankId=${item.milkTankInfo.tankId}`} className="bg-[#198754] text-white p-2 w-full rounded-xl hover:bg-[#3eb055] text-center">Recieve Now</Link>
                            </div>  
                    ))}
                </div>
            </div>
            {/* end Delivered Item */}
        </div>
    );
};
export default DeliveredRM;