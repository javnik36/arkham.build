import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/layouts/app-layout";
import { useResolvedColorTheme } from "@/utils/use-color-theme";
import { ErrorDisplay } from "./error-display";
import css from "./errors.module.css";

export function ErrorStatus({ statusCode }: { statusCode: number }) {
  const theme = useResolvedColorTheme();
  const { i18n, t } = useTranslation();

  const message = i18n.exists(`errors.${statusCode}`)
    ? t(`errors.${statusCode}`)
    : t("errors.500");

  return (
    <AppLayout mainClassName={css["main"]} title={message}>
      <ErrorDisplay
        message={message}
        pre={
          <img
            className={css["image"]}
            src={theme === "dark" ? "/404-dark.png" : "/404-light.png"}
            alt={message}
          />
        }
        status={statusCode}
      >
        <Link asChild to="~/">
          <Button as="a" variant="bare">
            {t("app.home")}
          </Button>
        </Link>
      </ErrorDisplay>
    </AppLayout>
  );
}
