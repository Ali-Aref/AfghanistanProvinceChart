import type { Locale } from "../types/index.js";

export interface MapStrings {
  mapLabel: string;
  instructions: string;
  selected: string;
  noData: string;
  value: string;
  min: string;
  max: string;
  legendTitle: string;
  province: string;
  selectedProvince: string;
  noneSelected: string;
}

/** Built-in interface copy. Translations are intentionally isolated from interaction logic. */
export const UI_STRINGS: Readonly<Record<Locale, MapStrings>> = Object.freeze({
  en: Object.freeze({
    mapLabel: "Interactive map of Afghanistan's 34 provinces",
    instructions:
      "Use the arrow keys to move between provinces. Press Enter or Space to select a province.",
    selected: "Selected",
    noData: "No data",
    value: "Value",
    min: "Min",
    max: "Max",
    legendTitle: "Value by province",
    province: "Province",
    selectedProvince: "Selected province",
    noneSelected: "No province selected",
  }),
  prs: Object.freeze({
    mapLabel: "نقشه تعاملی ۳۴ ولایت افغانستان",
    instructions:
      "با کلیدهای جهت‌دار بین ولایت‌ها حرکت کنید. برای انتخاب، کلید Enter یا Space را فشار دهید.",
    selected: "انتخاب‌شده",
    noData: "بدون معلومات",
    value: "ارزش",
    min: "کمینه",
    max: "بیشینه",
    legendTitle: "ارزش به تفکیک ولایت",
    province: "ولایت",
    selectedProvince: "ولایت انتخاب‌شده",
    noneSelected: "هیچ ولایتی انتخاب نشده است",
  }),
  ps: Object.freeze({
    mapLabel: "د افغانستان د ۳۴ ولایتونو متقابله نقشه",
    instructions:
      "د ولایتونو ترمنځ د لارښوونکو کیلیو سره حرکت وکړئ. د ټاکلو لپاره Enter یا Space کېکاږئ.",
    selected: "ټاکل شوی",
    noData: "معلومات نشته",
    value: "ارزښت",
    min: "لږ",
    max: "ډېر",
    legendTitle: "ارزښت د ولایت له مخې",
    province: "ولایت",
    selectedProvince: "ټاکل شوی ولایت",
    noneSelected: "هیڅ ولایت نه دی ټاکل شوی",
  }),
});
