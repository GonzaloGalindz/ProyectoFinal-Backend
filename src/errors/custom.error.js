export default class CustomError {
  static createError(error) {
    if (error.status) {
      return {
        status: error.status,
        errors: [new Error(error.message, error.key)],
        message: error.message,
      };
    } else {
      return {
        status: 400,
        errors: [error],
      };
    }
  }
}
