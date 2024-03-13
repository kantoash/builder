'use client'

import { Button } from '@/components/ui/button'
import { deletePipeline } from '@/lib/queries'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {
    pipelineId: string;
}

export const PipelineDeleteButton = ({
    pipelineId
}:Props) => {
    
  const router = useRouter()
  const DeletePipeline = async () => {
    try {
      await deletePipeline(pipelineId);
      toast('Pipeline is deleted');
      router.refresh();
    } catch (error) {
      toast('Could Delete Pipeline');
    }
  }
  return (
    <Button variant={'destructive'} onClick={DeletePipeline} className='text-white'>Delete Pipeline</Button>
  )
}
