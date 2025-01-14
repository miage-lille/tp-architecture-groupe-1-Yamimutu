import { Webinar } from 'src/webinars/entities/webinar.entity';

export interface IWebinarRepository {
  findById(webinarId: string): Promise<Webinar>;
  create(webinar: Webinar): Promise<void>;
}
