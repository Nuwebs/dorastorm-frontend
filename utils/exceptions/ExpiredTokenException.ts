export default class ExpiredTokenException extends Error {
  constructor(message: string){
    super(message);
    this.name = 'ExpiredTokenException';
  }
}