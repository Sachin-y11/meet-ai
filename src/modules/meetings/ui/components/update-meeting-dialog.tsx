import ResponsiveDialog from "@/components/responsive-dialog";
import MeetingForm from "./meeting-form";
import { MeetingGetOne } from "@/modules/meetings/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
};

export default function UpdateMeetingDialog({
  onOpenChange,
  open,
  initialValues,
}: Props) {
  return (
    <ResponsiveDialog
      title='Edit Meeting'
      description='edit that meeting details'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
