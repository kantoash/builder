import { AgencyDetails } from "@/components/form/agency-details";
import { NotAuthorized } from "@/components/not-authorized";
import { getAuthUserDetails, verifyAndAcceptInvitaion } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  };
};

const Page = async ({ searchParams }: Props) => {
 
  const agencyId = await verifyAndAcceptInvitaion();

  const user = await getAuthUserDetails();

  if (agencyId) {
    if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER') {
      return redirect('/subaccount')
    } else if (user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') {
      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split('___')[0]
        const stateAgencyId = searchParams.state.split('___')[1]
        if (!stateAgencyId) return <NotAuthorized/>
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        )
      } else return redirect(`/agency/${agencyId}`)
    } else {
      return <NotAuthorized/>
    }
  }

  const authUser = await currentUser();
  
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl ">
        <h1 className="text-4xl pb-8"> Create An Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default Page;
