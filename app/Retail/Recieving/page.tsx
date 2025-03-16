'use client';
export const dynamic = 'force-dynamic';

import ComponentName from "./ComponentName";
import { Suspense } from "react";

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ComponentName />
        </Suspense>
    );
};
export default Page;
