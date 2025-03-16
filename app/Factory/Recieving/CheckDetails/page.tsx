'use client';
export const dynamic = 'force-dynamic';

import CheckDetails from "./CheckDetails";
import { Suspense } from 'react';

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckDetails />
        </Suspense>
    );
};
export default Page;
