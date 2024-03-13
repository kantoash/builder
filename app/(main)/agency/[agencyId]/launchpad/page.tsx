import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { getStripeOAuthLink } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

type Props = {
  params: {
    agencyId: string;
  };
  searchParams: {
    code: string;
  };
};

const Page = async ({ params, searchParams }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
  });

  if (!agencyDetails) return;

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  const stripeOAuthLink = getStripeOAuthLink(
    "agency",
    `launchpad__${agencyDetails.id}`
  );

  let connectedStripeAccount = false;

  if (searchParams.code) {
    if (!agencyDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: searchParams.code,
        });
        await db.agency.update({
          where: { id: params.agencyId },
          data: { connectAccountId: response.stripe_user_id },
        });
        connectedStripeAccount = true;
      } catch (error) {
        console.log("🔴 Could not connect stripe account");
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-center md:justify-between text-center items-center w-full border p-4 gap-2 rounded-lg">
              <Image
                src="/appstore.png"
                alt="app logo"
                height={80}
                width={80}
                className="rounded-md object-cover"
              />
              <p className="text-sm mr-2">
                {" "}
                Save the website as a shortcut on your mobile device
              </p>
              <Button variant={"default"}>Start</Button>
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-between text-center items-center w-full border p-4 gap-2 rounded-lg">
              <Image
                src="/stripelogo.png"
                alt="app logo"
                height={80}
                width={80}
                className="rounded-md object-cover"
              />
              <p className="text-sm mr-2">
                Connect your stripe account to accept payments and see your
                dashboard.
              </p>
              {agencyDetails.connectAccountId || connectedStripeAccount ? (
                <CheckCircleIcon
                  size={50}
                  className=" text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="bg-primary py-2 px-4 rounded-md text-white"
                  href={stripeOAuthLink}
                >
                  Start
                </Link>
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-between text-center items-center w-full border p-4 gap-2 rounded-lg">
              <Image
                src={agencyDetails.agencyLogo}
                alt="app logo"
                height={80}
                width={80}
                className="rounded-md object-cover"
              />
              <p className="text-sm mr-2">
                {" "}
                Fill in all your bussiness details
              </p>
              {allDetailsExist ? (
                <CheckCircleIcon
                  size={50}
                  className="text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="bg-primary py-2 px-4 rounded-md text-white"
                  href={`/agency/${params.agencyId}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
