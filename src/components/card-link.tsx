import { useCallback } from "react";
import { PortaledCardTooltip } from "@/components/card-tooltip/card-tooltip-portaled";
import { useRestingTooltip } from "@/components/ui/tooltip.hooks";
import type { Card } from "@/store/schemas/card.schema";
import { useAccentColor } from "@/utils/use-accent-color";
import css from "./card-link.module.css";
import { useCardModalContextChecked } from "./card-modal/card-modal-context";

export function CardLink({
  children,
  card,
}: {
  children?: React.ReactNode;
  card: Card;
}) {
  const accentColor = useAccentColor(card);

  const cardModalContext = useCardModalContextChecked();

  const { refs, referenceProps, isMounted, floatingStyles, transitionStyles } =
    useRestingTooltip();

  const onClick = useCallback(() => {
    cardModalContext.setOpen({ code: card.code });
  }, [cardModalContext, card.code]);

  return (
    <>
      <button
        {...referenceProps}
        className={css["card-link"]}
        onClick={onClick}
        type="button"
        ref={refs.setReference}
        style={accentColor}
      >
        {card.parallel && <i className="icon-parallel" />}
        {children}
      </button>
      {isMounted && (
        <PortaledCardTooltip
          card={card}
          ref={refs.setFloating}
          floatingStyles={floatingStyles}
          transitionStyles={transitionStyles}
        />
      )}
    </>
  );
}
