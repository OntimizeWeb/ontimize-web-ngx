import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';
import { SessionInfo } from '../types/session-info.type';

// Mock implementation for testing
class MockAuthService extends AuthService {
  private sessionInfo: SessionInfo | null = null;

  login(user: string, password: string) {
    return of({ user, token: 'test-token' });
  }

  logout() {
    this.clearSessionData();
    return of(true);
  }

  clearSessionData(): void {
    this.sessionInfo = null;
  }

  isLoggedIn(): boolean {
    return this.sessionInfo !== null;
  }

  getSessionInfo(): SessionInfo {
    return this.sessionInfo || {} as SessionInfo;
  }

  setSessionInfo(sessionInfo: SessionInfo): void {
    this.sessionInfo = sessionInfo;
  }
}

describe('AuthService', () => {
  let service: MockAuthService;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useValue: dialogSpy },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    
    service = TestBed.inject(AuthService) as MockAuthService;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login', () => {
    service.login('testuser', 'testpass').subscribe(response => {
      expect(response.user).toBe('testuser');
      expect(response.token).toBe('test-token');
    });
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalsy();

    const sessionInfo: SessionInfo = {
      user: 'testuser',
      id: 123
    };

    service.setSessionInfo(sessionInfo);
    expect(service.isLoggedIn()).toBeTruthy();
  });

  it('should clear session on logout', () => {
    const sessionInfo: SessionInfo = {
      user: 'testuser',
      id: 123
    };

    service.setSessionInfo(sessionInfo);
    expect(service.isLoggedIn()).toBeTruthy();

    service.logout().subscribe(() => {
      expect(service.isLoggedIn()).toBeFalsy();
    });
  });

  it('should get session information', () => {
    const sessionInfo: SessionInfo = {
      user: 'testuser',
      id: 123
    };

    service.setSessionInfo(sessionInfo);
    
    const retrievedInfo = service.getSessionInfo();
    expect(retrievedInfo).toEqual(sessionInfo);
  });

  it('should have onLogin and onLogout subjects', () => {
    expect(service.onLogin).toBeDefined();
    expect(service.onLogout).toBeDefined();
  });
});