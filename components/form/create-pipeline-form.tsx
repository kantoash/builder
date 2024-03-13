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
import { Pipeline } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  saveActivityLogsNotification, upsertPipeline,
} from '@/lib/queries'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/provider/modal-provider'
import { toast } from 'sonner'
import Loading from '../loading'
import { CreatePipelineFormSchema } from '@/lib/schema'

type Props = {
  defaultData?: Pipeline
  subAccountId: string
}

export const CreatePipelineForm = ({
  defaultData,
  subAccountId,
}:Props) => {
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(CreatePipelineFormSchema),
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

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) return
    try {
      const response = await upsertPipeline({
        ...values,
        id: defaultData?.id,
        subAccountId: subAccountId,
      })

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updates a pipeline | ${response?.name}`,
        subaccountId: subAccountId,
      })
      toast('Saved pipeline details')
      router.refresh();
    } catch (error) {
      toast('Could not save pipeline details')
    }

    setClose()
  }
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
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
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
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
