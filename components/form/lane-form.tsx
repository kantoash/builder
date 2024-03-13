'use client'

import React, { useEffect } from 'react'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Lane } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LaneFormSchema } from '@/lib/schema'
import {
  getPipelineDetails,
  saveActivityLogsNotification,
  upsertLane,
} from '@/lib/queries'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/provider/modal-provider'
import { toast } from 'sonner'
import Loading from '../loading'

type Props = {
  defaultData?: Lane
  pipelineId: string
}

export const LaneForm  = ({
  defaultData,
  pipelineId,
}: Props) => {
  const { setClose } = useModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof LaneFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(LaneFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
    },
  })

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || '',
      })
    }
  }, [defaultData])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
    if (!pipelineId) return
    try {
      const response = await upsertLane({
        ...values,
        id: defaultData?.id,
        pipelineId: pipelineId,
        order: defaultData?.order,
      })

      const d = await getPipelineDetails(pipelineId)
      if (!d) return

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a lane | ${response?.name}`,
        subaccountId: d.subAccountId,
      })

      toast('Saved pipeline details')

      router.refresh()
    } catch (error) {
      toast('Could not save pipeline details')
    }
    setClose()
  }
  
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lane Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lane Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? <Loading /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
