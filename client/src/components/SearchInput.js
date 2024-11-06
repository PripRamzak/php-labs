import React from 'react';
import { Form } from 'react-bootstrap';

export const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <Form.Control
            className="mt-3"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};