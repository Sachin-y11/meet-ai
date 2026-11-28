import ResponsiveDialog from "@/components/responsive-dialog";
import MeetingForm from "@/modules/meetings/ui/components/meeting-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NewAgentDialog({ onOpenChange, open }: Props) {
  return (
    <ResponsiveDialog
      title='New Agent'
      description='create a new agent'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
