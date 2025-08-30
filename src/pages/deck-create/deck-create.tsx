import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearch } from "wouter";
import { CardModalProvider } from "@/components/card-modal/card-modal-provider";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import { querySealedDeck } from "@/store/services/queries";
import { DeckCreateInner } from "./deck-create-inner";

function DeckCreate() {
  const { code } = useParams<{ code: string }>();
  const search = useSearch();

  const { t } = useTranslation();
  const toast = useToast();

  const deckCreate = useStore((state) => state.deckCreate);
  const destroy = useStore((state) => state.resetCreate);
  const initialize = useStore((state) => state.initCreate);
  const setSealedDeck = useStore((state) => state.deckCreateSetSealed);

  useEffect(() => {
    let mounted = true;
    let toastId: string | undefined;

    const params = new URLSearchParams(search);

    const initialInvestigatorChoice = params
      .get("initial_investigator")
      ?.toString();

    initialize(code, initialInvestigatorChoice);

    async function applySealedDeck(id: string) {
      toastId = toast.show({
        variant: "loading",
        children: t("deck_create.sealed_deck.loading"),
      });

      try {
        const sealedDeck = await querySealedDeck(id);
        if (!mounted) return;

        setSealedDeck(sealedDeck);
        toast.dismiss(toastId);
        toast.show({
          variant: "success",
          children: t("deck_create.sealed_deck.success"),
          duration: 3000,
        });
      } catch (err) {
        if (!mounted) return;
        toast.dismiss(toastId);
        toast.show({
          variant: "error",
          children: t("deck_create.sealed_deck.error", {
            error: (err as Error).message,
          }),
          duration: 3000,
        });
      }
    }

    const sealedDeckId = params.get("sealed_deck_id")?.toString();
    if (sealedDeckId) applySealedDeck(sealedDeckId);

    return () => {
      if (toastId) toast.dismiss(toastId);
      mounted = false;
      destroy();
    };
  }, [code, destroy, initialize, search, setSealedDeck, t, toast]);

  return deckCreate ? (
    <CardModalProvider>
      <DeckCreateInner />
    </CardModalProvider>
  ) : null;
}

export default DeckCreate;
