import React from "react";
import { Card, Button, Typography } from "antd";
import { IEvent } from "@models/event";
import { format } from "@utils/format";
import { API_URL_UPLOADS_EVENTS } from "@constants/api-url";
import slugify from "slugify";

type Prop = {
  event: IEvent;
};
const EventCard: React.FC<Prop> = ({ event }) => {
  //each event card will display the title, a button, date, location, and description
  return (
    <Card
      title={<h5 className="text-wrap">{event.title}</h5>}
      style={{ margin: "16px" }}
      bordered={false}
      hoverable
      styles={{
        actions: {
          textAlign: "left",
          padding: "0 24px",
        },
      }}
      actions={[
        <Button
          type="primary"
          // shape="round"
          href={`/events/${event.id}`}
          className="primary-btn"
        >
          Read more
        </Button>,
      ]}
    >
      <img
        src={`${API_URL_UPLOADS_EVENTS}/${event.imageUrl}`}
        alt={event.title}
        style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
      />
      <p style={{ marginTop: 15, marginBottom: 0 }}>
        <span className="h6">Date:</span> {format.date(event.eventDate)}
      </p>
      <p>
        <span className="h6">Location</span>: {event.location}
      </p>
      <p style={{ marginBottom: 0 }}>{event.description.slice(0, 275)}</p>
    </Card>
  );
};

export default EventCard;
