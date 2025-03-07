import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphReportPieComponent } from './graph-report-pie.component';

describe('GraphReportPieComponent', () => {
  let component: GraphReportPieComponent;
  let fixture: ComponentFixture<GraphReportPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphReportPieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphReportPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
