import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPopup } from './three-js-popup';

describe('ThreeJsPopup', () => {
  let component: ThreeJsPopup;
  let fixture: ComponentFixture<ThreeJsPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeJsPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(ThreeJsPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
