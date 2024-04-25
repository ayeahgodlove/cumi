import { Breadcrumb } from "antd";
import React from "react";
import { FiHome } from "react-icons/fi";

type Props = {
  items: string[];
  style?: Object;
  className?: string;
};

const PageBreadCrumbs: React.FunctionComponent<Props> = ({
  items,
  style,
  className,
}) => {
  // const { t } = useTranslation()
  return (
    <>
      <Breadcrumb
        style={{
          marginBottom: ".5rem",
          fontSize: ".85rem",
          textTransform: "capitalize",
          ...style,
        }}
        className={`mt-0 mb-md ${className}`}
      >
        <Breadcrumb.Item key="default-key">
          <FiHome />
        </Breadcrumb.Item>
        {items.map((breadCrumb: string, index: number) => (
          <Breadcrumb.Item key={index.toString()}>{breadCrumb}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </>
  );
};

export default PageBreadCrumbs;
