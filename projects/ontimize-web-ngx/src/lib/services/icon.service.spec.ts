import { Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { IconService } from './icon.service';



describe('IconService', () => {
  let service: IconService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IconService,
          useClass: IconService,
          deps: [Injector, DomSanitizer]
        }
      ]
    });
  }));


  it('#getIconPosition should return default value', () => {
    service = TestBed.get(IconService);
    expect(service.iconPosition).toBe(IconService.DEFAULT_ICON_POSITION);
  });

  it('#getIconPosition should return default "right"', () => {
    service = TestBed.get(IconService);
    service.iconPosition = 'right';
    expect(service.iconPosition).toBe('right');
  });

  it('#getIconValue should return xxxx', () => {
    service = TestBed.get(IconService);
    const domSanitizer: DomSanitizer = TestBed.get(DomSanitizer);
    const text = "my-value<mat-icon class='mat-24 mat-icon notranslate material-icons mat-icon-no-color' role='img' aria-hidden='true'>sportIcon</mat-icon>"
    const expected = domSanitizer.bypassSecurityTrustHtml(text);

    const args = {
      iconPosition: 'right',
      icon: 'sportIcon'
    };
    expect(service.getIconValue('my-value', args)).toEqual(expected);
  });

});