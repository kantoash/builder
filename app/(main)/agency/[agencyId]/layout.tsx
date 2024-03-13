import BlurPage from "@/components/blur-page";
import { InfoBar } from "@/components/info-bar";
import { NotAuthorized } from "@/components/not-authorized";
import { Sidebar } from "@/components/sidebar";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitaion,
} from "@/lib/queries";
import { NotificationWithUser } from "@/lib/types";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const Layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitaion();
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!agencyId) {
    return redirect("/agency");
  }

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <NotAuthorized />;

  let allNoti: NotificationWithUser = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) allNoti = notifications;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} role={user.privateMetadata.role as Role} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default Layout;
