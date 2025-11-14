import type { Printing as PrintingT } from "@/store/selectors/shared";
import { cx } from "@/utils/cx";
import { displayPackName } from "@/utils/formatting";
import PackIcon from "./icons/pack-icon";
import css from "./printing.module.css";

type Props = {
  className?: string;
  printing: PrintingT;
};

export function Printing({ className, printing }: Props) {
  const { pack, card } = printing;

  return (
    <PrintingInner
      className={className}
      icon={<PackIcon code={pack.code} />}
      name={displayPackName(pack)}
      position={card.position}
      quantity={card.quantity}
    />
  );
}

export function PrintingInner({
  className,
  icon,
  name,
  position,
  quantity,
}: {
  className?: string;
  icon: React.ReactNode;
  name: string;
  position: number | string;
  quantity?: number;
}) {
  return (
    <span className={cx(css["printing"], className)}>
      <span className={css["printing-icon"]}>{icon}</span>
      <span>
        {name}&#65119;{position}
      </span>
      {!!quantity && (
        <span>
          <i className="icon-card-outline-bold" />×{quantity}
        </span>
      )}
    </span>
  );
}
