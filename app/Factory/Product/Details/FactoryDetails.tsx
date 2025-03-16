"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { fetchProductDetails } from "@/services/productService"; // ✅ Import Service
import { useSearchParams } from "next/navigation";

const FactoryDetails = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    console.log("📌 Extracted productId from URL:", productId); // ✅ Debug log

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!productId) {
            console.error("❌ productId is missing!");
            return;
        }

        const getProductDetails = async () => {
            console.log("📡 Fetching product details for:", productId); // ✅ Debug log
            const productData = await fetchProductDetails(productId);
            if (productData) {
                setData(productData);
            }
        };

        getProductDetails(); // ✅ เรียก API ดึงรายละเอียดสินค้า
    }, [productId]);

    return (

        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100 text-gray-500">
            <h1 className="text-5xl font-bold text-black">Product Details</h1>
            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* General Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">General Information</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Product Name:</p>
                                <p>{data?.GeneralInfo?.productName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Category:</p>
                                <p>{data?.GeneralInfo?.category}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Description:</p>
                                <p>{data?.GeneralInfo?.description}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data?.GeneralInfo?.quantity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Nutrition</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data?.Nutrition?.quantity} {data?.Nutrition?.quantityUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data?.Nutrition?.temp} {data?.Nutrition?.tempUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">pH:</p>
                                <p>{data?.Nutrition?.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data?.Nutrition?.fat} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data?.Nutrition?.protein} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Calories:</p>
                                <p>{data?.Nutrition?.calories}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Total Fat:</p>
                                <p>{data?.Nutrition?.totalFat}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Colestoral:</p>
                                <p>{data?.Nutrition?.colestoral}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sodium:</p>
                                <p>{data?.Nutrition?.sodium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Potassium:</p>
                                <p>{data?.Nutrition?.potassium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Total Carbohydrates:</p>
                                <p>{data?.Nutrition?.totalCarbohydrates}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fiber:</p>
                                <p>{data?.Nutrition?.fiber}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sugar:</p>
                                <p>{data?.Nutrition?.sugar}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin C:</p>
                                <p>{data?.Nutrition?.vitaminC}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Calcium:</p>
                                <p>{data?.Nutrition?.calcium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Iron:</p>
                                <p>{data?.Nutrition?.iron}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin D:</p>
                                <p>{data?.Nutrition?.vitaminD}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin B6:</p>
                                <p>{data?.Nutrition?.vitaminB6}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin B12:</p>
                                <p>{data?.Nutrition?.vitaminB12}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Magnesium:</p>
                                <p>{data?.Nutrition?.magnesium}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data?.Nutrition?.bacteria === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.bacteriaInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data?.Nutrition?.contaminants === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.contaminantInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold">Abnormal Characteristic:</p>
                                    <div className="flex flex-col gap-3">
                                        <p className="font-semibold">Smell Bad:</p>
                                        <p className="font-semibold">Smell Not Fresh:</p>
                                        <p className="font-semibold">Abnormal Color:</p>
                                        <p className="font-semibold">Sour:</p>
                                        <p className="font-semibold">Bitter:</p>
                                        <p className="font-semibold">Cloudy:</p>
                                        <p className="font-semibold">Lumpy:</p>
                                        <p className="font-semibold">Separation of milk and water:</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>{data?.Nutrition?.abnormalChar === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.smellBad === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.smellNotFresh === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.abnormalColor === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.sour === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.bitter === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.cloudy === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.lumpy === true ? "True" : "False"}</p>
                                    <p>{data?.Nutrition?.abnormalType?.separation === true ? "True" : "False"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FactoryDetails;