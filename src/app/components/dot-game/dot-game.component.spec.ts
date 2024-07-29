import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotGameComponent } from './dot-game.component';

describe('DotGameComponent', () => {
  let component: DotGameComponent;
  let fixture: ComponentFixture<DotGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
