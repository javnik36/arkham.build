import type { ChartableData } from "@/store/lib/deck-charts";
import { cx } from "@/utils/cx";
import { useTranslation } from "react-i18next";
import { Scroller } from "../ui/scroller";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData<string>;
};

export function TraitsChart(props: Props) {
  const { data } = props;

  const { i18n, t } = useTranslation();

  return (
    <div className={cx(css["chart-container"], css["traits"])}>
      <h4 className={css["chart-title"]}>{t("common.trait", { count: 2 })}</h4>
      <Scroller className={css["table-container"]} type="auto">
        <table className={css["table"]}>
          <thead>
            <tr>
              <th>{t("common.trait", { count: 1 })}</th>
              <th>{t("deck.tools.count")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((trait) => (
              <tr key={trait.x}>
                <td>
                  <span className={css["trait"]}>
                    {i18n.exists(`common.traits.${trait.x}`)
                      ? t(`common.traits.${trait.x}`)
                      : trait.x}
                  </span>
                </td>
                <td>{trait.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroller>
    </div>
  );
}
