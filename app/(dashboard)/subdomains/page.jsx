"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
const Index = dynamic(
  () => {
    return import("./Index");
  },
  { ssr: false }
);

const Manage = () => {
  const router = useRouter();

  return (
    <>
      {/* <!-- Content header --> */}

      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-col gap-3 md:flex-row items-center">
              <div className="relative w-full px-4 max-w-full text-center md:text-left flex-grow flex-1">
                <h3 className="font-semibold text-base">Sub Domain List</h3>
              </div>
            </div>
          </div>
          <div className="p-4 block w-full relative overflow-x-auto">
            <div className="relative">
              <Index />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manage;
