import { Injectable, Injector } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class IconRegistryService {
  public static ONTIMIZE_ICON_SET_PATH = 'assets/svg/ontimize-icon-set.svg';
  public static ONTIMIZE_NAMESPACE = 'ontimize';
  protected matIconRegistry: any;
  protected domSanitizer: DomSanitizer;

  constructor(
    protected injector: Injector
  ) {
    this.matIconRegistry = injector.get(MatIconRegistry);
    this.domSanitizer = injector.get(DomSanitizer);
    this.matIconRegistry.addSvgIconSetInNamespace(IconRegistryService.ONTIMIZE_NAMESPACE,
      this.domSanitizer.bypassSecurityTrustResourceUrl(IconRegistryService.ONTIMIZE_ICON_SET_PATH));
  }

  addSvgIcon(iconName: string, url: SafeResourceUrl) {
    this.matIconRegistry.addSvgIconInNamespace(IconRegistryService.ONTIMIZE_NAMESPACE, iconName, url);
  }

  getSVGElement(iconName: string): Observable<SVGElement> {
    return this.matIconRegistry.getNamedSvgIcon(iconName, IconRegistryService.ONTIMIZE_NAMESPACE);
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
