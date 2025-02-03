'use client';

// TODO: Remove at after discussion with RJ
import dynamic from 'next/dynamic'
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('@/components/module/test/index'),
  { ssr: false }
)

export default function ModuleTestingPage() {
  
  
  return (
    <>
      <main className='main-container main-container-alternate'>
          <DynamicComponentWithNoSSR />
      </main>
    </>
  );
}