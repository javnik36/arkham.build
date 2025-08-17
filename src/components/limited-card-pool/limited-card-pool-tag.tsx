import { useTranslation } from "react-i18next";
import { createSelector } from "reselect";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { selectPackOptions } from "@/store/selectors/lists";
import { selectMetadata } from "@/store/selectors/shared";
import type { StoreState } from "@/store/slices";
import { isEmpty } from "@/utils/is-empty";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { ListCardInner } from "../list-card/list-card-inner";
import { PackName } from "../pack-name";
import { Tag } from "../ui/tag";
import { DefaultTooltip } from "../ui/tooltip";
import css from "./limited-card-pool.module.css";

const selectLimitedCardPoolCards = createSelector(
  selectMetadata,
  (_: StoreState, cardPool: string[] | undefined) => cardPool,
  (metadata, cardPool) => {
    return cardPool
      ?.filter((str) => str.startsWith("card:"))
      .map((str) => metadata.cards[str.replace("card:", "")]);
  },
);

export function LimitedCardPoolTag() {
  const ctx = useResolvedDeck();
  const { t } = useTranslation();

  const cardPool = ctx.resolvedDeck?.cardPool;

  const selectedPacks = useStore(
    useShallow((state) =>
      selectPackOptions(state, ctx.resolvedDeck).filter((pack) =>
        cardPool?.includes(pack.code),
      ),
    ),
  );

  const selectedCards = useStore((state) =>
    selectLimitedCardPoolCards(state, cardPool),
  );

  if (isEmpty(selectedPacks)) return null;

  return (
    <DefaultTooltip
      options={{ placement: "bottom-start" }}
      tooltip={
        <ol className={css["packs"]}>
          {selectedPacks.map((pack) => {
            return pack ? (
              <li className={css["pack"]} key={pack.code}>
                <PackName pack={pack} shortenNewFormat />
              </li>
            ) : null;
          })}
          {!isEmpty(selectedCards) &&
            selectedCards.map((card) => (
              <li className={css["pack"]} key={card.code}>
                <ListCardInner
                  cardShowCollectionNumber
                  cardLevelDisplay="icon-only"
                  size="xs"
                  omitBorders
                  omitThumbnail
                  card={card}
                />
              </li>
            ))}
        </ol>
      }
    >
      <Tag as="li" size="xs" data-testid="limited-card-pool-tag">
        {t("deck.tags.limited_pool")}
      </Tag>
    </DefaultTooltip>
  );
}
