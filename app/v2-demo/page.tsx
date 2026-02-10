'use client';

import V2Demo from '../../v2/pages/Demo';
import { V2Provider } from '../../lib/V2Context';

export default function V2DemoPage() {
  return (
    <V2Provider>
      <V2Demo />
    </V2Provider>
  );
}