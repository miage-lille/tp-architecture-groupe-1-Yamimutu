import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import {WebinarNotFound} from 'src/webinars/exceptions/webinar-not-found';

export class InMemoryWebinarRepository implements IWebinarRepository {
  constructor(public database: Webinar[] = []) {}
  findById(webinarId: string): Promise<Webinar> {
    const webinar = this.database.find((webinar) => webinar.props.id == webinarId);
    if (!webinar) {
      throw new WebinarNotFound(`Webinar with id ${webinarId} not found`);
    }
    return Promise.resolve(webinar);
  }
  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }
}
