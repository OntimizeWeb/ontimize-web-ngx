import { LocalStorageService } from './../../../services/local-storage.service';
/* tslint:disable:no-unused-variable */
import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { APP_CONFIG, AppConfig } from '../../../config/app-config';
import {
  AbstractComponentStateService,
  appConfigFactory,
  AuthService,
  OntimizeAuthServiceProvider,
  OntimizeService,
  OntimizeServiceResponseAdapter,
  PermissionsService
} from '../../../services';
import { TestUtils } from '../../input/test/test-utils';
import { OTreeDao } from '../o-tree-dao.service';
import { OTreeNodeComponent } from './tree-node.component';


describe('OTreeNodeComponent', () => {
  let component: OTreeNodeComponent;
  let fixture: ComponentFixture<OTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OTreeNodeComponent],
      imports: [MatDialogModule, RouterModule.forRoot([]), HttpClientModule],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateService,
          deps: [Injector]
        },
        OntimizeService,
        OntimizeServiceResponseAdapter,
        OTreeDao,
        AuthService,
        OntimizeAuthServiceProvider,
        AbstractComponentStateService,
        PermissionsService,
        LocalStorageService,
        { provide: APP_CONFIG, useValue: TestUtils.mockConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
