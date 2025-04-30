import React from 'react'
import { getPresentationById } from '@/drizzle/presentation';
import OriginalPresentation from '@/components/original-presentation';
import PresentationVersions from '@/components/presentation-versions';
import AiChat from '@/components/ai-chat';

export default async function EnhancePage({params}: {params: Promise<{presentationId: string}>}) {
  // const { presentationId } = await params;
  // const presentation = await getPresentationById({ id: Number(presentationId) });
  return (
    <div className='grid grid-cols-[60fr_40fr] gap-4 place-items-center h-full'>
      <OriginalPresentation fileUrl={'https://7jpnnglevw.ufs.sh/f/6yOcH1TFDt8E99uFVx58EZGCptJ7iFgWe2uxoUXjv3h09LTI'} />
      <AiChat />
      <PresentationVersions />
    </div>
  )
}
