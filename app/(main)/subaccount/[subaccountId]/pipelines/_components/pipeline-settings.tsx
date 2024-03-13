
import React from 'react'
import { Pipeline } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CreatePipelineForm } from '@/components/form/create-pipeline-form'
import { PipelineDeleteButton } from './pipeline-delete-btn'

export const PipelineSettings = ({
  pipelineId,
  subaccountId,
  pipelines,
}: {
  pipelineId: string
  subaccountId: string
  pipelines: Pipeline[]
}) => {
  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={'destructive'}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive">
              <PipelineDeleteButton pipelineId={pipelineId}  />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>

        <CreatePipelineForm
          subAccountId={subaccountId}
          defaultData={pipelines.find((p) => p.id === pipelineId)}
        />
      </div>
    </AlertDialog>
  )
}
