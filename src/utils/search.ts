export default function search<T>(
    object: T,
    properties: Array<keyof T>,
    query: string,
    isCaseSensitive: boolean
): boolean {
    if (query === '') {
        return true
    }

    return properties.some((property) => {
        const value = object[property]

        if (typeof value === 'string' || typeof value === 'number') {
            if (isCaseSensitive) {
                return value.toString().includes(query)
            } else {
                return value
                    .toString()
                    .toLocaleLowerCase()
                    .includes(query.toLocaleLowerCase())
            }
        }

        return false
    })
}
