import { Injectable, Optional, Inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class OntimizeMatIconRegistry extends MatIconRegistry {

  public static ONTIMIZE_ICON_SET_PATH = 'assets/svg/ontimize-icon-set.svg';
  public static ONTIMIZE_NAMESPACE = 'ontimize';

  protected domSanitizer: DomSanitizer;

  constructor(
    http: HttpClient,
    sanitizer: DomSanitizer,
    @Optional() @Inject(DOCUMENT) document
  ) {
    super(http, sanitizer, document);
    this.domSanitizer = sanitizer;
    this.addSvgIconSetInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE,
      this.domSanitizer.bypassSecurityTrustResourceUrl(OntimizeMatIconRegistry.ONTIMIZE_ICON_SET_PATH));
  }

  addOntimizeSvgIcon(iconName: string, url: string): this {
    return this.addSvgIconInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE, iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(url));
  }

  getSVGElement(iconName: string): Observable<SVGElement> {
    return this.getNamedSvgIcon(iconName, OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE);
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
