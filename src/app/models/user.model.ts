import { Activity_Type } from './activity_type.model';
import { Activity } from './activity.model';

export class User {
    id: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    photoURL?: string = "assets/flat-icons/user-no-photo.svg";
    friends?: string[] = [];
    pending_friends?: string[] = [];
    challenges?: string[] = [];
    pending_challenges?: string[] = [];
    location?: string;
    dateOfBirth?: Date;
    activities?: Activity[];
    activity_types?: Activity_Type[] = [
      {name: 'Running'},
      {name: 'Biking'},
      {name: 'Elliptical'},
      {name: 'Rowing'}
    ];
    token?: string;
  }
