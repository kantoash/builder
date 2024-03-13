'use client'

import CustomModal from '@/components/custom-modal'
import { ContactUserForm } from "@/components/form/contact-user-form";
import { Button } from '@/components/ui/button'
import { useModal } from '@/provider/modal-provider'
import React from 'react'

type Props = {
    subaccountId: string
}

export const CreateContactButton = ({ subaccountId }: Props) => {
    const { setOpen } = useModal();
    const handleCreateContact = async () => {
        setOpen(
          <CustomModal
            title="Create Or Update Contact information"
            subheading="Contacts are like customers."
          >
            <ContactUserForm subaccountId={subaccountId} />
          </CustomModal>
        )
      }
  return (
    <Button
    onClick={handleCreateContact}>Create Contact</Button>
  )
}