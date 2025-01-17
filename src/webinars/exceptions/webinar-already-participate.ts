export class WebinarUserAlreadyParticipateException extends Error {
  constructor() {
    super('User already participate in this webinar');
    this.name = 'WebinarUserAlreadyParticipateException';
  }
}
