import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const NotAuthorized = () => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized acccess!</h1>
      <p>Please contact support or your agency owner to get</p>
      <Button variant="secondary" asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
};
