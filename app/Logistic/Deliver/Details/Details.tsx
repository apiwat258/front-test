"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProductLotDetails } from "@/services/productlotService";

const Details = () => {
  const [productLotData, setProductLotData] = useState<any>(null);
  const searchParams = useSearchParams();
  const lotId = searchParams.get("lotId"); // ✅ ดึง lotId จาก URL

  useEffect(() => {
    if (!lotId) {
      console.error("❌ Missing lotId in URL");
      return;
    }

    // 🔥 เรียก API เอา lotId ไป fetch
    fetchProductLotDetails(lotId).then((res) => {
      if (res) {
        console.log("✅ Product Lot Data:", res);
        setProductLotData(res);
      }
    });
  }, [lotId]);

  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100 text-gray-500">
      <h1 className="text-5xl font-bold text-black">Delivered Details</h1>

      {productLotData && (
        <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
          {/* General Info */}
          <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
            <h1 className="text-xl md:text-3xl font-bold text-center text-black">General Info</h1>
            <div className="flex flex-col space-y-2 gap-3">
              <div className="flex justify-between">
                <p className="font-semibold">Product Name:</p>
                <p>{productLotData.GeneralInfo?.productName || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Category:</p>
                <p>{productLotData.GeneralInfo?.category || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Description:</p>
                <p>{productLotData.GeneralInfo?.description || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Quantity:</p>
                <p>{productLotData.GeneralInfo?.quantity} {productLotData.GeneralInfo?.quantityUnit}</p>
              </div>
            </div>
          </div>

          {/* Quantity Info */}
          <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
            <h1 className="text-xl md:text-3xl font-bold text-center text-black">Milk Tank Info</h1>
            <div className="flex flex-col space-y-2 gap-3">
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
              <div className="flex justify-between">
                <p className="font-semibold">Bacteria:</p>
                <div className="flex flex-col gap-2">
                  <p>{productLotData.selectMilkTank?.bacteria ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.bacteriaInfo || "N/A"}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Contaminants:</p>
                <div className="flex flex-col gap-2">
                  <p>{productLotData.selectMilkTank?.contaminants ? "True" : "False"}</p>
                  <p>{productLotData.selectMilkTank?.contaminantInfo || "N/A"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-semibold">Abnormal Characteristic:</p>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <p>Smell Bad:</p>
                    <p>Smell Not Fresh:</p>
                    <p>Abnormal Color:</p>
                    <p>Sour:</p>
                    <p>Bitter:</p>
                    <p>Cloudy:</p>
                    <p>Lumpy:</p>
                    <p>Separation:</p>
                  </div>
                  <div className="flex flex-col gap-2">
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
        </div>
      )}
    </div>
  );
};

export default Details;
