import get from "lodash.get"; // Ensure lodash is installed: `npm install lodash`

class Validator {
  private data: Record<string, any> = {};
  private errors: Record<string, string[]> = {}; // Errors grouped by fields

  validate(data: Record<string, any>): this {
    this.data = data;
    this.errors = {};
    return this;
  }

  private addError(field: string, message: string): void {
    if (!this.errors[field]) {
      this.errors[field] = [];
    }
    this.errors[field].push(message);
  }

  private resolveField(field: string): any {
    return get(this.data, field);
  }

  require(
    field: string,
    options: {
      message?: string;
      type?: "string" | "number" | "boolean" | "object" | "array";
      minValue?: number;
      maxValue?: number;
      minLength?: number;
      maxLength?: number;
    } | string | null = null
  ): this {
    let { message, type, minValue, maxValue, minLength, maxLength } =
      typeof options === "object" ? options : {};
    if (typeof options === "string") message = options;

    const value = this.resolveField(field);

    if (value === undefined || value === null || value === "") {
      this.addError(field, message || `${field} is required`);
    } else {
      if (type && typeof value !== type) {
        this.addError(field, message || `${field} must be a ${type}`);
      }
      if (minValue !== undefined && value < minValue) {
        this.addError(field, `${field} must be at least ${minValue}`);
      }
      if (maxValue !== undefined && value > maxValue) {
        this.addError(field, `${field} must be at most ${maxValue}`);
      }
      if (minLength !== undefined && value.length < minLength) {
        this.addError(field, `${field} must be at least ${minLength} characters long`);
      }
      if (maxLength !== undefined && value.length > maxLength) {
        this.addError(field, `${field} must not exceed ${maxLength} characters`);
      }
    }

    return this;
  }

  email(field: string, message = `${field} is not a valid email`): this {
    const value = this.resolveField(field);
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.addError(field, message);
    }
    return this;
  }

  phone(field: string, message = `${field} is not a valid phone number`): this {
    const value = this.resolveField(field);
    if (value && !/^\d{10,15}$/.test(value)) {
      this.addError(field, message);
    }
    return this;
  }

  password(
    field: string,
    message = `${field} must be at least 8 characters, include uppercase, lowercase, number, and special character`
  ): this {
    const value = this.resolveField(field);
    if (
      !value ||
      value.length < 8 ||
      !/[A-Z]/.test(value) ||
      !/[a-z]/.test(value) ||
      !/\d/.test(value) ||
      !/[!@#\$%\^&*()_+{}\[\]:;<>,.?~\\\-]/.test(value)
    ) {
      this.addError(field, message);
    }
    return this;
  }

  number(field: string, message = `${field} must be a number`): this {
    const value = this.resolveField(field);
    if (typeof value !== "number") {
      this.addError(field, message);
    }
    return this;
  }

  integer(field: string, message = `${field} must be an integer`): this {
    const value = this.resolveField(field);
    if (!Number.isInteger(value)) {
      this.addError(field, message);
    }
    return this;
  }

  array(field: string, message = `${field} must be an array`): this {
    const value = this.resolveField(field);
    if (!Array.isArray(value)) {
      this.addError(field, message);
    }
    return this;
  }

  enum(field: string, allowedValues: any[], message?: string): this {
    const value = this.resolveField(field);
    if (!allowedValues.includes(value)) {
      this.addError(field, message || `${field} must be one of ${allowedValues.join(", ")}`);
    }
    return this;
  }

  url(field: string, message = `${field} is not a valid URL`): this {
    const value = this.resolveField(field);
    const urlRegex =
      /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(:\d+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (value && !urlRegex.test(value)) {
      this.addError(field, message);
    }
    return this;
  }

  custom(field: string, func: (value: any) => boolean, message = `Validation failed`): this {
    const value = this.resolveField(field);
    if (!func(value)) {
      this.addError(field, message);
    }
    return this;
  }

  isValid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  getErrors(): Record<string, string[]> {
    console.log(this.errors)
    return this.errors;
  }

  validateAll(rules: { [key: string]: (v: this) => void }): this {
    for (const field in rules) {
      rules[field](this);
    }
    return this;
  }

  extractMessages(errors:any) {
    const messages:any = [];

    for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
            errors[key].forEach((message:any) => {
                messages.push(message);
            });
        }
    }

    return messages;
}

  end(): void {
    if (!this.isValid()) {
      const errorStack = JSON.stringify(this.errors, null, 2)
      const errorMessage = this.extractMessages(this.errors) ?? ""
      const validationError = new Error(errorMessage);
      (validationError as any).isValidationError = true; // Add a custom property
      (validationError as any).stack = errorStack; // Add a custom property
      throw validationError;
    }
  }
}

export default Validator;
