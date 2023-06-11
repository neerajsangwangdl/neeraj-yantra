import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInsertTraineeComponent } from './product-insert-trainee.component';

describe('ProductInsertTraineeComponent', () => {
  let component: ProductInsertTraineeComponent;
  let fixture: ComponentFixture<ProductInsertTraineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInsertTraineeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInsertTraineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
