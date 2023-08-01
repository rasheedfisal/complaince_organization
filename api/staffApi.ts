import { ICreateStaff } from "@/app/(dashboard)/staff/add/page";
import { privateAuthApi } from "./axios";
import { IResponse, IUser } from "@/typings";

export const createStaffFn = async (staff: ICreateStaff) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/organizations/staff`,
    staff
  );
  return response.data;
};
export const banStaffFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/organizations/staff/${id}/ban`
  );
  return response.data;
};
export const restoreStaffFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/organizations/staff/${id}/restore`
  );
  return response.data;
};
