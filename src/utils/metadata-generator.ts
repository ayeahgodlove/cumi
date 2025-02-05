import { Metadata } from "next";

export const generatePageMetadata = ({
  title,
  description,
  slug,
  image = "/default-image.jpg", // Provide a default image
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}): Metadata => ({
  title,
  description,
  openGraph: {
    title,
    description,
    url: `https://cumitech.com/${slug}`,
    images: [
      {
        url: image,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
  alternates: {
    canonical: `https://cumitech.com/${slug}`,
  },
});
