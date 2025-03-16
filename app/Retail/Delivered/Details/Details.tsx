"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProductLotDetails } from "@/services/productlotService";
import { getLogisticsCheckpointsByTrackingId } from "@/services/trackingService";

const Details = () => {
  const [logisticsData, setLogisticsData] = useState<any>(null);
  const [productLotData, setProductLotData] = useState<any>(null);
  const searchParams = useSearchParams();
  const lotId = searchParams.get("lotId");
  const trackingId = searchParams.get("trackingId");

  useEffect(() => {
    const fetchData = async () => {
      if (!lotId || !trackingId) {
        console.error("❌ Missing lotId or trackingId in URL");
        return;
      }

      try {
        // 👉 Fetch Logistics Checkpoint
        const logisticsResponse = await getLogisticsCheckpointsByTrackingId(trackingId);
        if (logisticsResponse) {
          setLogisticsData(logisticsResponse);
          console.log("✅ Logistics Data:", logisticsResponse);
        }

        // 👉 Fetch Product Lot Details
        const productLotResponse = await fetchProductLotDetails(lotId);
        if (productLotResponse) {
          setProductLotData(productLotResponse);
          console.log("✅ Product Lot Data:", productLotResponse);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, [lotId, trackingId]);

  const formatDateTime = (timestamp: number) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100 text-gray-500">
      <h1 className="text-5xl font-bold text-black">Delivered Order Details</h1>
      {/* เงื่อนไขต้องเช็ค logisticsData และ productLotData */}
      {logisticsData && productLotData && (
        <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
          {/* ----------- General Info ----------- */}
          <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
            <h1 className="text-xl md:text-3xl font-bold text-center">General Info</h1>
            <div className="flex flex-col space-y-2 gap-3">
              <div className="flex justify-between">
                <p className="font-semibold">Person In Charge:</p>
                <p>{logisticsData.beforeCheckpoints?.[0]?.personInCharge || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Location:</p>
                <p>{logisticsData.beforeCheckpoints?.[0]?.receiverInfo?.location || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Pick Up Time:</p>
                <p>{logisticsData.beforeCheckpoints?.[0]?.pickupTime ? formatDateTime(logisticsData.beforeCheckpoints[0].pickupTime) : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* ----------- Quantity Info ----------- */}
          <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
            <h1 className="text-xl md:text-3xl font-bold text-center">Quantity Info</h1>
            <div className="flex flex-col space-y-2 gap-3">
              <div className="flex justify-between">
                <p className="font-semibold">Quantity:</p>
                <p>{productLotData.GeneralInfo?.quantity} {productLotData.GeneralInfo?.quantityUnit}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Temperature:</p>
                <p>{productLotData.selectMilkTank?.temp} {productLotData.selectMilkTank?.tempUnit}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">pH:</p>
                <p>{productLotData.selectMilkTank?.pH}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Fat:</p>
                <p>{productLotData.selectMilkTank?.fat} %</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Protein:</p>
                <p>{productLotData.selectMilkTank?.protein} %</p>
              </div>
              {/* Bacteria */}
              <div className="flex justify-between">
                <p className="font-semibold">Bacteria:</p>
                <div className="flex flex-col gap-2">
                  <p>{productLotData.selectMilkTank?.bacteria ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.bacteriaInfo || "N/A"}</p>
                </div>
              </div>
              {/* Contaminants */}
              <div className="flex justify-between">
                <p className="font-semibold">Contaminants:</p>
                <div className="flex flex-col gap-2">
                  <p>{productLotData.selectMilkTank?.contaminants ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.contaminantInfo || "N/A"}</p>
                </div>
              </div>
              {/* Abnormal Characteristics */}
              <div className="flex justify-between">
                <div className="flex flex-col gap-3">
                  <p className="font-semibold">Abnormal Characteristic:</p>
                  <p className="font-semibold">Smell Bad:</p>
                  <p className="font-semibold">Smell Not Fresh:</p>
                  <p className="font-semibold">Abnormal Color:</p>
                  <p className="font-semibold">Sour:</p>
                  <p className="font-semibold">Bitter:</p>
                  <p className="font-semibold">Cloudy:</p>
                  <p className="font-semibold">Lumpy:</p>
                  <p className="font-semibold">Separation of milk and water:</p>
                </div>
                <div className="flex flex-col gap-3">
                  <p>{productLotData.selectMilkTank?.abnormalChar ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.smellBad ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.smellNotFresh ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.abnormalColor ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.sour ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.bitter ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.cloudy ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.lumpy ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.abnormalType?.separation ? "True" : "False"}</p>
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
