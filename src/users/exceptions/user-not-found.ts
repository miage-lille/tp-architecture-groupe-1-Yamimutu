export class UserNotFound extends Error {
  constructor(userId: string) {
    super(`User with id ${userId} not found`);
    this.name = 'UserNotFound';
  }
}