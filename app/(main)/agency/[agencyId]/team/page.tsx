import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import React from 'react'
import DataTable from './_components/data-table'
import { Plus } from 'lucide-react'
import { SendInvitation } from '@/components/form/send-invitaion'
import { columns } from './_components/columns'
import { redirect } from 'next/navigation'

type Props = {
  params: {
    agencyId: string
  }
}

const Page = async ({
  params
}:Props) => {
  const authUser = await currentUser()
  if (!authUser) return redirect('/sign-in');

  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  })

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  })

  if (!agencyDetails) return;
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  )
}

export default Page