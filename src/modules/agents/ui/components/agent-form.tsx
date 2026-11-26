"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, SparklesIcon } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { agentInsertSchema } from "@/modules/agents/schema";
import type { AgentGetOne } from "@/modules/agents/types";
import { useTRPC } from "@/trpc/client";
import GenerateAvatar from "@/components/generate-avatar";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
};

type AgentFormValues = z.infer<typeof agentInsertSchema>;

const AgentForm = ({ initialValues, onCancel, onSuccess }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialValues?.id);

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });
  const name = useWatch({ control: form.control, name: "name" });

  const handleSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.agents.getMany.queryKey(),
    });
    if (initialValues?.id) {
      await queryClient.invalidateQueries({
        queryKey: trpc.agents.getOne.queryKey({ id: initialValues.id }),
      });
    }
    toast.success(isEdit ? "Agent updated." : "Agent created.");
    onSuccess?.();
  };

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: handleSuccess,
      onError: (error) => toast.error(error.message),
    }),
  );
  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: handleSuccess,
      onError: (error) => toast.error(error.message),
    }),
  );

  const isPending = createAgent.isPending || updateAgent.isPending;

  function onSubmit(values: AgentFormValues) {
    if (initialValues?.id) {
      updateAgent.mutate({ id: initialValues.id, ...values });
      return;
    }

    createAgent.mutate(values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-6'
    >
      <GenerateAvatar
        seed={name}
        variant='botttsNeutral'
        className='border size-16'
      />
      <FieldGroup>
        <Controller
          name='name'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='agent-name'>Name</FieldLabel>
              <Input
                {...field}
                id='agent-name'
                aria-invalid={fieldState.invalid}
                placeholder='e.g. Meeting assistant'
                autoComplete='off'
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='instructions'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='agent-instructions'>Instructions</FieldLabel>
              <Textarea
                {...field}
                id='agent-instructions'
                aria-invalid={fieldState.invalid}
                placeholder='Describe how this agent should help...'
                rows={6}
                disabled={isPending}
              />
              <FieldDescription>
                Explain the agent&apos;s role, goals, and how it should respond.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              : "Create agent"}
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;
