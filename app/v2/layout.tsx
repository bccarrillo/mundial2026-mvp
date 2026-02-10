'use client'

import { V2Provider } from '@/lib/V2Context'

export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <V2Provider>
      {children}
    </V2Provider>
  );
}