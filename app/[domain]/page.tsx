import { db } from "@/lib/db";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/provider/editor/editor-provider";
import { notFound } from "next/navigation";
import React from "react";
import { FunnelEditor } from "../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";

type Props = {
  params: {
    domain: string;
  };
};

const Page = async ({ params }: Props) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));

  if (!domainData) {
    notFound();
  }

  const pageData = domainData.FunnelPages.find((page) => !page.pathName);

  if (!pageData) {
    return notFound();
  }

  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });
  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Page;
