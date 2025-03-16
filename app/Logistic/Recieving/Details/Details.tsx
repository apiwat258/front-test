"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getLogisticsCheckpointsByTrackingId } from "@/services/trackingService";

const Details = () => {
    const [data, setData] = useState<any>(null);
    const searchParams = useSearchParams();
    const trackingId = searchParams.get("trackingId");

    useEffect(() => {
        if (!trackingId) {
            console.log("❌ No tracking ID found in URL");
            return;
        }

        console.log("📡 Fetching logistics data for Tracking ID:", trackingId);

        getLogisticsCheckpointsByTrackingId(trackingId).then((response) => {
            if (response) {
                console.log("✅ Received logistics data:", response);

                // ✅ กรองข้อมูล: เอาเฉพาะออบเจ็กต์แรกจากแต่ละสถานะ
                const filteredData = {
                    trackingId: response.trackingId,
                    beforeCheckpoint: response.beforeCheckpoints.length > 0 ? response.beforeCheckpoints[0] : null,
                    duringCheckpoint: response.duringCheckpoints.length > 0 ? response.duringCheckpoints[0] : null,
                    afterCheckpoint: response.afterCheckpoints.length > 0 ? response.afterCheckpoints[0] : null,
                };

                setData(filteredData);
            } else {
                console.log("❌ Failed to retrieve logistics data");
            }
        });
    }, [trackingId]);

    const formatDateTime = (timestamp: number) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp * 1000);
        return date.toLocaleString(); // ✅ แปลงเป็นรูปแบบเวลาอ่านง่าย
    };


    return (
        <div className="flex flex-col justify-center items-center w-full h-full min-h-screen pt-24">
          {data && data.beforeCheckpoint && (
            <div className="flex flex-col w-full gap-6 mb-14">
            <h1 className="text-4xl font-extrabold mb-10 text-center uppercase">Detail</h1>
            <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                {/* -------- General Info -------- */}
                <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                  <h1 className="text-xl md:text-3xl font-bold text-center">General Info</h1>
                  <div className="flex flex-col space-y-2 gap-3">
                    <div className="flex justify-between">
                      <p className="font-semibold">Factory Name:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.companyName || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Person In Charge:</p>
                      <p>{data.beforeCheckpoint.personInCharge || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Pickup Time:</p>
                      <p>{data.beforeCheckpoint.pickupTime ? formatDateTime(data.beforeCheckpoint.pickupTime) : "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Delivery Time:</p>
                      <p>{data.beforeCheckpoint.deliveryTime ? formatDateTime(data.beforeCheckpoint.deliveryTime) : "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Tracking ID:</p>
                      <p>{data.beforeCheckpoint.trackingId || "N/A"}</p>
                    </div>
                  </div>
                </div>
      
                {/* -------- Product Detail -------- */}
                <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                  <h1 className="text-xl md:text-3xl font-bold text-center">Product Detail</h1>
                  <div className="flex flex-col space-y-2 gap-3">
                    <div className="flex justify-between">
                      <p className="font-semibold">Pickup Time:</p>
                      <p>{data.beforeCheckpoint.pickupTime ? formatDateTime(data.beforeCheckpoint.pickupTime) : "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Delivery Time:</p>
                      <p>{data.beforeCheckpoint.deliveryTime ? formatDateTime(data.beforeCheckpoint.deliveryTime) : "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Quantity:</p>
                      <p>{data.beforeCheckpoint.quantity || "N/A"} KG</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Temperature:</p>
                      <p>{data.beforeCheckpoint.temperature || "N/A"} °C</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Company Name:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.companyName || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Name:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.firstName || ""} {data.beforeCheckpoint.receiverInfo?.lastName || ""}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Email:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.email || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Phone:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.phone || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Address:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.address || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Province:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.province || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">District:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.district || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Sub-District:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.subDistrict || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Zip Code:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.postalCode || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Location:</p>
                      <p>{data.beforeCheckpoint.receiverInfo?.location || "N/A"}</p>
                    </div>
                  </div>
                </div>
      
              </div>
            </div>
          )}
        </div>
      );
      
      
        
    
};

export default Details;
