import React from "react";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import en from "../i18n/en.json";
import eo from "../i18n/eo.json";
import bg from "../i18n/bg.json";

function countKeys(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      count += countKeys(obj[key]);
    } else {
      count += 1;
    }
  }
  return count;
}

function countTranslatedKeys(reference, target) {
  let count = 0;
  for (const key in reference) {
    if (typeof reference[key] === "object" && reference[key] !== null) {
      if (target[key] && typeof target[key] === "object") {
        count += countTranslatedKeys(reference[key], target[key]);
      }
    } else {
      if (target[key] && target[key].trim() !== "") count += 1;
    }
  }
  return count;
}

export default function LangPage() {
  const { i18n, t } = useTranslation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    const url = new URL(window.location.href);
    url.searchParams.set("language", lang);
    window.location.href = url.toString();
  };

  const languages = [
    { lang: "English", key: "en", json: en },
    { lang: "Esperanto", key: "eo", json: eo },
    { lang: "Bulgarian", key: "bg", json: bg },
  ];

  const data = languages.map((l) => {
    if (l.key === "en") return { lang: l.lang, completion: 100 };
    const totalKeys = countKeys(en);
    const translatedKeys = countTranslatedKeys(en, l.json);
    const completion = Math.round((translatedKeys / totalKeys) * 100);
    return { lang: l.lang, completion };
  });

  return (
    <div style={{ padding: "2rem" }}>
      <p>{t("misc.chooselang")}</p>
      <button onClick={() => switchLanguage("en")}>English</button>
      <button onClick={() => switchLanguage("eo")}>Esperanto</button>
      <button onClick={() => switchLanguage("bg")}>Булгарски</button>

      <h2>{t("misc.langprogress")}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lang" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="completion" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <p style={{ marginTop: "1rem" }}>
        Want to help translate? Contribute on <a href="https://github.com/The-Scratch-Channel/tsc-web-client" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </div>
  );
}
