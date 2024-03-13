"use client";

import { NotificationWithUser } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface InfoBarProps {
  notifications: NotificationWithUser | [];
  role?: Role
  className?: string;
  subAccountId?: string;
}

export const InfoBar = ({
  notifications,
  role,
  className,
  subAccountId,
}: InfoBarProps) => {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setShowAll] = useState(true);

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(notifications);
    } else {
      if (notifications?.length !== 0) {
        setAllNotifications(
          notifications?.filter((item) => item.subAccountId === subAccountId) ??
            []
        );
      }
    }
    setShowAll((prev) => !prev);
  };

  return (
    <>
      <div
        className={twMerge(
          "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ",
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4  overflow-auto scrollbar-thin ">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  {(role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && (
                    <Card className="flex items-center justify-between p-4">
                      Current Subaccount
                      <Switch onCheckedChange={handleClick} />
                    </Card>
                  )}
                </SheetDescription>
              </SheetHeader>
              <div className="p-3 ">
                {allNotifications?.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center gap-x-2   mb-3 text-ellipsis border border-foreground/20 rounded-lg p-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={notification.User.avatarUrl}
                        alt="Profile Picture"
                      />
                      <AvatarFallback className="bg-primary">
                        {notification.User.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold ">{notification.notification.split("|")[0]}</span>
                      <span className="text-muted-foreground ">
                        {notification.notification.split("|")[1]}
                      </span>
                      <span>{notification.notification.split("|")[2]}</span>
                      <small className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
                {allNotifications?.length === 0 && (
                  <div
                    className="flex items-center justify-center text-muted-foreground"
                    mb-4
                  >
                    You have no notifications
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

{
  /* <div className="flex gap-2">
                  
                    <div className="flex flex-col gap-y-1">
                      <p>
                        <span>
                          {notification.notification.split("|")[0]}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {notification.notification.split("|")[1]}
                        </span>
                        <span>
                          {notification.notification.split("|")[2]}
                        </span>
                      </p>
                      <small className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div> */
}
