import BlurPage from "@/components/blur-page";
import { SubAccountDetails } from "@/components/form/subaccount-details";
import { UserDetails } from "@/components/form/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    subaccountId: string;
  };
}

const Page = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) {
    return redirect("/sign-in");
  }
  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  });
  if (!userDetails) {
    return;
  }

  const subAccount = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
  });
  if (!subAccount) return;

  const agencyDetails = await db.agency.findUnique({
    where: { id: subAccount.agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return;
  const subAccounts = agencyDetails.SubAccount;

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetails
          type="subaccount"
          id={params.subaccountId}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </BlurPage>
  );
};

export default Page;
