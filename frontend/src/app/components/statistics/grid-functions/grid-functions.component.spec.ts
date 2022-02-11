import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFunctionsComponent } from './grid-functions.component';

describe('GridFunctionsComponent', () => {
  let component: GridFunctionsComponent;
  let fixture: ComponentFixture<GridFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridFunctionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
