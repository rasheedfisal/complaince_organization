import {
  IAssignUpdateContributor,
  IContributor,
  IResponse,
  IRevokeContributor,
} from "@/typings";
import { privateAuthApi } from "./axios";

export const assignContributorFn = async (
  contributor: IAssignUpdateContributor
) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/organizations/contributors/assign`,
    contributor
  );
  return response.data;
};

export const updateContributorFn = async (
  contributor: IAssignUpdateContributor
) => {
  const response = await privateAuthApi.put<IResponse<[]>>(
    `/organizations/contributors/update-role`,
    contributor
  );
  return response.data;
};

export const getRegulatorContributorsByAssesmentFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IContributor[]>>(
    `/organizations/contributors/assesment/${id}/regulator-contributors`
  );
  return response.data;
};
export const getOrgContributorsByAssesmentFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IContributor[]>>(
    `/organizations/contributors/assesment/${id}/organization-contributors`
  );
  return response.data;
};

export const revokeContributorFn = async (obj: IRevokeContributor) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/organizations/contributors/revoke`,
    obj
  );
  return response.data;
};
