import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Api, Util} from './providers/providers';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Api,
    Util,
    HttpClientModule,
    HttpClient,
    Geolocation,
    BackgroundGeolocation,
    LocalNotifications

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
