'use client';

import dynamic from 'next/dynamic';

const Locations = dynamic(() => import('./Locations'), { ssr: false });

export default function LocationsClient() {
  return <Locations />;
}
