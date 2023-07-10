import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig, APP_CONFIG } from '../../../config/app-config';
import { OTranslateModule } from '../../../pipes/o-translate.pipe';
import { OFilterBuilderMenuComponent } from './filter-builder-menu.component';
import { appConfigFactory } from '../../../services';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestUtils } from '../../input/test/test-utils';
import { FakeMatIconRegistry } from '../../input/test/fake-icon-registry';

describe('FilterBuilderQueryButtonComponent', () => {
  let component: OFilterBuilderMenuComponent;
  let fixture: ComponentFixture<OFilterBuilderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OFilterBuilderMenuComponent],
      imports: [MatIconModule, OTranslateModule, MatDialogModule, MatButtonModule, MatMenuModule, HttpClientModule, NoopAnimationsModule],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateService,
          deps: [Injector]
        },
        { provide: APP_CONFIG, useValue: TestUtils.mockConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OFilterBuilderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
