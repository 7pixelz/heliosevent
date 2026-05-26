'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const Locations = dynamic(() => import('./Locations'), {
  ssr: false,
  loading: () => <section style={{ background: '#0a0c12', minHeight: '1800px' }} />,
});

const placeholder = <section style={{ background: '#0a0c12', minHeight: '1800px' }} />;

export default function LocationsClient() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return placeholder;

  return <Locations />;
}
