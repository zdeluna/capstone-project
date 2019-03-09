import { Post } from './post.model';

export class Challenge {
  id: string;
  name: string;
  participants: string[];
  pendingParticipants: string[];
  startDate: Date
  activity: string;
  measurement: string;
  duration: string;
  invitees: string[];
  messages?: Post[];
}
