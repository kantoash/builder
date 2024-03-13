import { NotAuthorized } from "@/components/not-authorized";
import { getAuthUserDetails, verifyAndAcceptInvitaion } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: {
    state: string;
    code: string;
  };
}

const Page = async ({ searchParams }: Props) => {
  const agencyId = await verifyAndAcceptInvitaion();

  if (!agencyId) {
    return <NotAuthorized />;
  }

  const user = await getAuthUserDetails();
  if (!user) return;

  const getFirstSubaccountWithAccess = user.Permissions.find(
    (permission) => permission.access === true
  );

  if (searchParams.state) {
    const statePath = searchParams.state.split("___")[0];
    const stateSubaccountId = searchParams.state.split("___")[1];
    if (!stateSubaccountId) return <NotAuthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }

  return <NotAuthorized />;
};

export default Page;
