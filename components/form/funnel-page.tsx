"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FunnelPage } from "@prisma/client";
import { FunnelPageSchema } from "@/lib/schema";
import {
  deleteFunnelePage,
  getFunnels,
  saveActivityLogsNotification,
  upsertFunnelPage,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { CopyPlusIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import Loading from "../loading";

type Props = {
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
  subaccountId: string;
};

export const CreateFunnelPage = ({
  defaultData,
  funnelId,
  order,
  subaccountId,
}: Props) => {
  const router = useRouter();
  const [deletePage, setDeletePage] = useState(false);
  const [copyPage, setCopyPage] = useState(false);
  const form = useForm<z.infer<typeof FunnelPageSchema>>({
    resolver: zodResolver(FunnelPageSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData]);

  const isLoading = form.formState.isSubmitting;

  const handleDeletePage = async () => {
    if (!defaultData) {
      return;
    }
    setDeletePage(true);
    const response = await deleteFunnelePage(defaultData.id);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a funnel page | ${response?.name}`,
      subaccountId: subaccountId,
    });
    setDeletePage(false);
    router.refresh();
  };

  const handleCopyPage = async () => {
    if (!defaultData) {
      return
    }
    setCopyPage(true);
    const response = await getFunnels(subaccountId)
    const lastFunnelPage = response.find(
      (funnel) => funnel.id === funnelId
    )?.FunnelPages.length

    await upsertFunnelPage(
      subaccountId,
      {
        ...defaultData,
        id: v4(),
        order: lastFunnelPage ? lastFunnelPage : 0,
        visits: 0,
        name: `${defaultData.name} Copy`,
        pathName: `${defaultData.pathName}copy`,
        content: defaultData.content,
      },
      funnelId
    )
    toast('Saves Funnel Page Details')
    setCopyPage(false);
    router.refresh()

  }

  const onSubmit = async (values: z.infer<typeof FunnelPageSchema>) => {
    if (order !== 0 && !values.pathName)
      return form.setError("pathName", {
        message:
          "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });
    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...values,
          id: defaultData?.id || v4(),
          order: defaultData?.order || order,
          pathName: values.pathName || "",
        },
        funnelId
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subaccountId: subaccountId,
      });

      toast("Saves Funnel Page Details");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast("Could Save Funnel Page Details");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You
          can move them around to change their order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Path for the page"
                      {...field}
                      value={field.value?.toLowerCase()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                className="w-22 self-end"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? <Loading /> : "Save Page"}
              </Button>

              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  className="w-22 self-end border-destructive text-destructive hover:bg-destructive"
                  disabled={deletePage}
                  type="button"
                  onClick={handleDeletePage}
                >
                  {deletePage ? <Loading /> : <Trash />}
                </Button>
              )}
              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={copyPage}
                  type="button"
                  onClick={handleCopyPage}
                >
                  {copyPage ? <Loading /> : <CopyPlusIcon />}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
