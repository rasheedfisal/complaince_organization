"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TypeOf, object, string, z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createControlEvidenceFn } from "@/api/assessmentsApi";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import FormSelect from "@/components/FormSelect";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import CreateIcon from "@/icons/CreateIcon";
import { createEvidenceSchema } from "@/schema/orgSchema";
import FormTextArea from "@/components/FormTextArea";
import FileUploader2 from "@/components/FileUploader2";

export type IControlEvidence = TypeOf<typeof createEvidenceSchema>;
type PageProps = {
  id: string;
};
const AddEvidence = ({ id }: PageProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, mutate: createEvidence } = useMutation(
    ({
      assesment_control_id,
      evidence,
    }: {
      assesment_control_id: string;
      evidence: FormData;
    }) => createControlEvidenceFn({ assesment_control_id, evidence }),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        setOpen((prev) => !prev);
        queryClient.invalidateQueries(["assesments"]);
        // router.push("/assesments");
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

  const methods = useForm<IControlEvidence>({
    resolver: zodResolver(createEvidenceSchema),
  });
  const {
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<IControlEvidence> = (values) => {
    const formData = new FormData();
    const fileType = values.file.name.split(".")?.pop();
    formData.append("notes", values.notes);
    formData.append("type", fileType ?? "pdf");
    formData.append("file", values.file);
    createEvidence({
      assesment_control_id: id,
      evidence: formData,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="bg-primary space-x-1 hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          //   onClick={() => setOpen((prev) => !prev)}
        >
          <span className="w-4 inline-flex align-middle">
            <CreateIcon />
          </span>
          <span className="inline-flex align-middle">Add Evidence</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-sm overflow-y-scroll max-h-screen lg:h-5/6">
        <DialogHeader>
          <DialogTitle>Add Evidence</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
              <div className="grid grid-cols-1">
                <FormTextArea label="Note" name="notes" rows={5} />
              </div>
              <div className="grid grid-cols-1">
                <FileUploader2 label="Evidence" name="file" />
              </div>
              <DialogFooter>
                <SubmitButton
                  title="Submit"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
              </DialogFooter>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEvidence;
