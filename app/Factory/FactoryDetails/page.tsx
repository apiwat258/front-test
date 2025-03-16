'use client';
export const dynamic = 'force-dynamic';

import FactoryDetails from './FactoryDetails';
import { Suspense } from 'react';

const Page = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <FactoryDetails />
            </Suspense>
        </div>
    );
}
export default Page;
