export class OValueChangeEvent {
  public static USER_CHANGE = 0;
  public static PROGRAMMATIC_CHANGE = 1;

  constructor(
    public type: number,
    public newValue: any,
    public oldValue: any,
    public target: any) { }

  public isUserChange(): boolean {
    return this.type === OValueChangeEvent.USER_CHANGE;
  }

  public isProgrammaticChange(): boolean {
    return this.type === OValueChangeEvent.PROGRAMMATIC_CHANGE;
  }
}
