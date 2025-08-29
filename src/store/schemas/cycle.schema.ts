import * as z from "zod/v4-mini";

const JsonDataCycleSchema = z.object({
  code: z.string(),
  name: z.string(),
  position: z.number(),
});

export type JsonDataCycle = z.infer<typeof JsonDataCycleSchema>;

const CycleSchema = z.extend(JsonDataCycleSchema, {
  image_url: z.optional(z.string()),
  name: z.optional(z.string()),
  official: z.optional(z.boolean()),
  real_name: z.string(),
});

export type Cycle = z.infer<typeof CycleSchema>;
