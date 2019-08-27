import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccount, UserProfile } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareUserProfileService {
  private currentUserProfileService: BehaviorSubject<UserProfile>;
  public currentUserProfile: Observable<UserProfile>;

  constructor() {
    this.currentUserProfileService = new BehaviorSubject<UserProfile>(null);
    this.currentUserProfile = this.currentUserProfileService.asObservable();
  }

  public changeUserProfile(userProfile: UserProfile) {
    this.currentUserProfileService.next(userProfile);
  }
}
