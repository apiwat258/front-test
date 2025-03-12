"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CheckDetails = () => {
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem("LogisRecieve");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    const handleSubmit = () => {
        router.push("/Logistic/Recieving/Details");
        alert("Submitted successfully!");
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

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full min-h-screen pt-24">
            {/* Detail Status */}
            <div className="flex items-center w-full h-full p-10">
                <div className="flex border shadow-xl w-full h-full p-5 rounded-3xl gap-8">
                    {/* First Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-full" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 12h8v2H8zm2 8H6V4h7v5h5v3.1l2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4zm-2-2h4.1l.9-.9V16H8zm12.2-5c.1 0 .3.1.4.2l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2m0 3.9L14.1 23H12v-2.1l6.1-6.1z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 w-full' : 'bg-yellow-400 w-1/5'}`}></div>
                        </div>
                        <p className="text-xl font-semibold">STEP 1</p>
                        <h1 className="text-3xl font-semibold mb-3">General Information</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step1 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Second Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 w-full' : 'bg-yellow-400 w-1/5'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step2 === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>STEP 2</p>
                        <h1 className={`text-3xl font-semibold mb-3`}>Product Detail</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step2 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Third Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 w-0'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step3 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>STEP 3</p>
                        <h1 className={`text-3xl font-semibold mb-3`}>Check Details</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step3 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            {data.length > 0 && data.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* General Info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">General Info</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Factory Name:</p>
                                <p>{item.GeneralInfo.farmName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Product Lot:</p>
                                <p>{item.GeneralInfo.productLot}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Person In Charge:</p>
                                <p>{item.GeneralInfo.personInCharge}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Recieve Status</p>
                                <p>{item.GeneralInfo.recieveStatus}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Detail */}
                    {item.ProductDetail && (
                        <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center">Product Detail</h1>
                            <div className="flex flex-col space-y-2 gap-3">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Pickup Time:</p>
                                    <p>{formatDateTime(item.ProductDetail.recieveTime)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Deliver Time:</p>
                                    <p>{formatDateTime(item.ProductDetail.deliverTime)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Quantity:</p>
                                    <p>{item.ProductDetail.quantity} {item.ProductDetail.quantityUnit}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Temperature:</p>
                                    <p>{item.ProductDetail.temp} {item.ProductDetail.tempUnit}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Company Name:</p>
                                    <p>{item?.ProductDetail?.companyName}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Name:</p>
                                    <p>{item?.ProductDetail?.firstName} {item?.ProductDetail?.lastName}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Email:</p>
                                    <p>{item?.ProductDetail?.email}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Phone:</p>
                                    <p>{item?.ProductDetail?.areaCode} {item?.ProductDetail?.phoneNumber}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Address:</p>
                                    <p>{item?.ProductDetail?.address}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Province:</p>
                                    <p>{item?.ProductDetail?.province}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">District:</p>
                                    <p>{item?.ProductDetail?.district}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Sub-District:</p>
                                    <p>{item?.ProductDetail?.subDistrict}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Zip Code:</p>
                                    <p>{item?.ProductDetail?.postalCode}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Location:</p>
                                    <p>{item?.ProductDetail?.location}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button type="button" onClick={handleSubmit} className="text-xl bg-emerald-400 p-3 mb-5 self-end mx-14 rounded-3xl text-white font-semibold">Submit</button>
        </div >
    );
};
export default CheckDetails;