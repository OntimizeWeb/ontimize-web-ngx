import { Injector, Pipe, PipeTransform, Type } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'oSafe'
})
export class OSafePipe implements PipeTransform {
  protected sanitizer: DomSanitizer;
  constructor(protected injector: Injector) {
    this.sanitizer = this.injector.get<DomSanitizer>(DomSanitizer as Type<DomSanitizer>);
  }

  public transform(value: any, type: string): SafeHtml | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
