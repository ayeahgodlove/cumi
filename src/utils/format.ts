import moment from 'moment'

// interface Date extends Date {
//   firstMinuteOfDay(date: DateConstructor): Date;
//}

function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-GB').format(num)
}

/**
 *
 * @param date
 * @returns sets time of date to first minute of the day
 */
function firstMinuteOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
}

/**
 *
 * @param date
 * @returns sets time of date to the last minute of the day
 */
function lastMinuteOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
}

function formatDate(date?: Date): string {
    return moment(date).format('DD/MM/YYYY')
}

function formatIsoDate(date: Date): string {
    return new Date(date).toISOString()
}

function formatShortDate(date: Date): string {
    return moment(date).format('DD/MM')
}

function formatShortDay(date: Date): string {
    return moment(date).format('DD')
}

function formatShortMonth(date: Date): string {
    return moment(date).format('DD')
}

function formatFullYear(date: Date): string {
    return moment(date).format('YYYY')
}

function formatFullMonth(date: Date): string {
    return moment(date).format('MMMM')
}

function sevenChar(str: string): string {
    switch (str.length) {
        case 1:
            return `000000${str}`
        case 2:
            return `00000${str}`
        case 3:
            return `0000${str}`
        case 4:
            return `000${str}`
        case 5:
            return `00${str}`
        case 6:
            return `0${str}`
        case 7:
            return `${str}`
        default:
            return str
    }
}

function sixChar(str: string): string {
    switch (str.length) {
        case 1:
            return `00000${str}`
        case 2:
            return `0000${str}`
        case 3:
            return `000${str}`
        case 4:
            return `00${str}`
        case 5:
            return `0${str}`
        case 6:
            return `${str}`
        default:
            return str
    }
}

function fiveChar(str: string): string {
    switch (str.length) {
        case 1:
            return `0000${str}`
        case 2:
            return `000${str}`
        case 3:
            return `00${str}`
        case 4:
            return `0${str}`
        case 5:
            return `${str}`
        default:
            return str
    }
}

function fourChar(str: string): string {
    switch (str.length) {
        case 1:
            return `000${str}`
        case 2:
            return `00${str}`
        case 3:
            return `0${str}`
        case 4:
            return `${str}`
        default:
            return str
    }
}

function threeChar(str: string): string {
    switch (str.length) {
        case 1:
            return `00${str}`
        case 2:
            return `0${str}`
        case 3:
            return `${str}`
        default:
            return str
    }
}

function twoChar(str: string): string {
    switch (str.length) {
        case 1:
            return `0${str}`
        case 2:
            return `${str}`
        default:
            return str
    }
}

function toGender(str: string) {
    return str === '01' ? 'Male' : 'Female'
}

export const format = {
    number: (num: number) => formatNumber(num),
    date: (date?: Date) => formatDate(date),
    isodate: (date: Date) => formatIsoDate(date),
    shortDate: (date: Date) => formatShortDate(date),
    shortDay: (date: Date) => formatShortDay(date),
    shortMonth: (date: Date) => formatShortMonth(date),
    fullMonth: (date: Date) => formatFullMonth(date),
    fullYear: (date: Date) => formatFullYear(date),
    sevenChar,
    sixChar,
    fiveChar,
    fourChar,
    threeChar,
    twoChar,
    toGender: (str: string) => toGender(str),
    firstMinuteOfDay: (date: Date) => firstMinuteOfDay(date),
    lastMinuteOfDay: (date: Date) => lastMinuteOfDay(date),
}

