"use client";

import { Button } from "@/components/ui/button";
import {
  deleteContact,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  contactId: string;
  subaccountId: string;
};

export const DeleteContactButton = ({ contactId, subaccountId }: Props) => {
  const router = useRouter();
  const handleDeleteCotact = async () => {
    try {
      const response = await deleteContact(contactId);

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a subaccount | ${response?.name}`,
        subaccountId,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      variant={"destructive"}
      className="text-white"
      onClick={handleDeleteCotact}
    >
      Delete Contact
    </Button>
  );
};
