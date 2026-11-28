"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, SparklesIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { meetingInsertSchema } from "@/modules/meetings/schema";
import type { MeetingGetOne } from "@/modules/meetings/types";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import CommandSelect from "./command-select";
import GenerateAvatar from "@/components/generate-avatar";
import NewMeetingDialog from "./new-meeting-dialog";

type Props = {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
};

type MeetingFormValues = z.infer<typeof meetingInsertSchema>;

const MeetingForm = ({ initialValues, onCancel, onSuccess }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialValues?.id);

  const [openNewMeetingDialog, setOpenNewMeetingDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const handleSuccess = async (id?: string) => {
    await queryClient.invalidateQueries({
      queryKey: trpc.meetings.getMany.queryKey(),
    });
    if (id) {
      await queryClient.invalidateQueries({
        queryKey: trpc.meetings.getOne.queryKey({ id }),
      });
    }
    toast.success(isEdit ? "meeting updated." : "meeting created.");
    onSuccess?.(id);
  };

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: (data) => handleSuccess(data.id),
      onError: (error) => toast.error(error.message),
    }),
  );
  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: () => handleSuccess(initialValues?.id),
      onError: (error) => toast.error(error.message),
    }),
  );

  const isPending = createMeeting.isPending || updateMeeting.isPending;

  function onSubmit(values: MeetingFormValues) {
    if (initialValues?.id) {
      updateMeeting.mutate({ id: initialValues.id, ...values });
      return;
    }

    createMeeting.mutate(values);
  }

  return (
    <>
      <NewMeetingDialog
        open={openNewMeetingDialog}
        onOpenChange={setOpenNewMeetingDialog}
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        <FieldGroup>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='meeting-name'>Name</FieldLabel>
                <Input
                  {...field}
                  id='meeting-name'
                  aria-invalid={fieldState.invalid}
                  placeholder='e.g. Meeting assistant'
                  autoComplete='off'
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='agentId'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='meeting-agent-id'>Agent ID</FieldLabel>
                <CommandSelect
                  options={(agents.data?.data ?? []).map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: (
                      <div className='flex items-center gap-x-2'>
                        <GenerateAvatar
                          seed={agent.name}
                          variant='botttsNeutral'
                          className='border size-6'
                        />
                        <span>{agent.name}</span>
                      </div>
                    ),
                  }))}
                  onSelect={field.onChange}
                  onSearch={setAgentSearch}
                  value={field.value}
                  placeholder='Select a agent'
                />
                <FieldDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type='button'
                    className='text-primary hover:underline'
                    onClick={() => setOpenNewMeetingDialog(true)}
                  >
                    Create new Meeting
                  </button>
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className='flex justify-end gap-2'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <LoaderCircleIcon className='animate-spin' />
            ) : (
              <SparklesIcon />
            )}
            {isPending
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save changes"
                : "Create meeting"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default MeetingForm;
