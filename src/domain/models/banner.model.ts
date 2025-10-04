import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IBanner {
  id: string;
  title: string;
  subTitle: string;
  image: string;
  userId: string;
  slug: string;
}

export const emptyBanner: IBanner = {
  id: "",
  title: "",
  userId: "",
  subTitle: "",
  image: "",
  slug: ""
};

export interface IBannerState extends IBaseState {
  readonly banners: IBanner[];
  readonly banner: IBanner;
}
export interface IBannerResponse extends IResponseBase {
  data: IBanner | null | IBanner[];
}

export interface IBannerResponses extends IResponseBase {
  data: IBanner[];
}


