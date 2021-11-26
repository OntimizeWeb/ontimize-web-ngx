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

  // it('#getObservableValue should return value from observable',
  //   (done: DoneFn) => {
  //     service.getObservableValue().subscribe(value => {
  //       expect(value).toBe('observable value');
  //       done();
  //     });
  //   });

  // it('#getPromiseValue should return value from a promise',
  //   (done: DoneFn) => {
  //     service.getPromiseValue().then(value => {
  //       expect(value).toBe('promise value');
  //       done();
  //     });
  //   });
});