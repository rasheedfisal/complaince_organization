import { IAssesmentControlFullInfo } from "@/typings";
import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AssesmentBadge from "@/components/AssesmentBadge";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { updateControlReplyFn } from "@/api/assessmentsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getMaturityLevelListFn } from "@/api/selectablesApi";
import { TypeOf, object, string, z } from "zod";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import AddEvidence from "./AddEvidence";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type pageProps = {
  items: IAssesmentControlFullInfo[];
};

const updateControlReplySchema = object({
  reply: string().min(1, "Name is required"),
  maturity_level: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

type IControlReply = TypeOf<typeof updateControlReplySchema>;

const Carousel = ({ items }: pageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === items.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setDirection("left");

    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? items.length - 1 : prevIndex - 1
    );
  };

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

  //   useUpdateEffect(() => {
  //     if (isSubmitSuccessful) {
  //       methods.reset();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [isSubmitSuccessful]);

  useUpdateEffect(() => {
    methods.reset({
      reply: items[currentIndex]?.reply ?? "",
      maturity_level: {
        label: items[currentIndex]?.maturity_level,
        value: items[currentIndex]?.maturity_level,
      },
    });
  }, [currentIndex]);

  const onSubmitHandler: SubmitHandler<IControlReply> = (values) => {
    updateControlReply({
      assesment_control_id: items[currentIndex].id.toString(),
      reply: {
        reply: values.reply,
        maturity_level: values.maturity_level.value,
      },
    });
  };
  return (
    <div className="relative m-auto overflow-hidden h-full">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          // src={images[currentIndex]}
          initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
          animate="visible"
          exit="exit"
          variants={slideVariants}
          className="space-y-2"
        >
          <div className="min-w-full rounded gap-5  lg:grid">
            <div className="px-4 py-6 rounded-md bg-white dark:bg-darker">
              <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-36">
                <div className="flex flex-col space-y-2">
                  <span className="text-gray-600 font-bold">{"Domain:"}</span>
                  <Separator />
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">{"Name:"}</label>
                    <span className="text-sm">
                      {items[currentIndex].control.sub_domain.domain.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Code {":"}</label>
                    <span className="text-sm">
                      {items[currentIndex].control.sub_domain.domain.code}
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
                      {items[currentIndex].control.sub_domain.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Code {":"}</label>
                    <span className="text-sm">
                      {items[currentIndex].control.sub_domain.code}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 space-y-2">
                  <span className="text-gray-600 font-bold">{"Control:"}</span>
                  <Separator />
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Status {":"}</label>
                    <span className="text-sm">
                      <AssesmentBadge
                        status={items[currentIndex].status ?? "N/A"}
                      />
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">
                      Target Date {":"}
                    </label>
                    <span className="text-sm">
                      {items[currentIndex].target_date?.toString() ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Name {":"}</label>
                    <span className="text-sm">
                      {items[currentIndex].control.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Code {":"}</label>
                    <span className="text-sm">
                      {items[currentIndex].control.code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="min-w-full rounded gap-5 lg:grid">
            <div className="px-4 py-6 rounded-md bg-white dark:bg-darker">
              <div className="flex flex-col h-full lg:flex-row lg:items-start gap-5">
                <div className="flex flex-col flex-1 space-y-2">
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
                <Separator orientation="vertical" />
                <div className="flex flex-col flex-1 space-y-2">
                  <div className="flex justify-end">
                    {/* model goes here */}
                    <AddEvidence id={items[currentIndex].id.toString()} />
                  </div>
                  <div className="max-h-52 w-full rounded-md border">
                    <div className="p-4">
                      <h4 className="mb-4 text-sm font-medium leading-none">
                        uploads
                      </h4>
                      <div className="flex flex-col space-y-2">
                        {items[currentIndex].evidances.map(
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="min-w-full rounded py-10">
        <div className="flex gap-5 justify-center">
          {/* <!-- Previous Button --> */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center justify-center px-3 h-8 mr-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-primary-lighter hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-primary-lighter dark:hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
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
            onClick={handleNext}
            disabled={currentIndex === items.length - 1}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-primary-lighter hover:text-white dark:bg-primary-lighter dark:border-gray-700 dark:text-gray-400 dark:hover:bg-primary-lighter dark:hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
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
  );
};

export default Carousel;
