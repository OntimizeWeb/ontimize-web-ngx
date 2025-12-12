import { TestBed } from "@angular/core/testing";
import { OntimizeAuthService } from "./o-auth.service";
import { OTestingUtils } from "../shared/testing/o-testing-utils";
import { Codes } from "../util/codes";

describe("OntimizeAuthService", () => {
  let service: OntimizeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: OTestingUtils.getCommonTestingModuleConfig().imports,
      providers: [
        OntimizeAuthService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });

    // Mock localStorage with a valid session
    const mockSessionInfo = {
      user: 'testUser',
      id: '12345'
    };
    const storedData = {};
    storedData[Codes.SESSION_KEY] = mockSessionInfo;
    
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedData));
    
    service = TestBed.inject(OntimizeAuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should be instance of OntimizeAuthService", () => {
    expect(service).toBeInstanceOf(OntimizeAuthService);
  });

  it("should have expected methods", () => {
    expect(typeof service.login).toBe("function");
    expect(typeof service.logout).toBe("function");
    expect(typeof service.isLoggedIn).toBe("function");
    expect(typeof service.getSessionInfo).toBe("function");
    expect(typeof service.storeSessionInfo).toBe("function");
    expect(typeof service.clearSessionData).toBe("function");
  });

  it("should return user property", () => {
    const user = service.user;
    expect(user).toBeDefined();
  });

  it("should return localStorageKey property", () => {
    const key = service.localStorageKey;
    expect(key).toBeDefined();
  });
});
