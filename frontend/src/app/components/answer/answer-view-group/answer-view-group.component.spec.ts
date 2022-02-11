import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerViewGroupComponent } from './answer-view-group.component';

describe('AnswerViewGroupComponent', () => {
  let component: AnswerViewGroupComponent;
  let fixture: ComponentFixture<AnswerViewGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerViewGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerViewGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
