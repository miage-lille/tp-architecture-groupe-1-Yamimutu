import { Participation } from '../entities/participation.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(public database: Participation[] = []) {}
  findByWebinarId(webinarId: string): Promise<Participation[]> {
    return Promise.resolve(
      this.database.filter(
        (participation) => participation.props.webinarId === webinarId,
      ),
    );
  }
  async save(participation: Participation): Promise<void> {
    this.database.push(participation);
  }
}
