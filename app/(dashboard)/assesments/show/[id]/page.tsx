"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssesmentFn } from "@/api/assessmentsApi";
import { toast } from "react-toastify";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import AssesmentBadge from "@/components/AssesmentBadge";
import Carousel from "./Carousel";

type PageProps = {
  params: {
    id: string;
  };
};

const Show = ({ params: { id } }: PageProps) => {
  const { isLoading, data, isSuccess } = useQuery(
    ["assesments", id],
    () => getAssesmentFn(id),
    {
      select: (data) => data.data,
      retry: 1,
      onError: (error) => {
        if ((error as any).response?.data?.message) {
          toast.error((error as any).response?.data?.message, {
            position: "top-right",
          });
        }
      },
    }
  );

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
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    className="h-24 w-24"
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
        {isSuccess && <Carousel items={data.controls} />}
      </div>
    </>
  );
};

export default Show;
