import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LimitedCardPoolField } from "@/components/limited-card-pool/limited-card-pool-field";
import { SealedDeckField } from "@/components/limited-card-pool/sealed-deck-field";
import { Field, FieldLabel } from "@/components/ui/field";
import { useStore } from "@/store";
import type { Card } from "@/store/schemas/card.schema";
import { selectLimitedPoolPacks } from "@/store/selectors/lists";

type Props = {
  investigator: Card;
};

export function DeckCreateCardPool({ investigator }: Props) {
  const { t } = useTranslation();

  const setCardPool = useStore((state) => state.deckCreateSetCardPool);
  const setSealedDeck = useStore((state) => state.deckCreateSetSealed);

  const deckCreate = useStore((state) => state.deckCreate);

  const sealedDeck = useMemo(
    () =>
      deckCreate?.sealed
        ? {
            name: deckCreate.sealed.name,
            cards: deckCreate.sealed.cards,
          }
        : undefined,
    [deckCreate],
  );

  const selectedPacks = useStore((state) =>
    selectLimitedPoolPacks(state, deckCreate?.cardPool),
  );

  const selectedItems = useMemo(
    () => selectedPacks.map((p) => p.code),
    [selectedPacks],
  );

  return (
    <Field full padded bordered>
      <FieldLabel>{t("deck_edit.config.card_pool.section_title")}</FieldLabel>
      <LimitedCardPoolField
        investigator={investigator}
        onValueChange={setCardPool}
        selectedItems={selectedItems}
      />
      <SealedDeckField onValueChange={setSealedDeck} value={sealedDeck} />
    </Field>
  );
}
