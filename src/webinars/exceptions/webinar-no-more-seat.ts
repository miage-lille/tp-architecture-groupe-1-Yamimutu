export class WebinarNoMoreSeat extends Error {
  constructor() {
    super(`Webinar has no more seat`);
    this.name = 'WebinarNoMoreSeat';
  }
}