import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CubeComponent } from './cube.component';
import { ElementRef } from '@angular/core';

describe('CubeComponent', () => {
  let component: CubeComponent;
  let fixture: ComponentFixture<CubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CubeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CubeComponent);
    component = fixture.componentInstance;

    // Mock the canvas element
    component.canvasRef = new ElementRef(document.createElement('canvas'));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and render the cube', () => {
    spyOn(component as any, 'createScene').and.callThrough();
    spyOn(component as any, 'render').and.callThrough();

    fixture.detectChanges(); // Trigger lifecycle hooks

    expect((component as any).createScene).toHaveBeenCalled();
    expect((component as any).render).toHaveBeenCalled();
  });
});
