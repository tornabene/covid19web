import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTamponeComponent } from './form-tampone.component';

describe('FormTamponeComponent', () => {
  let component: FormTamponeComponent;
  let fixture: ComponentFixture<FormTamponeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTamponeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTamponeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
