import { Select, SelectItem, Avatar, Input } from "@heroui/react";
import { useState } from "react";

const countries = [
    { key: "us", flag: "https://flagcdn.com/us.svg", code: "+1" },
    { key: "uk", flag: "https://flagcdn.com/gb.svg", code: "+44" },
    { key: "india", flag: "https://flagcdn.com/in.svg", code: "+91" },
    { key: "france", flag: "https://flagcdn.com/fr.svg", code: "+33" },
    { key: "germany", flag: "https://flagcdn.com/de.svg", code: "+49" },
    { key: "canada", flag: "https://flagcdn.com/ca.svg", code: "+1" },
    { key: "australia", flag: "https://flagcdn.com/au.svg", code: "+61" },
    { key: "japan", flag: "https://flagcdn.com/jp.svg", code: "+81" },
    { key: "brazil", flag: "https://flagcdn.com/br.svg", code: "+55" },
    { key: "italy", flag: "https://flagcdn.com/it.svg", code: "+39" },
    { key: "spain", flag: "https://flagcdn.com/es.svg", code: "+34" },
    { key: "mexico", flag: "https://flagcdn.com/mx.svg", code: "+52" },
    { key: "china", flag: "https://flagcdn.com/cn.svg", code: "+86" },
    { key: "russia", flag: "https://flagcdn.com/ru.svg", code: "+7" },
    { key: "south_africa", flag: "https://flagcdn.com/za.svg", code: "+27" },
    { key: "netherlands", flag: "https://flagcdn.com/nl.svg", code: "+31" },
    { key: "sweden", flag: "https://flagcdn.com/se.svg", code: "+46" },
    { key: "switzerland", flag: "https://flagcdn.com/ch.svg", code: "+41" },
    { key: "south_korea", flag: "https://flagcdn.com/kr.svg", code: "+82" },
    { key: "uae", flag: "https://flagcdn.com/ae.svg", code: "+971" },
  ];
  

const PhoneInput = ({
  phoneValue,
  onPhoneChange,
  countryValue,
  onCountryChange,
  required = true,
  inputClassName = "",
  isDisabled = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === countryValue) || countries[0]
  );

  const handleCountryChange = (keys) => {
    if (isDisabled) return;
    const selected = countries.find((c) => c.key === [...keys][0]);
    setSelectedCountry(selected);
    onCountryChange(selected.code); // Send country code to parent
  };


  return (
    <div className="relative flex items-start gap-2 w-full">
      {/* Country Select */}
      <Select
        className="w-20 min-w-[60px] flex-shrink-0"
        selectedKeys={[selectedCountry.key]}
        onSelectionChange={handleCountryChange}
        isDisabled={isDisabled}
        renderValue={() => (
          <Avatar
            className="w-6 h-6 rounded-full aspect-square"
            src={selectedCountry.flag}
            alt={selectedCountry.key}
          />
        )}
      >
        {countries.map((country) => (
          <SelectItem
            key={country.key}
            startContent={
              <Avatar
                className="w-9 h-5 rounded-full aspect-square"
                src={country.flag}
                alt={country.key}
              />
            }
          >
            {country.code}
          </SelectItem>
        ))}
      </Select>

      {/* Phone Input */}
      <Input
        className={`${inputClassName} ${isDisabled ? "bg-gray-100 opacity-70" : ""}`}
        type="tel"
        placeholder="Enter phone number"
        value={phoneValue} // Ensure phoneValue is always a string
        onChange={(e) => isDisabled ? null : onPhoneChange(e.target.value)}
        variant="bordered"
        radius="sm"
        required={required}
        isDisabled={isDisabled}
        isReadOnly={isDisabled}
      />
    </div>
  );
};

export default PhoneInput;
