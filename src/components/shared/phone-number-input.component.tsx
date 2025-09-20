import React from "react";
import { Input, Select, Space, Tooltip, Tag } from "antd";
import { PhoneOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  AFRICAN_COUNTRY_CODES,
  DEFAULT_COUNTRY,
  CountryCode,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@utils/country-codes";

const { Option } = Select;

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  disabled?: boolean;
  showMoneyServices?: boolean;
  countryCode?: string;
  onCountryCodeChange?: (countryCode: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  size = "middle",
  disabled = false,
  showMoneyServices = true,
  countryCode = DEFAULT_COUNTRY.code,
  onCountryCodeChange,
  style,
  className,
}) => {
  const selectedCountry =
    AFRICAN_COUNTRY_CODES.find((country) => country.code === countryCode) ||
    DEFAULT_COUNTRY;

  const handleCountryChange = (newCountryCode: string) => {
    if (onCountryCodeChange) {
      onCountryCodeChange(newCountryCode);
    }

    // Auto-format phone number with new country code
    if (value && onChange) {
      const formattedNumber = formatPhoneNumber(newCountryCode, value);
      onChange(formattedNumber);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (onChange) {
      onChange(inputValue);
    }
  };

  const renderCountryOption = (country: CountryCode) => (
    <Option key={country.code} value={country.code}>
      <Space>
        <span>{country.flag}</span>
        <span style={{ color: "#999", fontSize: "12px" }}>
          {country.phonePrefix}
        </span>
        {showMoneyServices && (
          <Space size={4}>
            {country.mtnMoney}
            {country.orangeMoney}
          </Space>
        )}
      </Space>
    </Option>
  );

  const getMoneyServicesTooltip = (country: CountryCode) => {
    const services = [];
    if (country.mtnMoney) services.push("MTN Money");
    if (country.orangeMoney) services.push("Orange Money");

    if (services.length === 0) return "No mobile money services available";
    return `Available mobile money services: ${services.join(", ")}`;
  };

  return (
    <Input.Group compact style={style} className={className}>
      <Select
        value={countryCode}
        onChange={handleCountryChange}
        style={{ width: "20%" }}
        size={size}
        disabled={disabled}
        showSearch
        filterOption={(input, option) => {
          const country = AFRICAN_COUNTRY_CODES.find(
            (c) => c.code === option?.value
          );
          return country
            ? country.name.toLowerCase().includes(input.toLowerCase()) ||
                country.phonePrefix.includes(input)
            : false;
        }}
        dropdownRender={(menu) => (
          <div>
            {menu}
          </div>
        )}
      >
        {AFRICAN_COUNTRY_CODES.map(renderCountryOption)}
      </Select>

      <Input
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        prefix={<PhoneOutlined />}
        styles={{
          input: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          prefix: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          affixWrapper: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        }}
        style={{
          width: "65%",
        }}
        size={size}
        disabled={disabled}
        addonAfter={
          showMoneyServices ? (
            <Tooltip title={getMoneyServicesTooltip(selectedCountry)}>
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          ) : undefined
        }
      />
    </Input.Group>
  );
};

export default PhoneNumberInput;
