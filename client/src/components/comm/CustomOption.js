import React from "react";

function CustomOption({ list }) {
    return (
        list && list.map((v, idx) => <option key={idx} value={v.value} label={v.label}></option>)
    );
}

export default CustomOption;
