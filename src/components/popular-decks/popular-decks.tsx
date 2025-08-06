import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { resolveDeck } from "@/store/lib/resolve-deck";
import type { Card } from "@/store/schemas/card.schema";
import {
  selectLocaleSortingCollator,
  selectLookupTables,
  selectMetadata,
} from "@/store/selectors/shared";
import { searchDecks } from "@/store/services/requests/search-decks";
import { displayAttribute } from "@/utils/card-utils";
import { getAccentColorsForFaction } from "@/utils/use-accent-color";
import { CardLink } from "../card-link";
import { ArkhamdbDecklistMeta } from "../deck-summary/arkhamdb-decklist-meta";
import { DeckSummary } from "../deck-summary/deck-summary";
import { Expander } from "../ui/expander";
import { Loader } from "../ui/loader";
import { Plane } from "../ui/plane";
import css from "./popular-decks.module.css";

type Props = {
  scope: Card;
};

export function PopularDecks(props: Props) {
  const { scope } = props;
  const { t } = useTranslation();

  const enabled = !scope.encounter_code;

  const { data, error, isPending } = useQuery({
    queryKey: ["popular-decks", scope.code],
    queryFn: () =>
      searchDecks({
        canonicalInvestigatorCode:
          scope.type_code === "investigator"
            ? `${scope.code}-${scope.code}`
            : undefined,
        requiredCards:
          scope.type_code !== "investigator" ? [scope.code] : undefined,
      }),
    enabled,
  });

  const metadata = useStore(selectMetadata);
  const lookupTables = useStore(selectLookupTables);
  const sharing = useStore((state) => state.sharing);
  const collator = useStore(selectLocaleSortingCollator);

  const resolved = useMemo(() => {
    if (!data) return null;

    const deps = { lookupTables, metadata, sharing };

    return data.data.map((deck) => ({
      deck: resolveDeck(deps, collator, {
        ...deck,
        source: "arkhamdb",
      }),
      description_word_count: deck.description_word_count,
      user_name: deck.user_name,
      user_reputation: deck.user_reputation,
      like_count: deck.like_count,
    }));
  }, [data, lookupTables, metadata, sharing, collator]);

  if (!enabled) return null;

  const title = (
    <Trans
      t={t}
      i18nKey={
        scope.type_code === "investigator"
          ? "popular_decks.title_investigator"
          : "popular_decks.title_card"
      }
      values={{ name: displayAttribute(scope, "name") }}
      components={{
        tooltip: <CardLink card={scope} />,
      }}
    />
  );

  return (
    <Plane
      as="article"
      className={css["container"]}
      style={getAccentColorsForFaction(scope)}
    >
      <header>
        <h3 className={css["title"]}>
          <i className="icon-elder_sign" />
          {title}
        </h3>
      </header>

      {isPending && (
        <div className={css["status"]}>
          <Loader show />
        </div>
      )}

      {data?.data.length === 0 && (
        <output className={css["status"]}>
          <div className={css["status-inner"]}>
            <AlertCircleIcon className={css["status-icon"]} />
            <p>{t("popular_decks.no_results")}</p>
          </div>
        </output>
      )}

      {error && (
        <output className={css["status"]}>
          <div className={css["status-inner"]}>
            <AlertCircleIcon className={css["status-icon"]} />
            <p>
              {t("popular_decks.error", {
                error: (error as Error).message,
              })}
            </p>
          </div>
        </output>
      )}

      {resolved && (
        <Expander collapsedHeight="19.5rem">
          <ol className={css["decks"]}>
            {resolved.map(({ deck, ...meta }) => (
              <li
                key={deck.id}
                style={getAccentColorsForFaction(deck.cards.investigator.card)}
              >
                <DeckSummary
                  deck={deck}
                  interactive
                  showThumbnail
                  type="decklist"
                >
                  <ArkhamdbDecklistMeta
                    date_creation={deck.date_creation}
                    like_count={meta.like_count}
                    user_id={deck.user_id as number}
                    user_name={meta.user_name}
                    user_reputation={meta.user_reputation}
                  />
                </DeckSummary>
              </li>
            ))}
          </ol>
        </Expander>
      )}
    </Plane>
  );
}
