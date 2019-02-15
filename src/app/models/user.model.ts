export class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string = "";
    photoURL?: string = "";
    friends?: string[] = [];
    location?: string;
    dateOfBirth?: Date;
  }
