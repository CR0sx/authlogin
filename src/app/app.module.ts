import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { RegisterComponent } from './profile/register/register.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { PushNotificationsModule } from 'ng-push';
import { AngularFirestore } from '@angular/fire/firestore';



// import { NgWebPushModule } from 'ng-webpush';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    PushNotificationsModule,
   // NgWebPushModule.forRoot(environment.firebase)
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
