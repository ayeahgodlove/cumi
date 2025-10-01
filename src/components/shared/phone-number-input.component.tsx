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
  size = "large",
  disabled = false,
  showMoneyServices = true,
  countryCode = DEFAULT_COUNTRY.code,
  onCountryCodeChange,
  style,
  className,
}) => {
  const [internalCountryCode, setInternalCountryCode] =
    React.useState(countryCode);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const selectedCountry =
    AFRICAN_COUNTRY_CODES.find(
      (country) => country.code === internalCountryCode
    ) || DEFAULT_COUNTRY;

  // Auto-add country code on mount if field is empty
  React.useEffect(() => {
    if (!isInitialized && !value && onChange) {
      const initialCountry = AFRICAN_COUNTRY_CODES.find(
        (c) => c.code === countryCode
      ) || DEFAULT_COUNTRY;
      
      onChange(`${initialCountry.phonePrefix} `);
      setIsInitialized(true);
    }
  }, [countryCode, value, onChange, isInitialized]);

  const handleCountryChange = (newCountryCode: string) => {
    setInternalCountryCode(newCountryCode);

    if (onCountryCodeChange) {
      onCountryCodeChange(newCountryCode);
    }

    const newCountry = AFRICAN_COUNTRY_CODES.find(
      (c) => c.code === newCountryCode
    );

    // Auto-add country code prefix to the phone number
    if (newCountry && onChange) {
      // Remove any existing country code prefix and spaces
      let cleanNumber = value.replace(/^\+\d+\s*/, "").trim();

      // Add the new country code prefix
      const numberWithPrefix = cleanNumber 
        ? `${newCountry.phonePrefix} ${cleanNumber}`
        : `${newCountry.phonePrefix} `;
      onChange(numberWithPrefix);
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
    <Input.Group
      compact
      style={{ width: "100%", ...style }}
      className={className}
    >
      <Select
        value={internalCountryCode}
        onChange={handleCountryChange}
        style={{ width: "30%" }}
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
        dropdownRender={(menu) => <div>{menu}</div>}
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
          width: "70%",
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
