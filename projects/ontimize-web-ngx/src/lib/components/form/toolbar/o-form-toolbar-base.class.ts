export abstract class OFormToolbarBase {
  isDetail: boolean;
  editMode: boolean;
  abstract setInitialMode(): void;
  abstract setInsertMode(): void;
  abstract setEditMode(): void;
}