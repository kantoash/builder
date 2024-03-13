'use client'
import { Button } from '@/components/ui/button'
import {
    deleteSubAccount,
    getSubaccountDetails,
  saveActivityLogsNotification,
} from '@/lib/queries'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  subaccountId: string
}
 
 export const DeleteButton = ({ subaccountId }: Props) => {
  const router = useRouter()

  const subAccountDelete = async () => {
    const subAccount = await getSubaccountDetails(subaccountId)
    if (!subAccount?.id) {
      return;
    }
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a subaccount | ${subAccount?.name}`,
      subaccountId,
    })

    await deleteSubAccount(subAccount.id)
    router.refresh()
  }
  
  return (
    <Button
    variant={'destructive'}
      className="text-white"
      onClick={subAccountDelete}
    >
      Delete Sub Account
    </Button>
  )
}
