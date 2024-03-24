import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IEvent {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  imageUrl: string;
  location: string;
  userId: string;
}

export const emptyEvent: IEvent = {
  id: "",
  title: "",
  description: "",
  imageUrl: "",
  eventDate: new Date(),
  location: "",
  userId: ""
};

export interface IEventState extends IBaseState {
  readonly events: IEvent[];
  readonly event: IEvent;
}

export interface IEventResponse extends IResponseBase {
  data: IEvent;
}

export interface IEventResponses extends IResponseBase {
  data: IEvent[];
}

