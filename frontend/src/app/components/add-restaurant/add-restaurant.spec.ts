import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRestaurantComponent } from './add-restaurant';

describe('AddRestaurantComponent', () => {
  let component: AddRestaurantComponent;
  let fixture: ComponentFixture<AddRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRestaurantComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRestaurantComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
