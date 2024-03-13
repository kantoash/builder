'use client'

import React from 'react'
import { Button } from '../ui/button'
import { useModal } from '@/provider/modal-provider'
import CustomModal from '../custom-modal'
import { UploadMediaForm } from './upload-media'

type Props = {
  subaccountId: string
}

export const MediaUploadButton = ({ subaccountId }: Props) => {
  const { setOpen, setClose } = useModal()

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <UploadMediaForm setClose={setClose} subaccountId={subaccountId}/>
          </CustomModal>
        )
      }}
    >
      Upload
    </Button>
  )
}