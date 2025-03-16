'use client';
export const dynamic = 'force-dynamic';

import Recieving from "./Recieving";
import { Suspense } from 'react';

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Recieving />
        </Suspense>
    );
};
export default Page;
