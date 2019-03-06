export class Activity { 
  //help from here https://stackoverflow.com/questions/49997765/reactive-forms-correctly-convert-form-value-to-model-object
  public constructor(init?: Partial<Activity>) {
    Object.assign(this, init);
  }

  type: String;
  date: String;
  measurement: String;
  units: String;
  value: String;
  description?: String;
}
