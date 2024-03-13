import { InfoBar } from "@/components/info-bar";
import { NotAuthorized } from "@/components/not-authorized";
import { Sidebar } from "@/components/sidebar";
import {
  getAuthUserDetails,
  getNotificationAndUser,
  verifyAndAcceptInvitaion,
} from "@/lib/queries";
import { NotificationWithUser } from "@/lib/types";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
}

const SubAccountIdLayout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitaion();
  if (!agencyId) return <NotAuthorized />;
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  let notifications: NotificationWithUser = [];

  if (!user.privateMetadata.role) {
    return <NotAuthorized />;
  } else {
    const allPermissions = await getAuthUserDetails();
    const hasPermission = allPermissions?.Permissions.find(
      (permissions) =>
        permissions.access && permissions.subAccountId === params.subaccountId
    );
    if (!hasPermission) {
      return <NotAuthorized />;
    }

    const allNotifications = await getNotificationAndUser(agencyId);

    if (
      user.privateMetadata.role === "AGENCY_ADMIN" ||
      user.privateMetadata.role === "AGENCY_OWNER"
    ) {
      notifications = allNotifications;
    } else {
      const filteredNoti = allNotifications?.filter(
        (item) => item.subAccountId === params.subaccountId
      );
      if (filteredNoti) notifications = filteredNoti;
    }
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.subaccountId} type="subaccount" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default SubAccountIdLayout;
