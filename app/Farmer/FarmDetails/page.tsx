'use client';
export const dynamic = 'force-dynamic';

import FarmDetails from './FarmDetails';
import { Suspense } from 'react';

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FarmDetails />
        </Suspense>
    );
}
export default Page;
