import React, { useEffect, useState } from "react";
import { Form, useFormikContext } from "formik";
import Smallinput from "./Smallinput";
import axios from "axios";
import Select from "react-select";

const Steptwo = () => {
  const { handleSubmit, values, handleChange, handleBlur } = useFormikContext();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries/positions");
        const data = response.data.data;
        const temp = data.map((country) => ({ value: country.name, label: country.name }));
        const filteredData = temp.filter((country) => country.value !== "Israel");
        setCountries(filteredData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Form className="parent">
      <Select
        options={countries}
        name="selectedCountry"
        value={countries.find((country) => country.value === values.selectedCountry)}
        onChange={(selectedOption) => handleChange("selectedCountry")(selectedOption.value)}
        onBlur={() => handleBlur("selectedCountry")}
      />
      <Smallinput name="country" word="country" type="text" />
      <Smallinput name="city" word="city" type="text" />
      <Smallinput name="address" word="address" type="text" />
      <Smallinput name="secaddress" word="second address" type="text" />
      <Smallinput name="birthcountry" word="birth country" type="text" />
      <span className="spanflex buttonflex">
        <label htmlFor="button" className="mylabel"></label>
        <button type="submit" className="mybutton" onClick={handleSubmit}>
          Submit
        </button>
      </span>
    </Form>
  );
};

export default Steptwo;
