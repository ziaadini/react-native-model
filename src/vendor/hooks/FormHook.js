import {useState} from "react";

export function useFormState(initialVal, changeKey = "onChangeText", valueKey = "value") {
    const [val, setVal] = useState(initialVal);

    function handleChange(value) {
        setVal(value);
    }

    return {
        [valueKey]: val,
        [changeKey]: handleChange
    }
}