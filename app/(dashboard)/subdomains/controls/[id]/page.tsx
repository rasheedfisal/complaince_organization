"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";

type PageProps = {
  params: {
    id: string;
  };
};

const Index = dynamic(
  () => {
    return import("./Index");
  },
  { ssr: false }
);

const Subdomain = ({ params: { id } }: PageProps) => {
  const router = useRouter();

  return (
    <>
      {/* <!-- Content header --> */}

      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-col gap-3 md:flex-row items-center">
              <div className="relative w-full px-4 max-w-full text-center md:text-left flex-grow flex-1">
                <h3 className="font-semibold text-base">Controls List</h3>
              </div>
              <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
                <Link
                  href="/subdomains"
                  className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
                >
                  <ChevronDoubleLeftIcon className="w-5 h-5" />
                  Back
                </Link>
              </div>
            </div>
          </div>
          <div className="p-4 block w-full relative overflow-x-auto">
            <div className="relative">
              <Index id={id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subdomain;
