import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IDocument {
  id: string; //primary key
  title: string;
  description: string;
  fileUrl: string;
  slug: string;
  userId: string; //foreign key to user
  categoryId: string; //foreign key to category
  uploadDate: Date;
}

export const emptyDocument: IDocument = {
  id: "",
  title: "",
  slug: "",
  description: "",
  fileUrl: "",
  userId: "",
  categoryId: "",
  uploadDate: new Date()
};

export interface IDocumentState extends IBaseState {
  readonly documents: IDocument[];
  readonly document: IDocument;
}

export interface IDocumentResponse extends IResponseBase {
  data: IDocument | null | IDocument[];
}

