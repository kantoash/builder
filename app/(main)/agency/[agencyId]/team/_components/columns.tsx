"use client";

import clsx from "clsx";
import { ColumnDef } from "@tanstack/react-table";
import {
  Role, User,
} from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash, User2 } from "lucide-react";
import { deleteUser, getUser } from "@/lib/queries";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsersWithAgencySubAccountPermissionsSidebarOptions } from "@/lib/types";
import { useModal } from "@/provider/modal-provider";
import CustomModal from "@/components/custom-modal";
import { UserDetails } from "@/components/form/user-details";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<UsersWithAgencySubAccountPermissionsSidebarOptions>[] =
  [
    {
      accessorKey: "id",
      header: "",
      cell: () => {
        return null;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const avatarUrl = row.getValue("avatarUrl") as string;
        return (
          <div className="flex items-center gap-2">
            <div className="h-11 w-11 relative flex-none">
            <Avatar>
                <AvatarImage
                  src={avatarUrl}
                  className="rounded-full object-cover"
                  alt="avatar image"
                />
                <AvatarFallback>
                  <User2 />
                </AvatarFallback>
              </Avatar>
            </div>
            <span>{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "avatarUrl",
      header: "",
      cell: () => {
        return null;
      },
    },
    { accessorKey: "email", header: "Email" },

    {
      accessorKey: "SubAccount",
      header: "Owned Accounts",
      cell: ({ row }) => {
        const isAgencyOwner = row.getValue("role") === "AGENCY_OWNER";
        const ownedAccounts = row.original?.Permissions.filter(
          (per) => per.access 
        );

        if (isAgencyOwner)
          return (
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-2">
                <Badge className="bg-slate-600 whitespace-nowrap">
                  Agency - {row?.original?.Agency?.name}
                </Badge>
              </div>
            </div>
          );

        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              {ownedAccounts?.length ? (
                ownedAccounts.map((account) => (
                  <Badge
                    key={account.id}
                    className="bg-slate-600 w-fit whitespace-nowrap"
                  >
                    Sub Account - {account.SubAccount.name}
                  </Badge>
                ))
              ) : (
                <div className="text-muted-foreground">No Access Yet</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role: Role = row.getValue("role");
        return (
          <Badge
            className={clsx({
              "bg-emerald-500": role === "AGENCY_OWNER",
              "bg-orange-400": role === "AGENCY_ADMIN",
              "bg-primary": role === "SUBACCOUNT_USER",
              "bg-muted": role === "SUBACCOUNT_GUEST",
            })}
          >
            {role}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rowData = row.original;

        return <CellActions  rowData={rowData} />;
      },
    },
  ];

type CellActionsProps = {
  rowData: UsersWithAgencySubAccountPermissionsSidebarOptions;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!rowData) return;
  if (!rowData.Agency) return;

  const deleteTeamMember = async () => {
    try {
      setLoading(true);
      await deleteUser(rowData.id);
      toast(
        "The user has been deleted from this agency they no longer have access to the agency"
      );
      setLoading(false);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(rowData?.email)
  }
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={copyEmail}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal
                  subheading="You can change permissions only when the user has an owned subaccount"
                  title="Edit User Details"
                >
                  <UserDetails
                    type="agency"
                    id={rowData?.Agency?.id || null}
                    subAccounts={rowData?.Agency?.SubAccount}
                  />
                </CustomModal>,
                async () => {
                  return { user: await getUser(rowData?.id) };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          {rowData.role !== "AGENCY_OWNER" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the user
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={deleteTeamMember}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
