import { BASE_URL } from "@constants/api-url";

type Data = {
  title: string;
  desc: string;
  textUrl: string;
  imageUrl: string;
  altText: string;
};
type StaticData = {
  home: Data;

};
export const staticData: StaticData = {
  home: {
    title: "Cumi - Empowering Your Digital Journey",
    desc: "We're committed to revolutionizing the digital landscape, offering cutting-edge solutions tailored to individuals, startups, enterprises, and organizations.",
    textUrl: `${BASE_URL}/`,
    imageUrl: "/img/desola-lanre-ologun-IgUR1iX0mqM-unsplash",
    altText: "Codimaniacs !-)",
  },
};

