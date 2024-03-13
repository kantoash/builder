import { AgencyDetails } from "@/components/form/agency-details";
import { UserDetails } from "@/components/form/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    agencyId: string;
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
    return null;
  }

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;
  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex lg:!flex-row flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails
        type="agency"
        id={params.agencyId}
        subAccounts={subAccounts}
        userData={userDetails}
      />
    </div>
  );
};

export default Page;
