import { ValidationError } from "class-validator"

type Props = {
    property: string,
    constrains: string[]
}

export const displayValidationErrors = (validationErrors: ValidationError[]) => {
    if(validationErrors && validationErrors.length > 0) {
        const errors = validationErrors.map((v, i) => {
            return {
            //   property: v.property,
              messages: [
                ...iterateConstrains(v.constraints)
              ]
            }
        })
        return errors;
    }
}

function iterateConstrains(constrains: any) {
    const arr = [];
    if(constrains !== null) {
        for(let key in constrains) {
            arr.push(constrains[key]);
        }
    }
    return arr;
}
