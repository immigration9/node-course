module.exports = class NotFound extends (
  Error
) {
  constructor(message) {
    super();

    this.message = message || 'Not Found';
  }
};
