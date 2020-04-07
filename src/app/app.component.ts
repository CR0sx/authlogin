import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { PushNotificationsService } from 'ng-push';
import { MoneyService } from './service/money/money.service';
import { Money } from 'src/app/money.model';

import * as firebase from 'firebase';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
// import { MessagingService } from './messaging.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Saving App';

  selectedVal: string;
  responseMessage = '';
  responseMessageType = '';
  emailInput: string;
  passwordInput: string;
  isForgotPassword: boolean;
  userDetails: any;

  numberOfLikes = 0;
  numberOfDislikes = 0;
  data: any;
  dir: 'auto' | 'rtl' | 'ltr';

  message;

  saving: Money[];

  constructor(
    private authService: AuthenticationService,
    private pushNotifications: PushNotificationsService,
    private moneyService: MoneyService
   // private msgService: MessagingService
  ) {
    this.selectedVal = 'login';
    this.isForgotPassword = false;
    this.pushNotifications.requestPermission();
  }

  ngOnInit() {
   /* this.msgService.getPermission();
    this.msgService.receiveMessage();
    this.message = this.msgService.currentMessage;
    */

  // initiate reading data in firestore
  this.moneyService.getMoney().subscribe(data => {
    this.saving = data.map(e => {
      return {
        id: e.payload.doc.id,
          ...e.payload.doc.data()
      } as Money;
    });
  });

  }

  // Command Method to Show Message and Hide after 2 seconds
  showMessage(type, msg) {
    this.responseMessageType = type;
    this.responseMessage = msg;
    setTimeout(() => {
      this.responseMessage = '';
    }, 500);
  }

  // Called on switching Login/ Register tabs
  public onValChange(val: string) {
    this.showMessage('', '');
    this.selectedVal = val;
  }

  // Check localStorage is having User Data
  isUserLoggedIn() {
    let check = JSON.parse(localStorage.getItem('user.emailVerified'));
    // tslint:disable-next-line:no-conditional-assignment
    if (check = 'true' ) {
      this.userDetails = this.authService.isUserLoggedIn();
    } else {
      this.logoutUser();
    }
  }

  emailCheck() {
    this.authService.isUserLoggedIn().
    then(res => {
      localStorage.getItem('user.emailVerified');
    });
  }

  // SignOut Firebase Session and Clean LocalStorage
  logoutUser() {
    this.authService.logout()
      .then(res => {
        console.log(res);
        this.userDetails = undefined;
        localStorage.removeItem('user');
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Login user with  provided Email/ Password
  loginUser() {
    this.responseMessage = '';
    this.authService.login(this.emailInput, this.passwordInput)
      .then(res => {
        console.log(res);
        this.isUserLoggedIn();
        this.showMessage('success', 'Successfully Logged In!');
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Register user with  provided Email/ Password
  registerUser() {
    this.authService.register(this.emailInput, this.passwordInput)
      .then(res => {

        // Send Varification link in email
        // tslint:disable-next-line:no-shadowed-variable
        this.authService.sendEmailVerification().then(res => {
          console.log(res);
          this.isForgotPassword = false;
          this.showMessage('success', 'Registration Successful! Please Verify Your Email');
        }, err => {
          this.showMessage('danger', err.message);
        });
        this.isUserLoggedIn();


      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Send link on given email to reset password
  forgotPassword() {
    this.authService.sendPasswordResetEmail(this.emailInput)
      .then(res => {
        console.log(res);
        this.isForgotPassword = false;
        this.showMessage('success', 'Please Check Your Email');
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Open Popup to Login with Google Account and facebook
  googleLogin() {
    this.authService.loginWithGoogle()
      .then(res => {
        console.log(res);
        this.showMessage('success', 'Successfully Logged In with Google');
        this.isUserLoggedIn();
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  facebookLogin() {
    this.authService.loginWithFacebook()
      .then(res => {
        console.log(res);
        this.showMessage('success', 'Successfully Logged In with Facebook');
        this.isUserLoggedIn();
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  twitterLogin() {
    this.authService.loginWithTwitter()
      .then(res => {
        console.log(res);
        this.showMessage('success', 'Successfully Logged In with Twitter');
        this.isUserLoggedIn();
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  likeButtonClick() {
    const options = {
      body: 'like anda bertambah',
    };
    this.pushNotifications.create('Notifikasi', options).subscribe(
      res => console.log(res),
      err => console.log(err)
    );

    this.numberOfLikes++;
  }

  dislikeButtonClick() {
    const options = {
      body: 'dislike anda bertambah',
      data: {
        url : 'facebook.com'
      },
    };
    this.pushNotifications.create('notif', options).subscribe(
      res => console.log(res),
      err => console.log(err)
    );

    this.numberOfDislikes++;
  }

  create(money: Money) {
    this.moneyService.createMoney(money);
  }

  update(money: Money) {
    this.moneyService.updateMoney(money);
  }

  delete(id) {
    this.moneyService.deleteMoney(id);
  }

}

