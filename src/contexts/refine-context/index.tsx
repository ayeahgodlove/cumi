"use client";

import { SessionProvider } from "next-auth/react";
import { App } from "../../app/_refine_context";
import { ColorModeContextProvider } from "../color-mode";
import { TranslationProvider } from "../translation.context";
import { LiveSupportButton } from "../../components/shared/live-support-button";

export const RefineContext = (props: any) => {
  const defaultMode = props?.defaultMode;

  const aiConfig = {
    provider: "openai" as const,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    model: "gpt-3.5-turbo", // or 'gpt-4'
    maxTokens: 150,
    temperature: 0.7,
    maxRetries: 3,        // Number of retry attempts (default: 3)
    retryDelay: 1000, 
  };

  return (
    <SessionProvider>
      <TranslationProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <App {...props} />
          <LiveSupportButton
            aiConfig={aiConfig}
            companyName="CumiTech"
            supportEmail="info@cumi.dev"
            supportPhone="+237-673-687-549"
            whatsappNumber="+237681289411"
          />
        </ColorModeContextProvider>
      </TranslationProvider>
    </SessionProvider>
  );
};
