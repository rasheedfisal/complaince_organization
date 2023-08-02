import {
  IAssesment,
  IOrganization,
  IRegulators,
  IResponse,
  IUser,
} from "@/typings";
import { privateAuthApi } from "./axios";

type users = Omit<IUser, "role" | "permissions">;

export const getModelsFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/log-models`
  );
  return response.data;
};

export const getUsersFn = async () => {
  const response = await privateAuthApi.get<IResponse<users[]>>(
    `/searchables/users`
  );
  return response.data;
};
export const getOrganizationListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IOrganization[]>>(
    `/selectables/organizations`
  );
  return response.data;
};
export const getRegulatorListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IRegulators[]>>(
    `/selectables/regulators`
  );
  return response.data;
};

export const getMaturityLevelListFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/maturity-levels`
  );
  return response.data;
};
export const getAssesmentStatusListFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/assesment-status`
  );
  return response.data;
};

export const getAssesmentListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IAssesment[]>>(
    `/organizations/assesments`
  );
  return response.data;
};
export const getContributionRolesListFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/contribution-roles`
  );
  return response.data;
};

type Staff = IUser & { user_id: string };

export const getAllStaffListFn = async () => {
  const response = await privateAuthApi.get<IResponse<Staff[]>>(
    `/organizations/staff`
  );
  return response.data;
};
