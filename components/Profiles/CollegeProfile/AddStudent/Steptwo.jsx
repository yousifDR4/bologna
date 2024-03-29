import React, { useEffect, useState } from "react";
import { Field, Form, useFormikContext } from "formik";
import Smallinput from "./Smallinput";
import axios from "axios";
import Select from "react-select";
import Button from "./Button";
import Largeinput from "./Largeinput";


const Steptwo = () => {
  const { handleSubmit, values, handleChange, handleBlur,setFieldValue } = useFormikContext();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log(values.countries.length);
    if(values.countries.length>0)
    return
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/positions"
        );
        const data = response.data.data;
        const temp = data.map((country) => ({
          value: country.name,
          label: country.name,
        }));
        const filteredData = temp.filter(
          (country) => country.value !== "Israel"
        );
        console.log(filteredData);
        setFieldValue("countries",filteredData)

        setCountries(filteredData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Form className="parent">
      <span className="flexspan">
      <label htmlFor={"selectedCountry"} className="mylabel">select country</label>
      <Select
      placeholder={"select country"}
        className="myselect spanreact"
        options={values.countries}
        name="selectedCountry"
        value={{value:values.selectedCountry,label:values.selectedCountry}}
        onChange={(selectedOption) =>
          handleChange("selectedCountry")(selectedOption.value)
        }
        onBlur={() => handleBlur("selectedCountry")}
      />
      </span>
      <Smallinput name="city" word="city" type="text" />
      <Smallinput name="address" word="address" type="text" />
      <Smallinput name="secaddress" word="second address" type="text" />
      <span className="flexspan">
      <label htmlFor={"birthcountry"} className="mylabel">select birth country</label>
      <Select
      placeholder={"select country"}
        className="myselect spanreact"
        options={values.countries}
        name="birthcountry"
        value={{value:values.birthcountry,label:values.birthcountry}}
        onChange={(selectedOption) =>
          handleChange("birthcountry")(selectedOption.value)
        }
        onBlur={() => handleBlur("birthcountry")}
      />
      </span>
      <Smallinput name="acceptancetype" word="acceptance type" type="text" />
      <Smallinput name="fatherwork" word="father work" type="text" />
      <Largeinput name="note" word="note" type="text" />
      <span className="flexspan">
      <label htmlFor={"bloodgroup"} className="mylabel">blood group</label>
      <Select
      placeholder={"select country"}
        className="myselect spanreact"
        options={[{label:"A",value:"A"},{label:"B",value:"B"},{label:"c",value:"c"}]}
        name="selectedCountry"
        value={{value:values.bloodgroup,label:values.bloodgroup}}
        onChange={(selectedOption) =>
          handleChange("bloodgroup")(selectedOption.value)
        }
        onBlur={() => handleBlur("bloodgroup")}
      />
      </span>


      <span className="buttonflex">
        <label htmlFor="button" className="mylabel"></label>

    <Button/>
      </span>
    </Form>
  );
};


export default Steptwo;
