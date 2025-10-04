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
  // Convert items to the new format
  const breadcrumbItems = [
    {
      title: <FiHome />,
    },
    ...items.map((breadCrumb: string, index: number) => ({
      title: breadCrumb,
    })),
  ];

return (
    <>
      <Breadcrumb
        items={breadcrumbItems}
        style={{
          marginBottom: ".5rem",
          fontSize: ".85rem",
          textTransform: "capitalize",
          ...style,
        }}
        className={`mt-0 mb-md ${className}`}
      />
    </>
  );
};

export default PageBreadCrumbs;
