module.exports = class Unauthorized extends (
  Error
) {
  constructor(message) {
    super();

    this.message = message || 'Unauthorized';
  }
};
