export const stringLengthValidator = (target: unknown, context: string, len: number) => {
    if (typeof target !== "string" || target.trim().length < len) {
        return {
            valid: false,
            message: `${context} must be at least ${len} characters`,
        }
    }

    return { valid: true }
}

export const yearValidator = (year: unknown, context: string) => {
    const currentYear = new Date().getFullYear()

    if (typeof year !== "number" || year < 1000 || year > currentYear) {
        return {
            valid: false,
            message: `Invalid ${context} year`,
        }
    }

    return { valid: true }
}
