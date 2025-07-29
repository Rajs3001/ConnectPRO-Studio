import dynamic from 'next/dynamic';
import React from 'react';

const Chat3DCharacter = dynamic(() => import('../src/components/legacy/Chat3DCharacter'), { ssr: false });

export default function ThreeDCharacterPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #18181B 0%, #6366F1 50%, #06B6D4 100%)' }}>
      <Chat3DCharacter />
    </div>
  );
} 