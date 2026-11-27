"use client";

import ResponsiveDialog from "@/components/responsive-dialog";
import MeetingForm from "./meeting-form";
import { useRouter } from "next/navigation";
// import AgentForm from "./agent-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NewMeetingDialog({ onOpenChange, open }: Props) {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title='New Meeting'
      description='create a new meeting'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
