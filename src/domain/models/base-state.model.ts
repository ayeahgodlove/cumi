export interface IBaseState {
    readonly isLoading: boolean
    readonly isSearching?: boolean
    readonly errors?: any
    readonly initialFetch: boolean
}

