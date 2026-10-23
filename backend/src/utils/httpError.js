// Creates an Error that carries an HTTP status code.
// The error handler middleware turns it into a JSON response.
export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
