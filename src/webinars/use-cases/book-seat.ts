import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { Participation } from '../entities/participation.entity';
import { WebinarNoMoreSeat } from 'src/webinars/exceptions/webinar-no-more-seat';



type Request = {
  webinarId: string;
  user: User;
};
type Response = void;

export class BookSeat implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly webinarRepository: IWebinarRepository,
    private readonly mailer: IMailer,
  ) {}
  async execute({ webinarId, user }: Request): Promise<Response> {    
    const webinar = await this.webinarRepository.findById(webinarId);
    const participants: Participation[] = await this.participationRepository.findByWebinarId(webinarId);
    
    // Vérifier le nombre de participants restants
    if(!webinar.hasAvailableSeat(participants.length)){
      throw new WebinarNoMoreSeat();
    }

    // Vérifier que l'on ne participe pas déjà à ce webinaire
    const userVerified = await this.userRepository.findById(user.props.id);

    if(participants.some(participant => participant.props.userId === userVerified.props.id)){
      
    }




    return;
  }
}
