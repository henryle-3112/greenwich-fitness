import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coffeti } from '@gw-models/core';

@Component({
  selector: 'app-alert-verify-email',
  templateUrl: './alert-verify-email.component.html',
  styleUrls: ['./alert-verify-email.component.css']
})
export class AlertVerifyEmailComponent implements OnInit {

  backgroundImage: string;
  coffetiAnimationInterval: any;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.backgroundImage = './assets/images/rest.jpg';
    this.showCoffetiAnimation();
  }

  /**
   * show coffeti animation
   */
  private showCoffetiAnimation(): void {
    const coffeti = new Coffeti();
    this.coffetiAnimationInterval = setInterval(() => {
      coffeti.shoot();
    }, 1000);
  }

  /**
   * go to login
   */
  public goToLogin(): void {
    clearInterval(this.coffetiAnimationInterval);
    this.router.navigate(['/login']);
  }

}
