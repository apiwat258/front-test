"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const FactoryNav = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row px-4 md:px-8 h-auto md:h-18 w-full bg-[#394F49] items-center text-[#F7FCD4] text-lg md:text-2xl font-semibold fixed z-10">
            <div className="flex justify-between items-center w-full">
                <a href="/" className="flex items-center gap-2">
                    <div className="overflow-hidden w-12 md:w-20 h-12 md:h-20">
                        <img src="/images/LogoNoBgNotxt.png" alt="Logo" />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                        <p className="text-2xl md:text-3xl font-bold">Purely</p>
                        <small className="text-base md:text-lg font-semibold">TRACE</small>
                    </div>
                </a>
                <button className="md:hidden" onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#52600A" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z" />
                    </svg>
                </button>
            </div>

            <div className={`flex-col md:flex-row md:flex gap-4 md:gap-24 justify-between items-center w-full ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
                <Link href={'/Factory/FactoryGeneral'} className={`whitespace-nowrap hover:text-[#ffa19d] ${pathname === "/Factory/FactoryGeneral" ? "text-[#ffa19d]" : ""}`}>General Information</Link>

                <div className="relative w-full md:w-auto text-center">
                    <button onClick={toggleDropdown} className={`whitespace-nowrap hover:text-[#ffa19d] ${pathname.startsWith("/Factory") ? "้hover:text-[#ffa19d]" : ""}`}>
                        Receive RM
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute mt-2 w-full md:w-40 bg-white rounded-md shadow-lg left-0 md:left-auto">
                            <Link href={'/Factory/Toreceive'} className="block px-4 py-2 text-gray-800 text-lg hover:bg-gray-200 hover:rounded-md" onClick={closeDropdown}>To Receive</Link>
                            <Link href={'/Factory/receiveRM'} className="block px-4 py-2 text-gray-800 text-lg hover:bg-gray-200 hover:rounded-md" onClick={closeDropdown}>Received</Link>
                        </div>
                    )}
                </div>

                <Link href={'/Factory/Product'} className={`hover:text-[#ffa19d] ${pathname === "/Factory/Product" ? "text-[#ffa19d]" : ""}`}>Product</Link>

                <Link href={'/Factory/ProductLot'} className={`whitespace-nowrap hover:text-[#ffa19d] ${pathname === "/Factory/ProductLot" ? "text-[#ffa19d]" : ""}`}>Product Lot</Link>

                <Link href={'/Factory/Profile'} className={`flex items-center border-2 border-[#EFE4DC] rounded-full px-2 md:px-3 py-1 md:py-2 shadow-md gap-2 md:gap-3 cursor-pointer hover:text-[#7B9B9E] hover:bg-[#E1EABB] ${isMenuOpen ? 'order-first' : ''}`}>
                    <div className="flex justify-center items-center w-8 md:w-10 h-8 md:h-10 bg-slate-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 md:w-10 text-gray-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" />
                        </svg>
                    </div>
                    <p className="text-base md:text-lg">Profile</p>
                </Link>
            </div>
        </div>
    );
};
export default FactoryNav;