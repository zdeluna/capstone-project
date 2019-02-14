
export class User {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string = "";
    photoURL?: string = "";
    friends?: string[] = [];
    // activities?: Activity[] = []
  }