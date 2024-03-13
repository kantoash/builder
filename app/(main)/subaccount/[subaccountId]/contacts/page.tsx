import BlurPage from "@/components/blur-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { SubaccountWithContact } from "@/lib/types";
import format from "date-fns/format";
import { Ticket } from "@prisma/client";
import React from "react";
import { CreateContactButton } from "./_components/create-contact-btn";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DeleteContactButton } from "./_components/delete-contact-btn";

type Props = {
  params: {
    subaccountId: string;
  };
};

const Page = async ({ params }: Props) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userDetails = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userDetails) {
    return null;
  }

  const contacts = (await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
    include: {
      Contact: {
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })) as SubaccountWithContact;
  const allContacts = contacts.Contact;

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets || !tickets.length) {
      return "$0.00";
    }
    const amt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "INR",
    });

    const laneAmt = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    );

    return amt.format(laneAmt);
  };

  return (
    <BlurPage>
      <AlertDialog>
        <h1 className="text-4xl p-4">Contacts</h1>
        <CreateContactButton subaccountId={params.subaccountId} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[300px]">Email</TableHead>
              <TableHead className="w-[200px]">Active</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="w-[200px] text-right ">
                Total Value
              </TableHead>
              <TableHead className="w-[200px]">Trash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="truncate">
            {allContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage alt="contact image" />
                    <AvatarFallback className="bg-primary text-white">
                      {contact.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  {formatTotal(contact.Ticket) === "$0.00" ? (
                    <Badge variant={"destructive"}>Inactive</Badge>
                  ) : (
                    <Badge className="bg-emerald-700">Active</Badge>
                  )}
                </TableCell>
                <TableCell>{format(contact.createdAt, "MM/dd/yyyy")}</TableCell>
                <TableCell className="text-right">
                  {formatTotal(contact.Ticket)}
                </TableCell>

                {userDetails.role === "AGENCY_ADMIN" ||
                  (userDetails.role === "AGENCY_OWNER" && (
                    <TableCell>
                      <AlertDialogTrigger className="flex gap-1 items-center">
                        {/* to do restriction only for owner and admin */}
                        <Trash size={15} /> / Remove Contact
                      </AlertDialogTrigger>
                    </TableCell>
                  ))}

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      This action cannot be undone. This will permanently delete
                      the contact and related data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive">
                      <DeleteContactButton
                        contactId={contact.id}
                        subaccountId={params.subaccountId}
                      />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AlertDialog>
    </BlurPage>
  );
};

export default Page;
