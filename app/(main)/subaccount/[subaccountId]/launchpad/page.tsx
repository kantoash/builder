import BlurPage from '@/components/blur-page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { getStripeOAuthLink } from '@/lib/utils'
import { CheckCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface LaunchpadPageProps {
    searchParams: {
        state: string,
        code: string
    },
    params: {
        subaccountId: string
    }
}

const LaunchpadPage = async ({
    searchParams,
    params
}:LaunchpadPageProps) => {
    const subaccountDetails = await db.subAccount.findUnique({
        where: {
            id: params.subaccountId
        }
    })

    if (!subaccountDetails) {
        return;
    }

    const allDetailsExist =
    subaccountDetails.address &&
    subaccountDetails.subAccountLogo &&
    subaccountDetails.city &&
    subaccountDetails.companyEmail &&
    subaccountDetails.companyPhone &&
    subaccountDetails.country &&
    subaccountDetails.name &&
    subaccountDetails.state
   
  const stripeOAuthLink = getStripeOAuthLink(
    "subaccount",
    `launchpad__${subaccountDetails.id}`
  );

  let connectedStripeAccount = false

  if (searchParams.code) {
    if (!subaccountDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: 'authorization_code',
          code: searchParams.code,
        })
        await db.subAccount.update({
          where: { id: params.subaccountId },
          data: { connectAccountId: response.stripe_user_id },
        })
        connectedStripeAccount = true
      } catch (error) {
        console.log('🔴 Could not connect stripe account')
      }
    }
  }


  return (
    <BlurPage>
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-full max-w-[800px]">
        <Card className="border-none ">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 ">
            <div className="flex flex-col md:flex-row justify-center md:justify-between text-center  border  items-center w-full p-4 rounded-lg gap-2 ">
              <Image
                src="/appstore.png"
                alt="App logo"
                height={80}
                width={80}
                className="rounded-md object-contain"
              />
              <p className="text-sm mr-2">
                Save the website as a shortcut on your mobile devide
              </p>
              <Button variant={"default"}>Start</Button>
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-between text-center items-center w-full border p-4 gap-2 rounded-lg ">
                 <Image
                    src="/stripelogo.png"
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain "
                  />
                  <p className='text-sm mr-2'>
                    Connect your stripe account to accept payments. Stripe is
                    used to run payouts.
                  </p>
                {subaccountDetails.connectAccountId ||
                connectedStripeAccount ? (
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
                    src={subaccountDetails.subAccountLogo}
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-cover "
                  />
                  <p className='text-sm mr-2'>Fill in all your business details.</p>
                {allDetailsExist ? (
                  <CheckCircleIcon
                    size={50}
                    className=" text-primary p-2 flex-shrink-0"
                  />
                ) : (
                  <Link
                    className="bg-primary py-2 px-4 rounded-md text-white"
                    href={`/subaccount/${subaccountDetails.id}/settings`}
                  >
                    Start
                  </Link>
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </BlurPage>
  )
}

export default LaunchpadPage