'use client';
"use client";
export const dynamic = 'force-dynamic';


import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFactoryProductLots } from "@/services/productlotService";  // ✅ Import Service

const ProductLot = () => {
    const [data, setData] = useState<any[]>([]);  // ✅ Default เป็น array เปล่า
    const statusMap = {
        0: "Pending",      
        1: "In Transit",    
        2: "Delivered"      
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchFactoryProductLots();  // ✅ ดึงข้อมูลจาก API
                setData(result);  
            } catch (error) {
                console.error("❌ Error fetching product lots:", error);
            }
        };

        fetchData();
    }, []);  

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-20">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-semibold text-center">Product Lot</h1>
                <div className="flex flex-col md:flex-row justify-center items-center w-full h-full gap-5 mt-10 px-8">
                    <Link href={'/Factory/ProductLot/AddProductLot'} className="bg-[#5E929E] text-white font-semibold p-3 w-full md:w-fit text-xl rounded-full text-center">+ Add</Link>
                </div>

                {/* ✅ แสดงข้อความเมื่อไม่มีข้อมูล */}
                {data.length === 0 ? (
                    <div className="flex items-center justify-center mt-10 text-gray-500 text-xl">
                        <p>ไม่มีข้อมูล Product Lot</p>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                        {data.map((item: { productLotNo: string, productName: string, personInCharge: string, status: string }, index: number) => (
                            <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-40 gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                                <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                    <span className="text-xl md:text-2xl font-semibold">Product Lot no: <p className="font-normal inline">{item.productLotNo}</p></span>
                                    <div className={`flex gap-2 text-center items-center rounded-xl text-lg md:text-xl 
                                        ${item.status === 0 ? 'text-[#ffc107] bg-[#fff3cd]'   
                                        : item.status === 1 ? 'text-[#198755] bg-[#d1e7dd]'    
                                        : item.status === 2 ? 'text-[#6c757d] bg-[#e9ecef]'    
                                        : 'text-gray-500 bg-gray-300'} px-2 py-1 mt-2 md:mt-0`}>
                                        
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" />
                                        </svg>
                                        
                                        <p className="font-semibold">{statusMap[item.status] || "Unknown"}</p>
                                    </div>

                                </div>
                                <div className='flex flex-col justify-center items-start w-full h-1/2'>
                                    <span className="text-xl md:text-2xl font-semibold">Product Name: <p className="inline font-normal">{item.productName}</p></span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                    <span className="text-xl md:text-2xl font-semibold">Person In Charge: <p className="inline font-normal">{item.personInCharge}</p></span>
                                    
                                    {/* ✅ ส่ง lotId ไปใน URL */}
                                    <Link href={`/Factory/ProductLot/Details?lotId=${item.productLotNo}`} className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0">
                                        More info
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductLot;
