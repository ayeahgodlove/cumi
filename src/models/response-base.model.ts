
export interface IResponseBase {
    message: string;
    success: boolean;
    validationErrors: []
}

export const emptyResponseBase: IResponseBase = {
    success: false,
    message: '',
    validationErrors: []
}
