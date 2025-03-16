'use client';
export const dynamic = 'force-dynamic';

import Tracking from './Tracking';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Tracking />
        </Suspense>
    );
}
