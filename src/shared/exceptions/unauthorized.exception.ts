// src/domain/exceptions/unauthorized.exception.ts

export class UnauthorizedException extends Error {
    constructor(message: string) {
        super(`Unauthorized: ${message}`);
        this.name = 'UnauthorizedException';
    }
}
