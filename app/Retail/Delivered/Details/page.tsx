'use client';
export const dynamic = 'force-dynamic';

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
