class AuthError extends Error {
  signal;

  //   signal correspond to the the http signal error
  constructor(name, message, signal) {
    super(message);
    this.name = name;
    this.signal = signal;
  }
}

module.exports = {
  AuthError,
};

// 400 : bad request
// 401 : unautorized
// 404 : not found
// 500 : internal server error
