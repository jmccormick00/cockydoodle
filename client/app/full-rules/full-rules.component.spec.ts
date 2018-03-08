import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullRulesComponent } from './full-rules.component';

describe('FullRulesComponent', () => {
  let component: FullRulesComponent;
  let fixture: ComponentFixture<FullRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
