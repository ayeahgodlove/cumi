import React from "react";

import { Card } from "antd";

export default function FeatureCard(props: any) {
  return (
    <Card
      className="cursor-pointer"
      style={{ backgroundColor: 'white' }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
    >
      {props.icon && (
        <div
          className="d-flex justify-content-center align-items-center bg-light rounded-circle"
          style={{ width: 48, height: 48 }}
        >
          {props.icon}
        </div>
      )}

<div className="">
        {props.title && (
          <span className="h5">
            {props.title}
          </span>
        )}

{props.titleIcon && props.titleIcon}
      </div>

{props.price && <span className="fwb">{props.price}</span>}
    </Card>
  );
}
