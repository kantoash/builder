import React from "react";

import { Funnel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FunnelForm from "@/components/form/funnel-form";
import { db } from "@/lib/db";

type Props = {
  subaccountId: string;
  defaultData: Funnel;
}

export const FunnelSettings: React.FC<Props> = async ({
  subaccountId,
  defaultData,
}) => {
  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });
  if (!subaccountDetails) return;
  return (
    <div className="flex gap-4 flex-col xl:!flex-row">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      <FunnelForm subAccountId={subaccountId} defaultData={defaultData} />
    </div>
  );
};