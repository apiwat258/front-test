"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getRetailerReceivedProduct } from "@/services/trackingService";

interface RecipientInfo {
    personInCharge: string;
    location: string;
    pickUpTime: string;
}

interface Quantity {
    quantity: number;
    quantityUnit: string;
    temp: number;
    tempUnit: string;
    pH: number;
    fat: number;
    protein: number;
    bacteria: boolean;
    bacteriaInfo: string;
    contaminants: boolean;
    contaminantInfo: string;
    abnormalChar: boolean;
    abnormalType: {
        smellBad: boolean;
        smellNotFresh: boolean;
        abnormalColor: boolean;
        sour: boolean;
        bitter: boolean;
        cloudy: boolean;
        lumpy: boolean;
        separation: boolean;
    };
}

interface Data {
    RecipientInfo: RecipientInfo;
    Quantity: Quantity;
}

const CheckDetails = () => {
    const [data, setData] = useState(null);
    const searchParams = useSearchParams();
    const trackingId = searchParams.get("trackingId");

    useEffect(() => {
        const fetchData = async () => {
            if (trackingId) {
                const response = await getRetailerReceivedProduct(trackingId);
                if (response) {
                    setData(response);
                }
            }
        };
        fetchData();
    }, [trackingId]);

    if (!data || !data.Input) return <p>Loading...</p>;


    return (
        <div className="flex flex-col justify-center items-center pt-20 w-full h-full min-h-screen">
            <h1 className="text-5xl font-bold mt-10">Recieving Details</h1>
            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* Recipient Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Recipient Info</h1>
                        <div className="flex flex-col space-y-2 gap-3 text-gray-500">
                            <div className="flex justify-between">
                                <p className="font-semibold">Person in charge:</p>
                                <p>{data.Input.RecipientInfo.personInCharge}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Location:</p>
                                <p>{data.Input.RecipientInfo.location}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Pick Up Time:</p>
                                <p>{data.Input.RecipientInfo.pickUpTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Quantity Info</h1>
                        <div className="flex flex-col space-y-2 gap-3 text-gray-500">
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data.Input.Quantity.quantity} {data.Input.Quantity.quantityUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data.Input.Quantity.temp} {data.Input.Quantity.tempUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">pH:</p>
                                <p>{data.Input.Quantity.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data.Input.Quantity.fat} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data.Input.Quantity.protein} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.Input.Quantity.bacteria === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.bacteriaInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.Input.Quantity.contaminants === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.contaminantInfo}</p>
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
                                    <p>{data.Input.Quantity.abnormalChar === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.smellBad === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.smellNotFresh === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.abnormalColor === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.sour === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.bitter === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.cloudy === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.lumpy === true ? "True" : "False"}</p>
                                    <p>{data.Input.Quantity.abnormalType.separation === true ? "True" : "False"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CheckDetails;