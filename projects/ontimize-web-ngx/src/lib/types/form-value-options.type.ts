export type FormValueOptions = {
  // If onlySelf is true, this change will only affect the validation of this FormControl and not its parent component. This defaults to false.
  onlySelf?: boolean;
  // If emitEvent is true, this change will cause a valueChanges event on the FormControl to be emitted. This defaults to true (as it falls through to updateValueAndValidity).
  emitEvent?: boolean;
  // If emitModelToViewChange is true, the view will be notified about the new value via an onChange event. This is the default behavior if emitModelToViewChange is not specified.
  emitModelToViewChange?: boolean;
  // If emitViewToModelChange is true, an ngModelChange event will be fired to update the model. This is the default behavior if emitViewToModelChange is not specified.
  emitViewToModelChange?: boolean;
  // If changeType is 0, the onValueChage event will trigger an event performed by the user but an event performed by programming.
  changeType?: number;
  // If emitModelToViewValueChange is true, the view will be notified about the new value via an onValueChange event. This is the default behavior if emitModelToViewValueChange is not specified.
  emitModelToViewValueChange?: boolean;
};
