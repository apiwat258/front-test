"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CheckDetails = () => {
    const [data, setData] = useState<any>(null); // Explicitly set type to any
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem("receivedForm");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    const handleSubmit = () => {
        router.push("/Factory/FactoryDetails");
        // localStorage.clear(); // Clear the form data in localStorage after submission
    };

    const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
    const shippingAddressRef = useRef<HTMLDivElement>(null);
    const [stepStatus, setStepStatus] = useState({
        step1: 'completed',
        step2: 'completed',
        step3: 'in-progress'
    });

    const handleNextClick = () => {
        setShowShippingAddress(true);
        setStepStatus({
            step1: 'completed',
            step2: 'in-progress',
            step3: 'not-started'
        });

        setTimeout(() => {
            shippingAddressRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure the section is rendered
    }

    return (
        <div className="flex flex-col justify-center items-center pt-20 w-full h-full min-h-screen">
            <h1 className="text-5xl font-bold mt-10">Recieving Details</h1>
            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* Recipient Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Recipient Info</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Person in charge:</p>
                                <p>{data.RecipientInfo?.personInCharge}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Location:</p>
                                <p>{data.RecipientInfo?.location}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Pick Up Time:</p>
                                <p>{data.RecipientInfo?.pickUpTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Quantity Info</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data.Quantity?.quantity} {data.Quantity?.quantityUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data.Quantity?.temp} {data.Quantity?.tempUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">pH:</p>
                                <p>{data.Quantity?.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data.Quantity?.fat} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data.Quantity?.protein} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.Quantity?.bacteria === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.bacteriaInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.Quantity?.contaminants === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.contaminantInfo}</p>
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
                                    <p>{data.Quantity?.abnormalChar === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.smellBad === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.smellNotFresh === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.abnormalColor === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.sour === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.bitter === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.cloudy === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.lumpy === true ? "True" : "False"}</p>
                                    <p>{data.Quantity?.abnormalType?.separation === true ? "True" : "False"}</p>
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