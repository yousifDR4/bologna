import { Field } from 'formik';
import React from 'react'
import Select from 'react-select';
const ReactSelect = ({word,name,options}) => {
  return (
    <div>
    <label htmlFor={name}>{word}</label>
    <Field>
      {(probs) => {
        const { form } = probs;
        return (
          <Select
            placeholder={word}
            options={options}
            name={name}
            value={{
              value: form.values[name],
              label: form.values[name],
            }}
            onChange={(selectedOption) => {
              console.log(selectedOption.value);
              form.setFieldValue(
               name,
                selectedOption.value
              );
            }}
            onBlur={form.handleBlur}
          />
        );
      }}
    </Field>
    </div>
  )
}

export default ReactSelect