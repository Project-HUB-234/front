import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangeCatgoriesComponent } from './mange-catgories.component';

describe('MangeCatgoriesComponent', () => {
  let component: MangeCatgoriesComponent;
  let fixture: ComponentFixture<MangeCatgoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MangeCatgoriesComponent]
    });
    fixture = TestBed.createComponent(MangeCatgoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
