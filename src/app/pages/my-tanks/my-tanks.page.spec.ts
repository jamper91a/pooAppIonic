import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyTanksPage } from './my-tanks.page';

describe('MyTanksPage', () => {
  let component: MyTanksPage;
  let fixture: ComponentFixture<MyTanksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTanksPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyTanksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
