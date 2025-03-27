"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProductLotDetails } from "@/services/productlotService"; // ✅ Import Service

// Define the type for shipping addresses
type ShippingAddress = {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    areaCode: string;
    telephone: string;
    address: string;
    province: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    location: string;
};

const CheckDetails = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const lotId = searchParams.get("lotId"); // ✅ ดึง lotId จาก URL

    console.log("📌 Extracted lotId from URL:", lotId); // ✅ Debug log

    const [data, setData] = useState({
        GeneralInfo: {},
        selectMilkTank: { tankIds: [] },  // ✅ ตั้งค่าเริ่มต้น
        Quality: {},
        nutrition: {},
        shippingAddresses: []
    });

    useEffect(() => {
        if (!lotId) {
            console.error("❌ lotId is missing!");
            return;
        }

        const getProductLotDetails = async () => {
            console.log("📡 Fetching product lot details for:", lotId);
            const productLotData = await fetchProductLotDetails(lotId);
            console.log("📌 Debug - API Response:", productLotData);  // ✅ Debug API Response

            if (productLotData) {
                setData({
                    ...productLotData,
                    selectMilkTank: {
                        ...productLotData.selectMilkTank,
                        tankIds: productLotData.selectMilkTank?.tankIds || []  // ✅ ป้องกัน `undefined`
                    }
                });
            }
        };

        getProductLotDetails();
    }, [lotId]);
    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100 text-black">
            <h1 className="text-5xl font-bold mt-10 text-black">Product Lot Detail</h1>
            {data && (
                <div className="flex flex-col gap-10 w-full p-4 md:p-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* General Information */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">General Information</h1>
                            <div className="flex flex-col space-y-2 gap-3 text-gray-600">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Product Name:</p>
                                    <p>{data.GeneralInfo?.productName}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Category:</p>
                                    <p>{data.GeneralInfo?.category}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Description:</p>
                                    <p>{data.GeneralInfo?.description}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Quantity Per Unit:</p>
                                    <p>{data.GeneralInfo?.quantity} {data.GeneralInfo?.quantityUnit}</p>
                                </div>
                            </div>
                        </div>

                        {/* Select Milk Tank */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">Select Milk Tank
                            </h1>
                            <div className="flex flex-col space-y-2 gap-3 text-gray-600">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Temperature:</p>
                                    <p>{data.selectMilkTank?.temp} {data.selectMilkTank?.tempUnit}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">pH:</p>
                                    <p>{data.selectMilkTank?.pH}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Fat:</p>
                                    <p>{data.selectMilkTank?.fat} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Protein:</p>
                                    <p>{data.selectMilkTank?.protein} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Bacteria:</p>
                                    <p>{data.selectMilkTank?.bacteria ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Bacteria Info:</p>
                                    <p>{data.selectMilkTank?.bacteriaInfo}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Contaminants:</p>
                                    <p>{data.selectMilkTank?.contaminants ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Contaminant Info:</p>
                                    <p>{data.selectMilkTank?.contaminantInfo}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Abnormal Characteristic:</p>
                                    <p>{data.selectMilkTank?.abnormalChar ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <p className="font-semibold">Abnormal Type:</p>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Smell Bad:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.smellBad ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Smell Not Fresh:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.smellNotFresh ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Abnormal Color:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.abnormalColor ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Sour:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.sour ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Bitter:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.bitter ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Cloudy:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.cloudy ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Lumpy:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.lumpy ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <p>Separation:</p>
                                        <p>{data.selectMilkTank?.abnormalType?.separation ? "Yes" : "No"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quality */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">Quality</h1>
                            <div className="flex flex-col space-y-2 gap-3 text-gray-600">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Grade:</p>
                                    <p>{data.Quality?.grade}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Inspection Date:</p>
                                    <p>{data.Quality?.inspectionDate}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Inspector:</p>
                                    <p>{data.Quality?.inspector}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Comments:</p>
                                    <p>{data.Quality?.comments}</p>
                                </div>
                            </div>
                        </div>

                        {/* Nutrition */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center text-black">Nutrition</h1>
                            <div className="flex flex-col space-y-2 gap-3 text-gray-600">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Calories:</p>
                                    <p>{data.nutrition?.calories}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Total Fat:</p>
                                    <p>{data.nutrition?.totalFat} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Cholesterol:</p>
                                    <p>{data.nutrition?.cholesterol} mg</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Sodium:</p>
                                    <p>{data.nutrition?.sodium} mg</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Potassium:</p>
                                    <p>{data.nutrition?.potassium} mg</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Total Carbohydrates:</p>
                                    <p>{data.nutrition?.totalCarbohydrates} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Fiber:</p>
                                    <p>{data.nutrition?.fiber} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Sugar:</p>
                                    <p>{data.nutrition?.sugar} g</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin C:</p>
                                    <p>{data.nutrition?.vitaminC} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Calcium:</p>
                                    <p>{data.nutrition?.calcium} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Iron:</p>
                                    <p>{data.nutrition?.iron} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin D:</p>
                                    <p>{data.nutrition?.vitaminD} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin B6:</p>
                                    <p>{data.nutrition?.vitaminB6} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Vitamin B12:</p>
                                    <p>{data.nutrition?.vitaminB12} %</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Magnesium:</p>
                                    <p>{data.nutrition?.magnesium} %</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                            {data.shippingAddresses && data.shippingAddresses.length > 0 ? (
                                data.shippingAddresses.map((address, index) => (
                                    <div key={index} className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Shipping Address {index + 1}</h1>
                                        <div className="flex flex-col space-y-2 gap-3 text-gray-600">
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Company Name:</p>
                                                <p>{address.qrCodeData?.retailer?.companyName || "N/A"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">First Name:</p>
                                                <p>{address.qrCodeData?.retailer?.firstName}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Last Name:</p>
                                                <p>{address.qrCodeData?.retailer?.lastName}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Email:</p>
                                                <p>{address.qrCodeData?.retailer?.email}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Phone Number:</p>
                                                <p>{address.qrCodeData?.retailer?.areaCode} {address.qrCodeData?.retailer?.telephone}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Address:</p>
                                                <p>{address.qrCodeData?.retailer?.address || "N/A"}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Province:</p>
                                                <p>{address.qrCodeData?.retailer?.province}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">District:</p>
                                                <p>{address.qrCodeData?.retailer?.district}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Sub-District:</p>
                                                <p>{address.qrCodeData?.retailer?.subDistrict}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Postal Code:</p>
                                                <p>{address.qrCodeData?.retailer?.postalCode}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">Location:</p>
                                                <p>{address.qrCodeData?.retailer?.location}</p>
                                            </div>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col gap-4 md:gap-10 w-full h-fit bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                                    <h1 className="text-xl md:text-3xl font-bold text-center text-black">Shipping Address</h1>
                                    <p className="text-gray-600">No shipping addresses available.</p>
                                </div>
                            )}
                    </div>
                </div>
                
            )}
 <div className="flex justify-center items-center w-full h-full gap-5 mt-10 px-8">
 <h1 className="text-5xl">QR code Section</h1>            </div>

            <div className="flex justify-center items-center w-full mt-5">
                {data.qrCodeImg ? (
                    <img src={data.qrCodeImg} alt="Product Lot QR Code" className="w-64 h-64 object-contain border border-gray-300 rounded-xl shadow-lg" />
                ) : (
                    <p className="text-gray-500 text-xl">QR Code not available.</p>
                )}
            </div>
           
        </div>
    );
};
export default CheckDetails;