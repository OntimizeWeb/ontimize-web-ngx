import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { DialogService } from './dialog.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';
import { ODialogComponent } from '../shared/components/dialog/o-dialog.component';
import { ODialogBase } from '../shared/components/dialog/o-dialog-base.class';

describe('DialogService', () => {
  let service: DialogService;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ODialogBase>>;
  let mockDialogComponent: jasmine.SpyObj<ODialogBase>;

  beforeEach(() => {
    // Create spies for MatDialog and MatDialogRef
    mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.componentInstance = mockDialogComponent;
    
    // Use Subject instead of of() to allow async completion
    const afterClosedSubject = new Subject<any>();
    mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
    // Emit value after a microtask to ensure dialog methods are called first
    Promise.resolve().then(() => afterClosedSubject.next(true));

    matDialog = jasmine.createSpyObj('MatDialog', ['open']);
    matDialog.open.and.returnValue(mockDialogRef);

    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        DialogService,
        { provide: MatDialog, useValue: matDialog },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(DialogService);
  });

  afterEach(() => {
    // Reset all spies after each test
    if (mockDialogComponent) {
      mockDialogComponent.alert.calls.reset();
      mockDialogComponent.info.calls.reset();
      mockDialogComponent.warn.calls.reset();
      mockDialogComponent.error.calls.reset();
      mockDialogComponent.confirm.calls.reset();
    }
    if (matDialog) {
      matDialog.open.calls.reset();
    }
    if (mockDialogRef) {
      mockDialogRef.afterClosed.calls.reset();
    }
    // Clean up dialog ref after each test
    if (service && service.dialogRef) {
      service.dialogRef = null;
    }
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be instance of DialogService', () => {
      expect(service).toBeInstanceOf(DialogService);
    });

    it('should have MatDialog injected', () => {
      expect(service['ng2Dialog']).toBeTruthy();
    });

    it('should have expected methods', () => {
      expect(typeof service.alert).toBe('function');
      expect(typeof service.info).toBe('function');
      expect(typeof service.warn).toBe('function');
      expect(typeof service.error).toBe('function');
      expect(typeof service.confirm).toBe('function');
    });
  });

  describe('dialog getter', () => {
    it('should return dialog component instance when dialogRef exists', () => {
      service.dialogRef = mockDialogRef;
      expect(service.dialog).toBe(mockDialogComponent);
    });

    it('should return undefined when dialogRef is null', () => {
      service.dialogRef = null;
      expect(service.dialog).toBeUndefined();
    });

    it('should return undefined when dialogRef is undefined', () => {
      service.dialogRef = undefined;
      expect(service.dialog).toBeUndefined();
    });
  });

  describe('alert method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should open dialog and call alert on component', async () => {
      const title = 'Alert Title';
      const message = 'Alert Message';
      const config = { okButtonText: 'OK', icon: 'info' };

      const promise = service.alert(title, message, config);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.alert).toHaveBeenCalledWith(title, message, config);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      await promise;
      expect(service.dialogRef).toBeNull();
    });

    it('should handle alert without config', async () => {
      const title = 'Alert Title';
      const message = 'Alert Message';

      const promise = service.alert(title, message);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.alert).toHaveBeenCalledWith(title, message, undefined);
      
      await promise;
    });

    it('should return false when dialog is closed without result', async () => {
      mockDialogRef.afterClosed.and.returnValue(of(undefined));
      
      const result = await service.alert('Title', 'Message');
      expect(result).toBe(false);
    });

    it('should return actual result when dialog is closed with result', async () => {
      mockDialogRef.afterClosed.and.returnValue(of('test-result'));
      
      const result = await service.alert('Title', 'Message');
      expect(result).toBe('test-result');
    });
  });

  describe('info method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should open dialog and call info on component', async () => {
      const title = 'Info Title';
      const message = 'Info Message';
      const config = { alertType: 'info' as const, okButtonText: 'Got it' };

      const promise = service.info(title, message, config);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.info).toHaveBeenCalledWith(title, message, config);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      await promise;
      expect(service.dialogRef).toBeNull();
    });

    it('should handle info without config', async () => {
      const title = 'Info Title';
      const message = 'Info Message';

      const promise = service.info(title, message);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.info).toHaveBeenCalledWith(title, message, undefined);
      
      await promise;
    });
  });

  describe('warn method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should open dialog and call warn on component', async () => {
      const title = 'Warning Title';
      const message = 'Warning Message';
      const config = { alertType: 'warn' as const, icon: 'warning' };

      const promise = service.warn(title, message, config);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.warn).toHaveBeenCalledWith(title, message, config);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      await promise;
      expect(service.dialogRef).toBeNull();
    });

    it('should handle warn without config', async () => {
      const title = 'Warning Title';
      const message = 'Warning Message';

      const promise = service.warn(title, message);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.warn).toHaveBeenCalledWith(title, message, undefined);
      
      await promise;
    });
  });

  describe('error method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should open dialog and call error on component', async () => {
      const title = 'Error Title';
      const message = 'Error Message';
      const config = { alertType: 'error' as const, okButtonText: 'Close' };

      const promise = service.error(title, message, config);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.error).toHaveBeenCalledWith(title, message, config);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      await promise;
      expect(service.dialogRef).toBeNull();
    });

    it('should handle error without config', async () => {
      const title = 'Error Title';
      const message = 'Error Message';

      const promise = service.error(title, message);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.error).toHaveBeenCalledWith(title, message, undefined);
      
      await promise;
    });
  });

  describe('confirm method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should open dialog and call confirm on component', async () => {
      const title = 'Confirm Title';
      const message = 'Confirm Message';
      const config = { okButtonText: 'Yes', cancelButtonText: 'No' };

      const promise = service.confirm(title, message, config);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.confirm).toHaveBeenCalledWith(title, message, config);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      await promise;
      expect(service.dialogRef).toBeNull();
    });

    it('should handle confirm without config', async () => {
      const title = 'Confirm Title';
      const message = 'Confirm Message';

      const promise = service.confirm(title, message);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.confirm).toHaveBeenCalledWith(title, message, undefined);
      
      await promise;
    });

    it('should return confirmation result', async () => {
      mockDialogRef.afterClosed.and.returnValue(of(true));
      
      const result = await service.confirm('Title', 'Message');
      expect(result).toBe(true);
    });

    it('should return false for cancel', async () => {
      mockDialogRef.afterClosed.and.returnValue(of(false));
      
      const result = await service.confirm('Title', 'Message');
      expect(result).toBe(false);
    });
  });

  describe('openDialog method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should configure dialog with correct parameters', () => {
      const mockObserver = { next: jasmine.createSpy(), complete: jasmine.createSpy() };
      
      service['openDialog'](mockObserver);
      
      expect(matDialog.open).toHaveBeenCalledWith(ODialogComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(service.dialogRef).toBe(mockDialogRef);
    });

    it('should handle dialog close with result', () => {
      const mockObserver = { next: jasmine.createSpy(), complete: jasmine.createSpy() };
      const testResult = 'test-result';
      mockDialogRef.afterClosed.and.returnValue(of(testResult));
      
      service['openDialog'](mockObserver);
      
      expect(mockObserver.next).toHaveBeenCalledWith(testResult);
      expect(mockObserver.complete).toHaveBeenCalled();
      expect(service.dialogRef).toBeNull();
    });

    it('should handle dialog close without result (convert undefined to false)', () => {
      const mockObserver = { next: jasmine.createSpy(), complete: jasmine.createSpy() };
      mockDialogRef.afterClosed.and.returnValue(of(undefined));
      
      service['openDialog'](mockObserver);
      
      expect(mockObserver.next).toHaveBeenCalledWith(false);
      expect(mockObserver.complete).toHaveBeenCalled();
      expect(service.dialogRef).toBeNull();
    });
  });

  describe('Integration tests', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogBase', ['alert', 'info', 'warn', 'error', 'confirm']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should handle multiple sequential dialogs', async () => {
      // First dialog
      const result1 = service.alert('Title 1', 'Message 1');
      expect(service.dialogRef).toBeTruthy();
      await result1;
      expect(service.dialogRef).toBeNull();

      // Reset mock for second call
      matDialog.open.calls.reset();
      const secondDialogSubject = new Subject<boolean>();
      mockDialogRef.afterClosed.and.returnValue(secondDialogSubject.asObservable());
      Promise.resolve().then(() => secondDialogSubject.next(false));

      // Second dialog
      const result2 = service.confirm('Title 2', 'Message 2');
      expect(service.dialogRef).toBeTruthy();
      const confirmed = await result2;
      expect(confirmed).toBe(false);
      expect(service.dialogRef).toBeNull();
    });

    it('should handle empty strings', async () => {
      await service.info('', '');
      expect(mockDialogComponent.info).toHaveBeenCalledWith('', '', undefined);
    });

    it('should handle special characters in title and message', async () => {
      const specialTitle = 'Title with <html> & special chars éñü';
      const specialMessage = 'Message with\nnewlines\tand\ttabs';
      
      await service.error(specialTitle, specialMessage);
      expect(mockDialogComponent.error).toHaveBeenCalledWith(specialTitle, specialMessage, undefined);
    });
  });
});
