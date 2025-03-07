import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphReportAreaComponent } from './graph-report-area.component';

describe('GraphReportAreaComponent', () => {
  let component: GraphReportAreaComponent;
  let fixture: ComponentFixture<GraphReportAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphReportAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphReportAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
