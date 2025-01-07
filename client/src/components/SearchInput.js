import React, { useEffect, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import Cookies from 'js-cookie';

export const SearchInput = ({value, onChange, cookieName, placeholder }) => {
    const [recentValues, setRecentValues] = useState([]);
    const [showRecentValues, setShowRecentValues] = useState(false)

    useEffect(() => {
        const values = Cookies.get(cookieName);
        if (values) {
            setRecentValues(JSON.parse(values));
        }
    }, [])

    const handleSelect = (value) => {
        onChange({ target: { value } });
        setShowRecentValues(false);
    }

    return (
        <>
            <Form.Control
                className="mt-3"
                type="text"
                value={value}
                onChange={onChange}
                onFocus={() => setShowRecentValues(true)}
                onBlur={() => setTimeout(() => setShowRecentValues(false), 200)}
                placeholder={placeholder}
            >
            </Form.Control>
            {recentValues.length > 0 && (
                <Dropdown show={showRecentValues} onSelect={handleSelect}>
                    <Dropdown.Menu>
                        {recentValues.map((value, index) => (
                            <Dropdown.Item
                                key={index}
                                eventKey={value}
                                style={{ cursor: 'pointer' }}
                            >
                                {value}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </>
    );
};