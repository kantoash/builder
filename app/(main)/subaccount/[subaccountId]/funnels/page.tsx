import { getFunnels } from '@/lib/queries'
import React from 'react'
import { Plus } from 'lucide-react'
import {FunnelsDataTable} from './_components/data-table'
import { columns } from './_components/columns'
import BlurPage from '@/components/blur-page'
import FunnelForm from '@/components/form/funnel-form'

const Page = async ({ params }: { params: { subaccountId: string } }) => {
  const funnels = await getFunnels(params.subaccountId)
  if (!funnels) return null

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}/>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  )
}

export default Page