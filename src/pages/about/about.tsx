import { Socials } from "@/components/socials";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/layouts/app-layout";
import { cx } from "@/utils/cx";
import { useGoBack } from "@/utils/use-go-back";
import { ChevronLeftIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "wouter";
import css from "./about.module.css";

function About() {
  const goBack = useGoBack();
  const { t } = useTranslation();

  return (
    <AppLayout title={t("about.title")}>
      <div className={cx("longform", css["about"])}>
        <Button onClick={goBack} variant="bare">
          <ChevronLeftIcon /> {t("common.back")}
        </Button>
        <Socials />
        <h1>{t("about.title")}</h1>
        <Trans
          i18nKey="about.description"
          t={t}
          values={{ date: new Date().getUTCFullYear() }}
          components={{
            ffg: (
              <Link
                to="https://www.fantasyflightgames.com/en/products/arkham-horror-the-card-game/"
                rel="noreferrer"
                target="_blank"
              />
            ),
            felix_url: (
              <Link
                to="https://spoettel.dev"
                rel="noreferrer"
                target="_blank"
              />
            ),
            contrib_url: (
              <Link
                to="https://github.com/fspoettel/arkham.build/graphs/contributors"
                rel="noreferrer"
                target="_blank"
              />
            ),
            github_url: (
              <Link
                to="https://github.com/fspoettel/arkham.build"
                rel="noreferrer"
                target="_blank"
              />
            ),
          }}
        />
        <h2>🌟 {t("about.halloffame.title")} 🌟</h2>
        <ul>
          <li>
            <strong>@zzorba:</strong> {t("about.halloffame.zzorba")} 🙇‍♂️
          </li>
          <li>
            <strong>@kamalisk &amp; ArkhamDB crew: </strong>{" "}
            {t("about.halloffame.ArkhamDB")}
          </li>
          <li>
            <strong>@Chr1Z</strong>, <strong>@Dangaroo</strong>,{" "}
            <strong>@5argon</strong>: {t("about.halloffame.testing")}
          </li>
          <li>
            <strong>@TartanLlama</strong>, <strong>@blu</strong>,{" "}
            <strong>@5argon</strong>: {t("about.halloffame.code")}
          </li>
          <li>
            <strong>@morvael</strong>: {t("about.halloffame.customizationAPI")}
          </li>
          <li>
            <strong>@HatfulBob</strong>: {t("about.halloffame.card_design")}
          </li>
        </ul>
        <p>{t("about.halloffame.translation.title")}:</p>
        <ul>
          <li>
            {t("about.halloffame.translation.ko")}:{" "}
            <strong>푸른이(@derornos)</strong>
          </li>
          <li>
            {t("about.halloffame.translation.pl")}: <strong>@javnik36</strong>
          </li>
          <li>
            {t("about.halloffame.translation.ru")}: <strong>@Evgeny727</strong>
          </li>
          <li>
            {t("about.halloffame.translation.fr")}: <strong>@Zaratan</strong>
          </li>
          <li>
            {t("about.halloffame.translation.es")}:{" "}
            <strong>@AdrianMeizoso</strong>
          </li>
          <li>
            {t("about.halloffame.translation.zh")}:{" "}
            <strong>泡菜大王(@Ruikoto)</strong>
          </li>
        </ul>
        <h2>{t("about.image_credits.title")}</h2>
        <ul>
          <li>
            <strong>{t("about.image_credits.card_icons")}:</strong> Fantasy
            Flight Games
          </li>
          <li>
            <strong>{t("about.image_credits.logo")}:</strong> Dangaroo
          </li>
          <li>
            <strong>{t("about.image_credits.AC_icons")}:</strong> Eugene
            Sarnetsky
          </li>
          <li>
            <strong>{t("about.image_credits.404")}:</strong> FFG & 5argon
          </li>
          <li>
            <strong>{t("about.image_credits.other")}</strong>: lucide.dev
          </li>
        </ul>
      </div>
    </AppLayout>
  );
}

export default About;
