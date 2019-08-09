import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Coffeti} from '@gw-models/core';

@Component({
  selector: 'app-alert-verify-email',
  templateUrl: './alert-verify-email.component.html',
  styleUrls: ['./alert-verify-email.component.css']
})
export class AlertVerifyEmailComponent implements OnInit {

  // background image
  backgroundImage: string;

  // coffeti interval to show coffeti animation after every one second
  coffetiInterval: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.backgroundImage = './assets/images/rest.jpg';
    // create coffeti object
    const coffeti = new Coffeti();
    // show coffeti animation after every one second
    this.coffetiInterval = setInterval(() => {
      coffeti.shoot();
    }, 1000);
  }

  /**
   * go to login
   */
  public goToLogin() {
    // redirect to login page
    this.router.navigate(['/login']);
    // clear coffeti interval
    clearInterval(this.coffetiInterval);
  }

}
