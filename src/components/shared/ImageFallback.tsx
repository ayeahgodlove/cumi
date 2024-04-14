/* eslint-disable jsx-a11y/alt-text */
"use client";

import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import { Image } from "antd";
import { useEffect, useState } from "react";

const ImageFallback = (props: any) => {
  const { src, fallback, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  const { width } = useWindowSize();

  return (
    <img
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallback);
      }}
      style={{
        objectFit: "cover",
        maxWidth: "100%",
        height: width > 767 ? "450px" : "350px",
      }}
    />
  );
};

export default ImageFallback;
