"use client";

import { useStateContext } from "@/context/AppConext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssesmentFn, updateControlReplyFn } from "@/api/assessmentsApi";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";
import CreateIcon from "@/icons/CreateIcon";
import DeleteIcon from "@/icons/DeleteIcon";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import { TypeOf, object, string, z } from "zod";
import { getMaturityLevelListFn } from "@/api/selectablesApi";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import SubmitButton from "@/components/SubmitButton";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AssesmentBadge from "@/components/AssesmentBadge";
import AddEvidence from "./AddEvidence";

type PageProps = {
  params: {
    id: string;
  };
};

const updateControlReplySchema = object({
  reply: string().min(1, "Name is required"),
  maturity_level: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

type IControlReply = TypeOf<typeof updateControlReplySchema>;
const Show = ({ params: { id } }: PageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pageInfo, setPageInfo] = useState({
    pageCount: 0,
    pageNumber: 0,
    pageId: "0",
  });
  const { isLoading, data } = useQuery(
    ["assesments", id],
    () => getAssesmentFn(id),
    {
      select: (data) => data.data,
      retry: 1,
      onSuccess({ controls }) {
        setPageInfo({
          pageCount: controls.length,
          pageNumber: 0,
          pageId: controls[0].id.toString(),
        });
      },
      onError: (error) => {
        if ((error as any).response?.data?.message) {
          toast.error((error as any).response?.data?.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const {
    isLoading: isMaturityLevelLoading,
    isSuccess: isMaturityLevelSuccess,
    data: maturityLevels,
  } = useQuery(["maturity_levels"], () => getMaturityLevelListFn(), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      console.log(error);
      if ((error as any).response?.data.message) {
        toast.error((error as any).response?.data.message, {
          position: "top-right",
        });
      }
    },
  });

  const { isLoading: isUpdatingReply, mutate: updateControlReply } =
    useMutation(
      ({
        assesment_control_id,
        reply,
      }: {
        assesment_control_id: string;
        reply: { reply: string; maturity_level: string };
      }) => updateControlReplyFn({ assesment_control_id, reply }),
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          queryClient.invalidateQueries(["assesments"]);
        },
        onError: (error: any) => {
          if ((error as any).response?.data?.message) {
            toast.error((error as any).response?.data?.message, {
              position: "top-right",
            });

            (error as any).response?.data.data.map((msg: string) =>
              toast.error(msg, {
                position: "top-right",
              })
            );
          }
        },
      }
    );

  const methods = useForm<IControlReply>({
    resolver: zodResolver(updateControlReplySchema),
  });
  const {
    formState: { isSubmitSuccessful },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  useUpdateEffect(() => {
    methods.reset({
      reply: data?.controls[pageInfo.pageNumber]?.reply ?? "",
      maturity_level: {
        label: data?.controls[pageInfo.pageNumber]?.maturity_level,
        value: data?.controls[pageInfo.pageNumber]?.maturity_level,
      },
    });
  }, [pageInfo]);

  const onSubmitHandler: SubmitHandler<IControlReply> = (values) => {
    updateControlReply({
      assesment_control_id: pageInfo.pageId,
      reply: {
        reply: values.reply,
        maturity_level: values.maturity_level.value,
      },
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/assesments"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="mt-5 space-y-2">
        <div className="min-w-full rounded gap-5 lg:grid lg:grid-cols-2">
          <div className="lg:block lg:col-span-1 space-y-2 px-4 py-6  rounded-md bg-white dark:bg-darker">
            <section>
              {/* Assesment Details */}

              <span className="text-gray-600 font-bold">{"Details:"}</span>
              <Separator className="my-2" />
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Framework {":"}</label>
                  <span className="text-sm">{data?.framework}</span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Code {":"}</label>
                  <span className="text-sm">{data?.code}</span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Status {":"}</label>
                  <AssesmentBadge status={data?.status ?? "N/A"} />
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">Due Date {":"}</label>
                  <span className="text-sm">
                    {data?.due_date?.toString() ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <label className="text-sm font-medium">
                    Created At {":"}
                  </label>
                  <span className="text-sm">{data?.created_at.toString()}</span>
                </div>
              </div>
            </section>
          </div>
          <div className="lg:col-span-1 px-4 py-6 rounded-md bg-white dark:bg-darker">
            <section>
              {/* Organization Details */}

              <span className="text-gray-600 font-bold">{"Regulator:"}</span>
              <Separator className="my-2" />
              <div className="flex justify-start gap-3">
                <Avatar>
                  <AvatarImage
                    className="h-14 w-14"
                    src={data?.regulator.logo}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-3">
                    <span className="text-sm">{data?.regulator.name}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-sm">
                      {data?.regulator.email_domain}
                    </span>
                  </div>
                  {/* <div className="flex gap-3">
                  <label className="text-sm font-medium">Code {":"}</label>
                  <span className="text-sm">{data?.organization.code}</span>
                </div> */}
                </div>
              </div>
            </section>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            key={pageInfo?.pageNumber}
            initial={{ opacity: 0, y: "20%" }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                ease: "easeOut",
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              y: "20%",
              transition: {
                ease: "easeIn",
                duration: 0.2,
              },
            }}
            className="space-y-2"
          >
            <div className="min-w-full rounded gap-5  lg:grid">
              <div className="px-4 py-6 rounded-md bg-white dark:bg-darker">
                <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-36">
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-600 font-bold">{"Domain:"}</span>
                    <Separator />
                    <div className="flex gap-3">
                      <label className="text-sm font-medium">{"Name:"}</label>
                      <span className="text-sm">
                        {
                          data?.controls[pageInfo.pageNumber]?.control
                            .sub_domain.domain.name
                        }
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <label className="text-sm font-medium">Code {":"}</label>
                      <span className="text-sm">
                        {
                          data?.controls[pageInfo.pageNumber]?.control
                            .sub_domain.domain.code
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-600 font-bold">
                      {"Sub Domain:"}
                    </span>
                    <Separator />
                    <div className="flex gap-3">
                      <label className="text-sm font-medium">{"Name:"}</label>
                      <span className="text-sm">
                        {
                          data?.controls[pageInfo.pageNumber]?.control
                            .sub_domain.name
                        }
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <label className="text-sm font-medium">Code {":"}</label>
                      <span className="text-sm">
                        {
                          data?.controls[pageInfo.pageNumber]?.control
                            .sub_domain.code
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 my-3">
                  <span className="text-gray-600 font-bold">{"Control:"}</span>
                  <Separator className="my-2" />
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Status {":"}</label>
                    <span className="text-sm">
                      <AssesmentBadge
                        status={
                          data?.controls[pageInfo.pageNumber]?.status ?? "N/A"
                        }
                      />
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">
                      Target Date {":"}
                    </label>
                    <span className="text-sm">
                      {data?.controls[
                        pageInfo.pageNumber
                      ]?.target_date?.toString() ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Name {":"}</label>
                    <span className="text-sm">
                      {data?.controls[pageInfo.pageNumber]?.control.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Code {":"}</label>
                    <span className="text-sm">
                      {data?.controls[pageInfo.pageNumber]?.control.code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-w-full rounded gap-5 lg:grid">
              <div className="px-4 py-6 rounded-md bg-white dark:bg-darker">
                <div className="w-full relative px-4 py-6 space-y-6 rounded-md dark:bg-darker">
                  <FormProvider {...methods}>
                    <form
                      className="space-y-6"
                      noValidate
                      autoComplete="off"
                      onSubmit={methods.handleSubmit(onSubmitHandler)}
                    >
                      <div className="grid grid-cols-1">
                        <FormSelect
                          label="Maturity Level"
                          name="maturity_level"
                          isLoading={isMaturityLevelLoading}
                          data={
                            isMaturityLevelSuccess
                              ? maturityLevels.data.map((item) => ({
                                  value: item,
                                  label: item,
                                }))
                              : []
                          }
                          isMulti={false}
                          isRtl={false}
                        />
                      </div>
                      <div className="grid grid-cols-1">
                        <FormTextArea label="Reply" rows={3} name="reply" />
                      </div>
                      <div className="flex">
                        <SubmitButton
                          title="Submit"
                          clicked={isUpdatingReply}
                          loadingTitle="loading..."
                          icon={<DocumentPlusIcon className="h-5 w-5" />}
                        />
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </div>
            <div className="min-w-full rounded gap-5 lg:grid">
              <div className="px-4 py-6 rounded-md bg-white dark:bg-darker">
                <div className="flex justify-end">
                  {/* model goes here */}
                  <AddEvidence id={pageInfo.pageId} />
                </div>
                <ScrollArea className="h-72 w-full rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                      uploads
                    </h4>
                    <div className="flex flex-col space-y-2">
                      {data?.controls[pageInfo.pageNumber]?.evidances.map(
                        ({ notes, file, type }, i) => (
                          <div className="flex flex-col space-y-1" key={i}>
                            <div className="text-sm">
                              {"note: "} {notes ?? "N/A"}
                            </div>
                            <div className="flex h-5 items-center space-x-4 text-sm">
                              <Link
                                href={file}
                                className="text-blue-600 underline"
                                target="_blank"
                              >{`Evidence ${i + 1}`}</Link>
                              <Separator orientation="vertical" />
                              <div>{`type: ${type}`}</div>
                            </div>
                            <Separator className="my-2" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="min-w-full rounded py-10">
          <div className="flex gap-5 justify-center">
            {/* <!-- Previous Button --> */}
            <button
              onClick={() => {
                setPageInfo((prev) => ({
                  ...prev,
                  pageNumber: prev.pageNumber - 1,
                  pageId:
                    data?.controls[prev.pageNumber - 1]?.id.toString() ?? "0",
                }));
              }}
              disabled={pageInfo.pageNumber === 0}
              className="flex items-center justify-center px-3 h-8 mr-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-primary-lighter hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-primary-lighter dark:hover:text-white disabled:opacity-60"
            >
              <svg
                className="w-3.5 h-3.5 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <button
              onClick={() => {
                setPageInfo((prev) => ({
                  ...prev,
                  pageNumber: prev.pageNumber + 1,
                  pageId:
                    data?.controls[prev.pageNumber + 1]?.id.toString() ?? "0",
                }));
              }}
              disabled={pageInfo.pageNumber === pageInfo.pageCount - 1}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-primary-lighter hover:text-white dark:bg-primary-lighter dark:border-gray-700 dark:text-gray-400 dark:hover:bg-primary-lighter dark:hover:text-white disabled:opacity-60"
            >
              Next
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
