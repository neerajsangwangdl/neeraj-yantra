import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInsertNeerajComponent } from './product-insert-neeraj.component';

describe('ProductInsertNeerajComponent', () => {
  let component: ProductInsertNeerajComponent;
  let fixture: ComponentFixture<ProductInsertNeerajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInsertNeerajComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInsertNeerajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
