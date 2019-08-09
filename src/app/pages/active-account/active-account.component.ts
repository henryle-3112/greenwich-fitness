import {Coffeti, ResponseMessage, UserAccount} from '@gw-models/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveAccountService} from '@gw-services/core/api/user/active-account.service';
import {Component, OnInit} from '@angular/core';
import {BodyIndexService} from '@gw-services/core/api/user/body-index.service';

@Component({
  selector: 'app-active-account',
  templateUrl: './active-account.component.html',
  styleUrls: ['./active-account.component.css']
})
export class ActiveAccountComponent implements OnInit {

  // check loading component is showing or not
  loading = true;
  // show message - account is activated or not
  isActivated = false;
  // get email confirmation token
  emailConfirmationToken: string;

  // background image
  backgroundImage: string;

  // coffeti interval to show coffeti animation
  coffetiInterval: any;

  /**
   *
   * @param activeAccountService - inject active account service to active account
   * @param route - inject route to get url parameter
   * @param router - inject router for routing
   */
  constructor(private activeAccountService: ActiveAccountService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    this.backgroundImage = './assets/images/rest.jpg';

    // get emailConfirmationToken from route parameters.
    this.emailConfirmationToken = this.route.snapshot.queryParams['token'] || '';
    // if password reminder token does not existed. Therefore, password cannot be changed
    // customers will be redirected to login page
    if (this.emailConfirmationToken.localeCompare('') === 0) {
      // redirect to login page
      this.router.navigate(['/login']);
    } else {
      // active user-account's account
      this.activeUserAccount();
    }
  }

  /**
   * active user-account's account
   */
  activeUserAccount(): void {
    // create updated user-account's account
    const updatedUserAccount = new UserAccount();
    // set email confirmation token
    updatedUserAccount.emailConfirmationToken = this.emailConfirmationToken;
    // call active account service to active user-account's account
    this.activeAccountService.activeAccount(updatedUserAccount)
      .subscribe((responseMessage: ResponseMessage) => {
        // show response message - user-account's account is activated or not
        this.isActivated = responseMessage.message.localeCompare('successfully') === 0;
        if (this.isActivated) {
          // create coffeti object
          const coffeti = new Coffeti();
          // show coffeti animation after every one second
          this.coffetiInterval = setInterval(() => {
            coffeti.shoot();
          }, 1000);
        }
        this.loading = false;
      });
  }

  /**
   * go to login page
   */
  public goToLogin() {
    // clear coffeti interval
    clearInterval(this.coffetiInterval);
    // redirect to login page
    this.router.navigate(['/login']);
  }
}
