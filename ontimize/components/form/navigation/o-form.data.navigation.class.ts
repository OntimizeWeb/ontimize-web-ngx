import { ILocalStorageComponent } from '../../../components/o-service-component.class';
import { LocalStorageService } from '../../../services';

export class OFormDataNavigation implements ILocalStorageComponent {
    protected state: any = [];

    protected localStorageService: LocalStorageService;
    protected onRouteChangeStorageSubscribe: any;

    constructor(injector) {
        let self = this;
        this.localStorageService = injector.get(LocalStorageService);
        this.onRouteChangeStorageSubscribe = this.localStorageService.onRouteChange.subscribe(function (res) {
            self.localStorageService.updateComponentStorage(self, false);
        });
    }
    getComponentKey(): string {
        return 'navigation-data';
    }

    getDataToStore(): Object {
        return this.state;
    }

    setDataToStore(state: Object) {
        this.state = state;
    }
    getComponentStorage():any[] {
        let storageObject = this.localStorageService.getComponentStorage(this,false);
        let storageArray = [];

        Object.keys(storageObject).map(x=> storageArray.push(storageObject[x]));

        return storageArray;
    }
}
