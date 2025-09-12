import { SortPostsType } from "@domain/models/shared/sort.model";
import { Select } from "antd";

interface SortPostsProps {
  sortOrderValue: SortPostsType;
  sortOrderChange: (value: SortPostsType) => void;
}

const SortPosts = ({ sortOrderValue, sortOrderChange }: SortPostsProps) => {
  return (
    <>
      <label htmlFor="sortOrder" className="sort-label">
        Sort by:
      </label>
      <Select
        showSearch
        style={{ width: 100 }}
        allowClear
        options={[
          { value: "", label: "Default List" },
          { value: "date", label: "Date" },
          { value: "title", label: "Title" },
          { value: "author", label: "Author" },
        ]}
        id="sortOrder"
        onChange={sortOrderChange}
      />
    </>
  );
};

export default SortPosts;
