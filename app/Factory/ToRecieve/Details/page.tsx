'use client';
export const dynamic = 'force-dynamic'; // ✅ บอกว่าเป็น dynamic page

import { Suspense } from 'react';
import Details from './Details';

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}> {/* ✅ Suspense ครอบ */}
            <Details />
        </Suspense>
    );
};

export default Page;
