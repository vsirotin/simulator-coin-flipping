import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphReportColumnComponent } from './graph-report-column.component';

describe('GraphReportColumnComponent', () => {
  let component: GraphReportColumnComponent;
  let fixture: ComponentFixture<GraphReportColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphReportColumnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphReportColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
