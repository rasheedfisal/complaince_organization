import {
  IAssesment,
  IAssesmentControl,
  IAssesmentFullInfo,
  IResponse,
} from "@/typings";
import { privateAuthApi } from "./axios";

export const updateControlReplyFn = async ({
  assesment_control_id,
  reply,
}: {
  assesment_control_id: string;
  reply: { reply: string; maturity_level: string };
}) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/organizations/assesments/${assesment_control_id}/reply`,
    reply
  );
  return response.data;
};
export const createControlEvidenceFn = async ({
  assesment_control_id,
  evidence,
}: {
  assesment_control_id: string;
  evidence: FormData;
}) => {
  const response = await privateAuthApi.post<IResponse<[]>>(
    `/organizations/assesments/${assesment_control_id}/evidences`,
    evidence,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
// export const createAssesmentControlFn = async (
//   assesment: ICreateUpdateAssesmentControl
// ) => {
//   const response = await privateAuthApi.post<IResponse<IAssesmentControl>>(
//     `/organizations/assesments/add-control`,
//     assesment
//   );
//   return response.data;
// };

// export const updateAssesmentFn = async ({
//   id,
//   assesment,
// }: {
//   id: string;
//   assesment: ICreateUpdateAssesment;
// }) => {
//   const response = await privateAuthApi.put<IResponse<IAssesment>>(
//     `/organizations/assesments/${id}`,
//     assesment
//   );
//   return response.data;
// };

export const getAssesmentFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IAssesmentFullInfo>>(
    `/organizations/assesments/${id}`
  );
  return response.data;
};

// export const deleteAssesmentFn = async ({ id }: { id: string }) => {
//   const response = await privateAuthApi.delete<IResponse<[]>>(
//     `/organizations/assesments/${id}`
//   );
//   return response.data;
// };
// export const deleteAssesmentControlFn = async ({ id }: { id: string }) => {
//   const response = await privateAuthApi.delete<IResponse<[]>>(
//     `/organizations/assesments/remove-control/${id}`
//   );
//   return response.data;
// };
