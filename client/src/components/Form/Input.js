import React from 'react';

const Input = (props) => {
  const { label, onChange, required, name, val } = props;
  return (
    <label>
        {label}:
        <input type="text" name={name} onChange={onChange} required={required} value={val}/>
    </label>
  );
}

export default Input;