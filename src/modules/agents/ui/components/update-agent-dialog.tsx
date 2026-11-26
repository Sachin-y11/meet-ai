import ResponsiveDialog from "@/components/responsive-dialog";
import AgentForm from "./agent-form";
import { AgentGetOne } from "@/modules/agents/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne;
};

export default function UpdateAgentDialog({
  onOpenChange,
  open,
  initialValues,
}: Props) {
  return (
    <ResponsiveDialog
      title='Edit Agent'
      description='edit that agent details'
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
