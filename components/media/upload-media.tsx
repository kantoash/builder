"use client";
import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createMedia, saveActivityLogsNotification } from "@/lib/queries";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadMediaSchema } from "@/lib/schema";

type Props = {
  subaccountId: string;
  setClose: () => void
}



export const UploadMediaForm = ({ subaccountId, setClose }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof UploadMediaSchema>>({
    resolver: zodResolver(UploadMediaSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof UploadMediaSchema>) {
    try {
      const response = await createMedia(subaccountId, values);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded a media file | ${response.name}`,
        subaccountId,
      });

      toast("Uploaded media");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast("Could not uploaded media");
    }
    setClose();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
            disabled={isLoading}
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="mt-4">
              Upload Media
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
