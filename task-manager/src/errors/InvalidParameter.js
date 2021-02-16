module.exports = class InvalidParameter extends (
  Error
) {
  constructor(message) {
    super();

    this.message = message || 'Invalid Parameter';
  }
};
