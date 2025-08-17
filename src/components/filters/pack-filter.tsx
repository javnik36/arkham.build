import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import type { Pack } from "@/store/schemas/pack.schema";
import {
  selectActiveList,
  selectActiveListFilter,
  selectCampaignCycles,
  selectFilterChanges,
  selectPackOptions,
} from "@/store/selectors/lists";
import { isPackFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { currentEnvironmentPacks } from "@/utils/environments";
import { shortenPackName } from "@/utils/formatting";
import { PackName } from "../pack-name";
import { Button } from "../ui/button";
import type { FilterProps } from "./filters.types";
import { useFilterCallbacks } from "./primitives/filter-hooks";
import { MultiselectFilter } from "./primitives/multiselect-filter";

export function PackFilter({ id, resolvedDeck }: FilterProps) {
  const { t } = useTranslation();

  const filter = useStore((state) => selectActiveListFilter(state, id));

  const activeList = useStore(selectActiveList);

  assert(
    isPackFilterObject(filter),
    `PackFilter instantiated with '${filter?.type}'`,
  );

  const changes = useStore((state) =>
    selectFilterChanges(state, filter.type, filter.value),
  );

  const packOptions = useStore((state) =>
    selectPackOptions(state, resolvedDeck),
  );
  const canShowUnusableCards = useStore((state) => state.ui.showUnusableCards);

  const options = useMemo(
    () =>
      packOptions.filter((pack) => {
        const cardPool = resolvedDeck?.cardPool;

        return cardPool && activeList?.cardType === "player"
          ? canShowUnusableCards ||
              cardPool.includes(pack.code) ||
              filter.value.includes(pack.code)
          : true;
      }),
    [filter.value, resolvedDeck, packOptions, activeList, canShowUnusableCards],
  );

  const nameRenderer = useCallback(
    (pack: Pack) => <PackName pack={pack} shortenNewFormat />,
    [],
  );

  const itemToString = useCallback(
    (pack: Pack) => shortenPackName(pack).toLowerCase(),
    [],
  );

  const { onChange } = useFilterCallbacks<string[]>(id);

  const cycles = useStore(selectCampaignCycles);

  const onApplyCurrentEnvironment = useCallback(() => {
    onChange(currentEnvironmentPacks(cycles));
  }, [cycles, onChange]);

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      open={filter.open}
      options={options}
      placeholder={t("filters.pack.placeholder")}
      title={t("filters.pack.title")}
      value={filter.value}
    >
      {!changes && (
        <Button
          size="sm"
          onClick={onApplyCurrentEnvironment}
          variant="secondary"
        >
          {t("deck_edit.config.card_pool.apply_environment", {
            environment: t("deck_edit.config.card_pool.current"),
          })}
        </Button>
      )}
    </MultiselectFilter>
  );
}
