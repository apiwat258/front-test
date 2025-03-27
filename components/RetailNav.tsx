"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const RetailNav = () => {
    
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex flex-col md:flex-row px-4 md:px-8 h-18 w-full bg-[#F5C065] items-center text-[#F8EECB] text-xl md:text-2xl font-semibold fixed z-10">
            <div className="flex justify-between items-center w-full md:w-1/2">
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

            <div className={`flex-col md:flex-row md:flex gap-4 md:gap-24 justify-end items-center w-full md:w-1/2 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
                <Link href={'/Retail/GeneralInfo'} className={`hover:text-[#D23D2D] whitespace-nowrap ${pathname === "/Retail/GeneralInfo" ? "text-[#D23D2D]" : ""}`}>General Information</Link>
                <Link href={'/Retail/Delivered'} className={`hover:text-[#D23D2D]  ${pathname === "/Retail/Delivered" ? "text-[#D23D2D]" : ""}`}>Deliver</Link>
                <Link href={'/Retail/received'} className={`hover:text-[#D23D2D] ${pathname === "/Retail/received" ? "text-[#D23D2D]" : ""}`}>Receive</Link>
                <Link href={'/Retail/Profile'} className={`flex items-center border-2 border-[#EFE4DC] rounded-full px-2 md:px-3 py-1 md:py-2 shadow-md gap-2 md:gap-3 cursor-pointer hover:text-[#F8EECB] hover:bg-[#D23D2D]`}>
                    <div className="flex w-8 md:w-10 h-8 md:h-10 bg-slate-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 md:w-10 h-8 md:h-10" viewBox="0 0 24 24">
                            <path fill="#999999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
                        </svg>
                    </div>
                    <p className="text-base md:text-lg">Profile</p>
                </Link>
            </div>
        </div>
    );
};
export default RetailNav;