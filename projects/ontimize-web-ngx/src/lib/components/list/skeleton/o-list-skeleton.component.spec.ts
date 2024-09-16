import { AppearanceService } from '../../../services/appearance.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OListSkeletonComponent } from './o-list-skeleton.component';
import { Injector } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../../config/app-config';
import { appConfigFactory, LocalStorageService } from '../../../services';
import { TestUtils } from '../../input/test/test-utils';
import { AuthService } from '../../../services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
describe('OListSkeletonComponent', () => {
  let component: OListSkeletonComponent;
  let fixture: ComponentFixture<OListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, NgxSkeletonLoaderModule],
      declarations: [OListSkeletonComponent],
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

    fixture = TestBed.createComponent(OListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
