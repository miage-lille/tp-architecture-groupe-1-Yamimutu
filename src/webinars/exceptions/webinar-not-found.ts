export class WebinarNotFound extends Error {
  constructor(webinarId: string) {
    super(`Webinar with id ${webinarId} not found`);
    this.name = 'WebinarNotFound';
  }
}