"use server";

import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from ".";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../translations/${locale}/common.json`)).default,
  };
});
