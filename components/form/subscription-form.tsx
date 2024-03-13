'use client'
import { Button } from '@/components/ui/button'
import { Plan } from '@prisma/client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  selectedPriceId: string | Plan
}

export const SubscriptionForm = ({ selectedPriceId }: Props) => {
  const elements = useElements()
  const stripeHook = useStripe()
  const [priceError, setPriceError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPriceId) {
      setPriceError('You need to select a plan to subscribe.')
      return
    }
    setPriceError('')
    if (!stripeHook || !elements) return

    try {
      const { error } = await stripeHook.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
        },
      })
      if (error) {
        throw new Error()
      }
      toast('Your payment has been successfully processed. ')
    } catch (error) {
      console.log(error)
      toast('We couldnt process your payment. Please try a different card')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <small className="text-destructive">{priceError}</small>
      <PaymentElement />
      <Button
        disabled={!stripeHook}
        className="mt-4 w-full"
      >
        Submit
      </Button>
    </form>
  )
}