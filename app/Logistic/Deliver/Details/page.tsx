'use client';
export const dynamic = 'force-dynamic'; // ✅ มีอยู่แล้ว
export const dynamicParams = true; // ✅ เพิ่มอันนี้ไป

import Details from './Details';
import { Suspense } from 'react';

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Details />
        </Suspense>
    );
}
export default Page;
