import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ParameterComponent } from './parameter.component';

describe('ParameterComponent', () => {
  let component: ParameterComponent;
  let fixture: ComponentFixture<ParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ParameterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.parameterForm.value).toEqual({
      betA: 3,
      betB: 3,
      maxGameLength: 1000,
      numberOfGames: 100
    });
  });

  it('should enable Start button when form is valid', () => {
    component.parameterForm.setValue({
      betA: 5,
      betB: 5,
      maxGameLength: 500,
      numberOfGames: 50
    });
    fixture.detectChanges();
    const startButton = fixture.nativeElement.querySelector('button:first-of-type');
    expect(startButton.disabled).toBeFalse();
  });

  it('should disable Start button when form is invalid', () => {
    component.parameterForm.setValue({
      betA: 0,
      betB: 5,
      maxGameLength: 500,
      numberOfGames: 50
    });
    fixture.detectChanges();
    const startButton = fixture.nativeElement.querySelector('button:first-of-type');
    expect(startButton.disabled).toBeTrue();
  });

  it('should enable Stop button when simulation is running', () => {
    component.startSimulation();
    fixture.detectChanges();
    const stopButton = fixture.nativeElement.querySelector('button:last-of-type');
    expect(stopButton.disabled).toBeFalse();
  });

  it('should disable Stop button when simulation is not running', () => {
    const stopButton = fixture.nativeElement.querySelector('button:last-of-type');
    expect(stopButton.disabled).toBeTrue();
  });
});