'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
// using dynamic to get around React and Next.js hydration issue
// see https://nextjs.org/docs/messages/react-hydration-error
const DynamicCreateNewProjectPanel = dynamic(() => import('@/components/project/create-new-project'), {
  ssr: false,
});
export default function ProjectsPage() {
  
  return (
    <>
      <main className='main-container main-container-alternate'>
          <Suspense fallback={<div>Loading component...</div>}>
            <DynamicCreateNewProjectPanel />
          </Suspense>
      </main>
    </>
  );
}
