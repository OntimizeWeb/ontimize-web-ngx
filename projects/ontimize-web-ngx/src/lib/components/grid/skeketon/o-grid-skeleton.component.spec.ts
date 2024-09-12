import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OGridSkeletonComponent } from './o-grid-skeleton.component';
import { Injector } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../../config/app-config';
import { TestUtils } from '../../input/test/test-utils';
import { appConfigFactory } from '../../../services/app-config.provider';
import { AppearanceService } from '../../../services/appearance.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from '../../../services/local-storage.service';


describe('OGridSkeletonComponent', () => {
  let component: OGridSkeletonComponent;
  let fixture: ComponentFixture<OGridSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OGridSkeletonComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: APP_CONFIG, useValue: TestUtils.mockConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] },
        AppearanceService,
        AuthService,
        LocalStorageService
        // ...INTERNAL_ONTIMIZE_MODULES
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OGridSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
