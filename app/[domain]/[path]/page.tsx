import { FunnelEditor } from '@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'
import { getDomainContent } from '@/lib/queries'
import EditorProvider from '@/provider/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    domain: string
    path: string
  }
}

const Page = async ({
  params
}:Props) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));

  if (!domainData) {
    notFound();
  }

  const pageData = domainData.FunnelPages.find((page) => page.pathName === params.path);

  if (!pageData) {
    notFound();
  }
  

  return (
      <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor
        funnelPageId={pageData.id}
        liveMode={true}
      />
    </EditorProvider>
  )
}

export default Page