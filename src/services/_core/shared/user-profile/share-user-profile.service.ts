import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserProfile} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareUserProfileService {
  public currentUserProfile: Observable<UserProfile>;
  private currentUserProfileService: BehaviorSubject<UserProfile>;

  constructor() {
    this.currentUserProfileService = new BehaviorSubject<UserProfile>(null);
    this.currentUserProfile = this.currentUserProfileService.asObservable();
  }

  public changeUserProfile(userProfile: UserProfile) {
    this.currentUserProfileService.next(userProfile);
  }
}
