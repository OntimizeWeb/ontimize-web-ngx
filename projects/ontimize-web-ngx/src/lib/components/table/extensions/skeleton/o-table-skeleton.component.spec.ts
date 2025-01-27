import { style } from '@angular/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTableSkeletonComponent } from './o-table-skeleton.component';
import { Injector } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config';
import { TestUtils } from '../../../input/test/test-utils';
import { appConfigFactory } from '../../../../services/app-config.provider';
import { AppearanceService } from '../../../../services/appearance.service';
import { AuthService } from '../../../../services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

describe('OTableSkeletonComponent', () => {
  let component: OTableSkeletonComponent;
  let fixture: ComponentFixture<OTableSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, NgxSkeletonLoaderModule],
      declarations: [OTableSkeletonComponent],
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

    fixture = TestBed.createComponent(OTableSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
});
