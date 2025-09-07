"use client";

import React from "react";
import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "next-themes";

interface DisqusProps {
  identifier: string;
  title: string;
  url: string;
  className?: string;
}

const Disqus: React.FC<DisqusProps> = ({
  identifier,
  title,
  url,
  className,
}) => {
  const disqusShortname = "cumi-1"; // your Disqus shortname
  const disqusConfig = {
    url,
    identifier,
    title,
    language: "en", // or your preferred language
  };

  const { theme } = useTheme();

  return (
    <div className={className} key={theme}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default Disqus;
