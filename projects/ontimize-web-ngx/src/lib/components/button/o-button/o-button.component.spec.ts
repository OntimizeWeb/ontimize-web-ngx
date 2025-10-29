import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { OButtonComponent } from '../o-button.component';
import { OTestingUtils } from '../../../../../shared/testing/o-testing-utils';

describe('OButtonComponent', () => {
  let component: OButtonComponent;
  let fixture: ComponentFixture<OButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OButtonComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: OTestingUtils.getCommonTestingModuleConfig().providers
    }).compileComponents();

    fixture = TestBed.createComponent(OButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button with label', () => {
    component.olabel = 'Test Button';
    fixture.detectChanges();
    
    const buttonElement = OTestingUtils.getElement<HTMLButtonElement>(fixture, 'button');
    expect(buttonElement.textContent?.trim()).toContain('Test Button');
  });

  it('should be disabled when enabled is false', () => {
    component.enabled = false;
    fixture.detectChanges();
    
    const buttonElement = OTestingUtils.getElement<HTMLButtonElement>(fixture, 'button');
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should emit onClick event when clicked', () => {
    spyOn(component.onClick, 'emit');
    
    const buttonElement = OTestingUtils.getElement<HTMLButtonElement>(fixture, 'button');
    buttonElement.click();
    
    expect(component.onClick.emit).toHaveBeenCalled();
  });

  it('should handle icon correctly', () => {
    component.icon = 'home';
    fixture.detectChanges();
    
    const iconElement = OTestingUtils.getElement(fixture, 'mat-icon');
    expect(iconElement).toBeTruthy();
    expect(iconElement.textContent?.trim()).toBe('home');
  });

  it('should apply correct color theme', () => {
    component.color = 'primary';
    fixture.detectChanges();
    
    const buttonElement = OTestingUtils.getElement<HTMLButtonElement>(fixture, 'button');
    expect(buttonElement.classList.toString()).toContain('primary');
  });

  it('should handle icon position classes', () => {
    component.iconPosition = 'top';
    fixture.detectChanges();
    
    const hostElement = fixture.debugElement.nativeElement;
    expect(hostElement.classList.contains('o-button-icon-position-top')).toBeTruthy();
  });
});