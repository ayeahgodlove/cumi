// src/domain/exceptions/invalid-phone.exception.ts

export class InvalidPhoneException extends Error {
    constructor(phone: string) {
      super(`Invalid phone: ${phone}`);
      this.name = 'InvalidphoneException';
    }
  }
  