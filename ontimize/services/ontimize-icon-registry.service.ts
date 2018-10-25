import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class OntimizeMatIconRegistry {

  public static ONTIMIZE_ICON_SET_PATH = 'assets/svg/ontimize-icon-set.svg';
  public static ONTIMIZE_NAMESPACE = 'ontimize';

  constructor(
    protected domSanitizer: DomSanitizer,
    protected matIconRegistry: MatIconRegistry
  ) {

  }

  initialize() {
    this.matIconRegistry.addSvgIconSetInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE,
      this.domSanitizer.bypassSecurityTrustResourceUrl(OntimizeMatIconRegistry.ONTIMIZE_ICON_SET_PATH));
  }

  addOntimizeSvgIcon(iconName: string, url: string): MatIconRegistry {
    this.matIconRegistry.addSvgIconInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE, iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(url));
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
