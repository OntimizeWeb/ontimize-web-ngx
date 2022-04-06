import { Injectable, Injector } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { Observable, Observer } from 'rxjs';
import { OSafePipe } from '../pipes/o-safe.pipe';

@Injectable()
export class OntimizeMatIconRegistry {

  public static ONTIMIZE_ICON_SET_PATH = 'assets/svg/ontimize-icon-set.svg';
  public static ONTIMIZE_NAMESPACE = 'ontimize';
  protected oSafePipe: OSafePipe;
  constructor(
    protected matIconRegistry: MatIconRegistry,
    protected injector: Injector
  ) {
    this.oSafePipe = new OSafePipe(injector);
  }

  initialize() {
    this.matIconRegistry.addSvgIconSetInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE,
      this.oSafePipe.transform(OntimizeMatIconRegistry.ONTIMIZE_ICON_SET_PATH, 'resourceUrl'));
  }

  addOntimizeSvgIcon(iconName: string, url: string): MatIconRegistry {
    this.matIconRegistry.addSvgIconInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE, iconName,
      this.oSafePipe.transform(url, 'resourceUrl'));
    return this.matIconRegistry;
  }

  getSVGElement(iconName: string): Observable<SVGElement> {
    return this.matIconRegistry.getNamedSvgIcon(iconName, OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE);
  }

  existsIcon(iconName: string): Observable<boolean> {
    const self = this;
    return new Observable<boolean>((observer: Observer<boolean>) => {
      self.getSVGElement(iconName).subscribe((value: SVGElement) => {
        observer.next(true);
      }, error => {
        observer.next(false);
      }, () => observer.complete());
    });
  }
}
