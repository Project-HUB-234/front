import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangeContactComponent } from './mange-contact.component';

describe('MangeContactComponent', () => {
  let component: MangeContactComponent;
  let fixture: ComponentFixture<MangeContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MangeContactComponent]
    });
    fixture = TestBed.createComponent(MangeContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
