import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTankPage } from './add-tank.page';

describe('AddTankPage', () => {
  let component: AddTankPage;
  let fixture: ComponentFixture<AddTankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTankPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
