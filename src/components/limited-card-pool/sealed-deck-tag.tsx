import { useTranslation } from "react-i18next";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { Tag } from "../ui/tag";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function SealedDeckTag() {
  const ctx = useResolvedDeck();
  const { t } = useTranslation();

  const value = ctx.resolvedDeck?.sealedDeck;
  if (!value) return null;

  const count = Object.keys(value.cards).length;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Tag size="xs">{t("deck.tags.sealed")}</Tag>
      </TooltipTrigger>
      <TooltipContent>
        {value.name} ({count} {t("common.card", { count })})
      </TooltipContent>
    </Tooltip>
  );
}
