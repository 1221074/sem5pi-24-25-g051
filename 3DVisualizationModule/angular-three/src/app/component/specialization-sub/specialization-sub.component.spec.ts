import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationSubComponent } from './specialization-sub.component';

describe('SpecializationSubComponent', () => {
  let component: SpecializationSubComponent;
  let fixture: ComponentFixture<SpecializationSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecializationSubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
