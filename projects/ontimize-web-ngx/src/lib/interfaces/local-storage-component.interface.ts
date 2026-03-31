export interface ILocalStorageComponent {
  storeState?: boolean;
  getDataToStore(): object;
  getComponentKey(): string;
  getRouteKey?(): string;
}
