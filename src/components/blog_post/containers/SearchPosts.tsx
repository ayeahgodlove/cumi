import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

interface SearchPostsProps {
  search: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchPosts = ({ search }: SearchPostsProps) => {
  return (
    <>
      <Input
        className="search-products"
        placeholder="Search..."
        onChange={search}
        prefix={<SearchOutlined />}
        size="large"
        allowClear
        
      />
    </>
  );
};

export default SearchPosts;
