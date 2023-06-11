import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextOrderComponent } from './next-order.component';

describe('NextOrderComponent', () => {
  let component: NextOrderComponent;
  let fixture: ComponentFixture<NextOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
