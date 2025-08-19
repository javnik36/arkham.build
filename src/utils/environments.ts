import type { Cycle } from "@/store/schemas/cycle.schema";
import { CURRENT_CYCLE_POSITION, RETURN_TO_CYCLES } from "./constants";

export const CAMPAIGN_PLAYALONG_PROJECT_ID =
  "5b6a1f95-73d1-4059-8af2-b9a645efd625";

const CORE_PACKS = ["core", "rcore", "nat", "har", "win", "jac", "ste"];

export function currentEnvironmentPacks(cycles: Cycle[]) {
  const packs = [...CORE_PACKS];

  for (let i = CURRENT_CYCLE_POSITION; i >= CURRENT_CYCLE_POSITION - 2; i--) {
    const cycle = cycles.find((c) => c.position === i);
    if (!cycle) continue;

    if (cycle.code !== "core") {
      packs.push(`${cycle.code}p`);
    }
  }

  return packs;
}

export function limitedEnvironmentPacks(cycles: Cycle[]) {
  const packs = [...CORE_PACKS];
  packs.push("rtnotz");

  for (const cycle of cycles) {
    if (cycle.code !== "core") {
      packs.push(`${cycle.code}p`);
    }

    if (RETURN_TO_CYCLES[cycle.code]) {
      packs.push(RETURN_TO_CYCLES[cycle.code]);
    }
  }

  return packs;
}

export function campaignPlayalongPacks(cycle: string) {
  const packs = [...CORE_PACKS];
  packs.push("rtnotz");

  if (cycle !== "core") {
    packs.push(`${cycle}p`);
  }

  if (RETURN_TO_CYCLES[cycle]) {
    packs.push(RETURN_TO_CYCLES[cycle]);
  }

  return packs;
}
