import {Coffeti, ResponseMessage, UserAccount} from '@gw-models/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveAccountService} from '@gw-services/core/api/user/active-account.service';
import {Component, OnInit} from '@angular/core';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-active-account',
  templateUrl: './active-account.component.html',
  styleUrls: ['./active-account.component.css']
})
export class ActiveAccountComponent implements OnInit {
  isLoadingSpinnerShown = true;
  isActivated = false;
  emailConfirmationToken: string;
  backgroundImage: string;
  coffetiAnimationInterval: any;

  /**
   *
   * @param activeAccountService - inject activeAccountService
   * @param route - inject route
   * @param router - inject router
   */
  constructor(private activeAccountService: ActiveAccountService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.backgroundImage = './assets/images/rest.jpg';
    this.emailConfirmationToken = this.route.snapshot.queryParams['token'] || '';
    if (this.emailConfirmationToken.localeCompare('') === 0) {
      this.router.navigate(['/login']);
    } else {
      this.activeUserAccount();
    }
  }

  /**
   * active user-account's account
   */
  activeUserAccount(): void {
    const updatedUserAccount = new UserAccount();
    updatedUserAccount.emailConfirmationToken = this.emailConfirmationToken;
    const activeUserAccountUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiActiveUserAccount}`;
    this.activeAccountService.activeAccount(activeUserAccountUrl, updatedUserAccount)
      .subscribe((responseMessage: ResponseMessage) => {
        this.isActivated = responseMessage.message.localeCompare('successfully') === 0;
        if (this.isActivated) {
          this.showCoffetiAnimation();
        }
        this.isLoadingSpinnerShown = false;
      });
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
   * go to login page
   */
  public goToLogin(): void {
    clearInterval(this.coffetiAnimationInterval);
    this.router.navigate(['/login']);
  }
}
