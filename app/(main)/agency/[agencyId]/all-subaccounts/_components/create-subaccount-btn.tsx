'use client'

import CustomModal from "@/components/custom-modal";
import { SubAccountDetails } from "@/components/form/subaccount-details";
import { Button } from "@/components/ui/button";
import { AuthUserWithAgencySigebarOptionsSubAccounts } from "@/lib/types";
import { useModal } from "@/provider/modal-provider";
import { User, Agency, SubAccount, AgencySidebarOption } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  user: AuthUserWithAgencySigebarOptionsSubAccounts;
  id: string;
  className: string;
}

export const CreateSubaccountButton = ({ className, id, user }:Props) => {
    const { setOpen } = useModal()
    const agencyDetails = user?.Agency
  
    if (!agencyDetails) return;
  return (
    <Button
    className={twMerge('w-full flex gap-4', className)}
    onClick={() => {
      setOpen(
        <CustomModal
          title="Create a Subaccount"
          subheading="You can switch bettween"
        >
          <SubAccountDetails
            agencyDetails={agencyDetails}
            userId={user.id}
            userName={user.name}
          />
        </CustomModal>
      )
    }}
  >
    <PlusCircleIcon size={15} />
    Create Sub Account
  </Button>)
};
