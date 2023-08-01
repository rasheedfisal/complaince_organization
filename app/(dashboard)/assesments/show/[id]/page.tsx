"use client";

import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAssesmentFn } from "@/api/assessmentsApi";
import { toast } from "react-toastify";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import AssesmentBadge from "@/components/AssesmentBadge";
import Carousel from "./Carousel";
import {
  IAssesmentFullInfo,
  IContributor,
  IResponse,
  IRevokeContributor,
} from "@/typings";
import {
  getOrgContributorsByAssesmentFn,
  getRegulatorContributorsByAssesmentFn,
  revokeContributorFn,
} from "@/api/contributorsApi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddContributor from "./AddContributor";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteIcon from "@/icons/DeleteIcon";
import UpdateContributor from "./UpdateContributor";

type PageProps = {
  params: {
    id: string;
  };
};

const Show = ({ params: { id } }: PageProps) => {
  const queryClient = useQueryClient();
  // const { isLoading, data, isSuccess } = useQuery(
  //   ["assesments", id],
  //   () => getAssesmentFn(id),
  //   {
  //     select: (data) => data.data,
  //     retry: 1,
  //     onError: (error) => {
  //       if ((error as any).response?.data?.message) {
  //         toast.error((error as any).response?.data?.message, {
  //           position: "top-right",
  //         });
  //       }
  //     },
  //   }
  // );

  const [assesments, regulatorCont, OrgCont] = useQueries({
    queries: [
      {
        queryKey: ["assesments", id],
        queryFn: () => getAssesmentFn(id),

        select: ({ data }: IResponse<IAssesmentFullInfo>) => data,
        retry: 1,
        onError: (error: any) => {
          if ((error as any).response?.data?.message) {
            toast.error((error as any).response?.data?.message, {
              position: "top-right",
            });
          }
        },
      },
      {
        queryKey: ["regulator-contributor", id],
        queryFn: () => getRegulatorContributorsByAssesmentFn(id),

        select: ({ data }: IResponse<IContributor[]>) => data,
        retry: 1,
        onError: (error: any) => {
          if ((error as any).response?.data?.message) {
            toast.error((error as any).response?.data?.message, {
              position: "top-right",
            });
          }
        },
      },
      {
        queryKey: ["org-contributor", id],
        queryFn: () => getOrgContributorsByAssesmentFn(id),

        select: ({ data }: IResponse<IContributor[]>) => data,
        retry: 1,
        onError: (error: any) => {
          if ((error as any).response?.data?.message) {
            toast.error((error as any).response?.data?.message, {
              position: "top-right",
            });
          }
        },
      },
    ],
  });

  const { isLoading: isRevokeLoading, mutate: revokeStaff } = useMutation(
    (revoke: IRevokeContributor) => revokeContributorFn(revoke),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        queryClient.invalidateQueries(["org-contributor"]);
      },
      onError: (error: any) => {
        if ((error as any).response?.data.message) {
          toast.error((error as any).response?.data.message, {
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

  const handleRevokeStaff = (userId: string) => {
    if (confirm("are you sure you want to revoke this staff member?")) {
      const revokeObj = { assesment_id: id, user_id: userId };
      revokeStaff(revokeObj);
    }
  };

  if (assesments.isLoading) {
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
        <div className="min-w-full rounded gap-5 space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2">
          <div className="block lg:col-span-1 px-4 py-6 rounded-md bg-white dark:bg-darker">
            <section className="h-full flex flex-col justify-between space-y-2">
              {/* Assesment Details */}
              <div>
                <span className="text-gray-600 font-bold">{"Details:"}</span>
                <Separator className="my-2" />
                <div className="flex flex-col space-y-2 mt-2">
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">
                      Framework {":"}
                    </label>
                    <span className="text-sm">
                      {assesments.data?.framework}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Code {":"}</label>
                    <span className="text-sm">{assesments.data?.code}</span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">Status {":"}</label>
                    <AssesmentBadge status={assesments.data?.status ?? "N/A"} />
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">
                      Due Date {":"}
                    </label>
                    <span className="text-sm">
                      {assesments.data?.due_date?.toString() ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <label className="text-sm font-medium">
                      Created At {":"}
                    </label>
                    <span className="text-sm">
                      {assesments.data?.created_at.toString()}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-gray-600 font-bold">
                  {"Contributors: "}
                  {/* model goes here */}
                  <AddContributor id={id} contributors={OrgCont.data} />
                </span>
                <Separator className="my-2" />
                <div className="flex flex-col space-y-2 mt-2">
                  <ScrollArea className="h-56 w-full rounded-md border">
                    <Table className="w-full overflow-hidden">
                      <TableCaption>
                        {OrgCont.isLoading
                          ? "loading..."
                          : "A list of your contributors."}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-center">Role</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {OrgCont.data?.map((ctl) => (
                          <TableRow key={ctl.id}>
                            <TableCell className="font-medium truncate">
                              <div className="flex flex-col">
                                <span>{ctl.user.name}</span>
                                <span className="text-gray-500 text-xs">
                                  {ctl.user.email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {ctl.role}
                            </TableCell>
                            <TableCell>
                              <button
                                className="w-4 mr-2 mt-1 transform rounded-md text-red-700 hover:scale-110"
                                title="Revoke"
                                onClick={() => handleRevokeStaff(ctl.user.id)}
                              >
                                <DeleteIcon />
                              </button>
                              <UpdateContributor contributer={ctl} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            </section>
          </div>
          <div className="block lg:col-span-1 px-4 py-6 rounded-md bg-white dark:bg-darker">
            <section className="h-full flex flex-col justify-between space-y-2">
              {/* regulator Details */}
              <div>
                <span className="text-gray-600 font-bold">{"Regulator:"}</span>
                <Separator className="my-2" />
                <div className="flex justify-start gap-3">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage
                      className="h-24 w-24"
                      src={assesments.data?.regulator.logo}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-2">
                    <div className="flex gap-3">
                      <span className="text-sm">
                        {assesments.data?.regulator.name}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-sm">
                        {assesments.data?.regulator.email_domain}
                      </span>
                    </div>
                    {/* <div className="flex gap-3">
                  <label className="text-sm font-medium">Code {":"}</label>
                  <span className="text-sm">{assesments.data?.organization.code}</span>
                </div> */}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-gray-600 font-bold">
                  {"Contributors:"}
                </span>
                <Separator className="my-2" />
                <div className="flex flex-col space-y-2 mt-2">
                  <ScrollArea className="h-56 w-full rounded-md border">
                    <Table className="w-full overflow-hidden">
                      <TableCaption>
                        {OrgCont.isLoading
                          ? "loading..."
                          : "A list of your contributors."}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-center">Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {regulatorCont.data?.map((ctl) => (
                          <TableRow key={ctl.id}>
                            <TableCell className="font-medium truncate">
                              <div className="flex flex-col">
                                <span>{ctl.user.name}</span>
                                <span className="text-gray-500 text-xs">
                                  {ctl.user.email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {ctl.role}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            </section>
          </div>
        </div>
        {assesments.isSuccess && <Carousel items={assesments.data.controls} />}
      </div>
    </>
  );
};

export default Show;
