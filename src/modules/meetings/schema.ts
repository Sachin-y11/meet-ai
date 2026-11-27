import z from "zod";

export const meetingStatusSchema = z.enum([
  "upcoming",
  "active",
  "completed",
  "processing",
  "cancel",
]);

export const meetingInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  agentId: z.string().min(1, { message: "Agent ID is required." }),
});

export const meetingUpdateSchema = meetingInsertSchema.extend({
  id: z.string().min(1),
});
