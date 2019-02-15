export class User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    photoURL?: string = "";
    friends?: string[] = [];
    location?: string;
    dateOfBirth?: Date;
  }
