"use client"
export const dynamic = 'force-dynamic';

import { useState } from "react";

import FarmSeemore from "@/components/FarmSeemore"

export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="flex flex-col h-full w-full min-h-screen pt-24">
            <button onClick={() => setIsModalOpen(true)}>See More</button>
            <FarmSeemore isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}/>
        </div>
    )
}