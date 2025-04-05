import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selectedDate, setSelectedDate, placeholder }) => {

    const handleDateChange = (date) => {
        if (!date) return;

        const formattedDate = date.toLocaleDateString("en-GB");
        setSelectedDate(formattedDate);
    };

    const parsedDate = selectedDate ? new Date(selectedDate.split("/").reverse().join("-")) : null;

    console.log("parsedDate", parsedDate);

    return (
        <DatePicker
            selected={parsedDate}
            onChange={handleDateChange}
            dateFormat="dd-MM-yyyy"
            placeholderText={placeholder}
            maxDate={new Date()}
            className="custom-datepicker datepicker-border"
        />
    );
}

export default CustomDatePicker;