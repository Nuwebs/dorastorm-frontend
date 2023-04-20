export default class InvalidTokenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTokenException";
  }
}
