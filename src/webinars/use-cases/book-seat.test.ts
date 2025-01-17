import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { InMemoryParticipationRepository } from '../adapters/participation-repository.in-memory';
import { InMemoryUserRepository } from '../../users/adapters/user-repository.in-memory';
import { BookSeat } from './book-seat';
import { User } from '../../users/entities/user.entity';
import { InMemoryMailer } from '../../core/adapters/in-memory-mailer';
import { Webinar } from '../entities/webinar.entity';
import { Participation } from '../entities/participation.entity';

describe('Feature: Book Seat', () => {
  let participationRepository: InMemoryParticipationRepository;
  let webinaireRepository: InMemoryWebinarRepository;
  let userRepository: InMemoryUserRepository;
  let useCase: BookSeat;
  let mailer: InMemoryMailer;

  const payload = {
    webinarId: '1',
    user: new User({ id: '1', email: 'alice@gmail.com', password: '123' }),
  };

  beforeEach(() => {
    participationRepository = new InMemoryParticipationRepository();
    webinaireRepository = new InMemoryWebinarRepository();
    userRepository = new InMemoryUserRepository();
    mailer = new InMemoryMailer();
    useCase = new BookSeat(
      participationRepository,
      userRepository,
      webinaireRepository,
      mailer,
    );
  });

  describe(`Scenario: Parameters doesn't exist`, () => {
    it(`should throw an error for the user`, async () => {
      webinaireRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar 1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 10,
        }),
      );

      await expect(useCase.execute(payload)).rejects.toThrow(
        `User with id ${payload.user.props.id} not found`,
      );
    });

    it(`should throw an error for the webinar`, async () => {
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );
      await expect(useCase.execute(payload)).rejects.toThrow(
        `Webinar with id ${payload.webinarId} not found`,
      );
    });
  });

  describe('Scenario: Too many participants', () => {
    it('should throw an error', async () => {
      webinaireRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar 1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 0,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );

      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinar has no more seat',
      );
    });
  });

  describe('Scenario: Participant already participate', () => {
    it('should throw an error', async () => {
      webinaireRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar 1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 10,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );

      participationRepository.save(
        new Participation({ userId: '1', webinarId: '1' }),
      );

      await expect(useCase.execute(payload)).rejects.toThrow(
        'User already participate in this webinar',
      );
    });
  });

  describe('Scenario: Happy path', () => {
    it('user should be add to the participants', async () => {
      webinaireRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar 1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 10,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );

      await useCase.execute(payload);

      const participants = participationRepository.database[0];
      expect(participants.props).toEqual({
        userId: '1',
        webinarId: '1',
      });
    });

    it('should send an email to the organizer', async () => {
      const webinaireTitle = 'Webinar 1';
      webinaireRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: webinaireTitle,
          startDate: new Date(),
          endDate: new Date(),
          seats: 10,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );

      await useCase.execute(payload);

      const email = mailer.sentEmails[0];
      expect(email).toEqual({
        to: 'organisateur@gmail.com',
        subject: `Confirmation de réservation pour le webinaire ${webinaireTitle}`,
        body: `Bonjour l'utilisateur avec le mail suivant : ${payload.user.props.email} s'est inscrit pour le webinaire : ${webinaireTitle}.`,
      });
    });
  });
});
