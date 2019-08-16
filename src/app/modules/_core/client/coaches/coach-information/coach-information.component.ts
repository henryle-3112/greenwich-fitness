import {Component, OnInit} from '@angular/core';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {
  Coach,
  CoachFeedback,
  CoachFeedbackReaction, CoachMembershipNotification,
  CoachRate, Membership,
  ReplyOnCoachFeedback,
  ReplyOnCoachFeedbackReaction,
  UserProfile
} from '@gw-models/core';
import {MembershipService} from '@gw-services/core/api/coach/membership.service';
import {Router} from '@angular/router';
import {CoachRateService} from '@gw-services/core/api/coach/coach-rate.service';
import {CoachFeedbackService} from '@gw-services/core/api/coach/coach-feedback.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {ReplyOnCoachFeedbackService} from '@gw-services/core/api/coach/reply-on-coach-feedback.service';
import {CoachFeedbackReactionService} from '@gw-services/core/api/coach/coach-feedback-reaction.service';
import {ReplyOnCoachFeedbackReactionService} from '@gw-services/core/api/coach/reply-on-coach-feedback-reaction.service';
import {CoachMembershipNotificationService} from '@gw-services/core/api/notification/coach-membership-notification.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-coach-information',
  templateUrl: './coach-information.component.html',
  styleUrls: ['./coach-information.component.css']
})
export class CoachInformationComponent implements OnInit {
  isLoadingSpinnerShown: boolean;
  selectedCoach: Coach;
  isCoachReviewFromShown: boolean;
  coachFeedbacks: CoachFeedback[];
  coachFeedbacksTemp: CoachFeedback[];
  coachFeedbacksPerPage: CoachFeedback[];
  currentCoachFeedbacksPage: number;
  nCoachFeedbacksPerPage: number;
  totalCoachFeedbacks: number;
  selectedCoachRateValue: number;
  coachReviewContent: string;
  selectedUserProfile: UserProfile;
  isHireCoachRequestSent: boolean;
  selectedMembership: Membership;
  isRelationshipBetweenUserAndCoachExixted: boolean;

  /**
   *
   * @param shareCoachService - inject shareCoachService
   * @param membershipService - inject membershipService
   * @param coachRateService - inject coachRateService
   * @param coachFeedbackService - inject coachFeedbackService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param replyOnCoachFeedbackService - inject replyOnCoachFeedbackService
   * @param coachFeedbackReactionService - inject coachFeedbackReactionService
   * @param replyOnCoachFeedbackReactionService - inject replyOnCoachFeedbackReactionService
   * @param router - inject router
   * @param coachMembershipNotificationService - inject coachMembershipNotificationService
   * @param notification - inject notification
   */
  constructor(private shareCoachService: ShareCoachService,
              private membershipService: MembershipService,
              private coachRateService: CoachRateService,
              private coachFeedbackService: CoachFeedbackService,
              private replyOnCoachFeedbackService: ReplyOnCoachFeedbackService,
              private coachFeedbackReactionService: CoachFeedbackReactionService,
              private replyOnCoachFeedbackReactionService: ReplyOnCoachFeedbackReactionService,
              private shareUserProfileService: ShareUserProfileService,
              private router: Router,
              private coachMembershipNotificationService: CoachMembershipNotificationService,
              private notification: NzNotificationService) {
  }

  ngOnInit() {
    this.initData();
    this.getSelectedUserProfile();
    this.getSelectedCoach();
  }

  /**
   * init data
   */
  private initData() {
    this.currentCoachFeedbacksPage = Config.currentPage;
    this.nCoachFeedbacksPerPage = Config.numberItemsPerPage;
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * toggle add review form
   */
  public toggleAddReviewForm() {
    this.isCoachReviewFromShown = !this.isCoachReviewFromShown;
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    this.isLoadingSpinnerShown = true;
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getSelectedMembership();
          this.getCoachFeedbacksByCoach();
          this.getCoachRateByUser();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get selected membership
   */
  private getSelectedMembership() {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const getMembershipUrl = `${Config.apiBaseUrl}/
${Config.apiMembershipManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}/
${selectedCoachId}/
${Config.apiMemberships}`;
    this.membershipService.getMembership(getMembershipUrl)
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
          this.isRelationshipBetweenUserAndCoachExixted = this.selectedMembership.status === 1;
          this.checkUserSentRequestToCoach();
        } else {
          this.isRelationshipBetweenUserAndCoachExixted = false;
          this.checkUserSentRequestToCoach();
        }
      });
  }

  /**
   * check user sent request to coach or not
   */
  private checkUserSentRequestToCoach() {
    this.isLoadingSpinnerShown = true;
    const selectedCoachId = this.selectedCoach.id;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const notificationStatus = 0;
    const getCoachMembershipNotificationUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiCoaches}/
${selectedCoachId}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoachMembershipNotifications}?
${Config.statusParameter}=${notificationStatus}`;
    this.coachMembershipNotificationService.getCoachMembershipNotification(getCoachMembershipNotificationUrl)
      .subscribe((selectedCoachMembershipNotification: CoachMembershipNotification) => {
        this.isHireCoachRequestSent = !!selectedCoachMembershipNotification;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected's coach rate
   */
  private getCoachRateByUser() {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const getCoachRateUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}/
${selectedCoachId}/
${Config.apiCoachRates}`;
    this.coachRateService.getCoachRate(getCoachRateUrl)
      .subscribe((selectedCoachRate: CoachRate) => {
        if (selectedCoachRate) {
          this.selectedCoachRateValue = selectedCoachRate.rate;
        } else {
          this.selectedCoachRateValue = 0;
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - selected rate
   */
  public onRateChanged(event) {
    this.selectedCoachRateValue = event;
  }

  /**
   * get coach's feedbacks by coach
   */
  private getCoachFeedbacksByCoach() {
    this.isLoadingSpinnerShown = true;
    const selectedCoachId = this.selectedCoach.id;
    const coachFeedbackStatus = 1;
    const getCoachFeedbacksUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiCoachFeedbacks}?
${Config.coachIdParameter}=${selectedCoachId}&
${Config.statusParameter}=${coachFeedbackStatus}`;
    this.coachFeedbackService.getCoachFeedbacks(getCoachFeedbacksUrl)
      .subscribe(coachFeedbacks => {
        if (coachFeedbacks) {
          if (coachFeedbacks.length > 0) {
            this.coachFeedbacks = coachFeedbacks;
            this.coachFeedbacksTemp = coachFeedbacks;
            this.totalCoachFeedbacks = this.coachFeedbacksTemp.length;
            this.getCoachFeedbacksPerPage();
          } else {
            this.coachFeedbacks = [];
            this.coachFeedbacksTemp = [];
            this.totalCoachFeedbacks = 0;
            this.coachFeedbacksPerPage = [];
          }
          this.isLoadingSpinnerShown = false;
        }
      });
  }

  /**
   *
   * @param event - current's page
   */
  public coachFeedbacksPageChange(event) {
    this.currentCoachFeedbacksPage = event;
    this.isLoadingSpinnerShown = true;
    this.getCoachFeedbacksPerPage();
  }

  /**
   * load coach's feedbacks per page
   */
  private getCoachFeedbacksPerPage() {
    const startIndex = ((this.currentCoachFeedbacksPage - 1) * 8) + 1;
    this.coachFeedbacksPerPage = this.coachFeedbacksTemp.slice(startIndex - 1, startIndex + 7);
    this.isLoadingSpinnerShown = false;
    this.getCoachFeedbackReactionsByUser();
  }

  /**
   * load coach's feedback that user liked and disliked
   */
  private getCoachFeedbackReactionsByUser() {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getCoachFeedbackReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoachFeedbackReactions}`;
    this.coachFeedbackReactionService.getCoachFeedbackReactions(getCoachFeedbackReactionsUrl)
      .subscribe((coachFeedbackReactions: CoachFeedbackReaction[]) => {
        if (coachFeedbackReactions) {
          this.showCoachFeedbacksUserLikedDisliked(coachFeedbackReactions);
        }
      });
  }

  /**
   *
   * @param coachFeedbackReactions - coach's feedbacks that user liked and disliked
   */
  private showCoachFeedbacksUserLikedDisliked(coachFeedbackReactions: CoachFeedbackReaction[]) {
    for (const eachCoachFeedbackReaction of coachFeedbackReactions) {
      for (const eachCoachFeedback of this.coachFeedbacksPerPage) {
        if (eachCoachFeedbackReaction.coachFeedback.id === eachCoachFeedback.id) {
          this.changeCoachFeedbackReactionStatus(eachCoachFeedback, eachCoachFeedbackReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedCoachFeedback - coach's feedback that will be set reaction's value
   * @param selectedCoachFeedbackReaction - reactions's value that will be set to selected coach's feedback
   */
  private changeCoachFeedbackReactionStatus(selectedCoachFeedback: CoachFeedback, selectedCoachFeedbackReaction: CoachFeedbackReaction) {
    selectedCoachFeedback.isReacted = true;
    if (selectedCoachFeedbackReaction.reaction === 1) {
      selectedCoachFeedback.isLikeClicked = true;
    } else if (selectedCoachFeedbackReaction.reaction === 0) {
      selectedCoachFeedback.isLikeClicked = false;
    }
  }

  /**
   * add coach's feedback for selected coach
   */
  public addCoachReview() {
    this.addCoachFeedback();
    this.addCoachRate();
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string) {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   * add coach's feedback
   */
  private addCoachFeedback() {
    if (this.coachReviewContent.localeCompare('') === 0) {
      this.createNotification('error', 'Error', 'Please input your review\'s content');
    } else {
      const coachFeedback = new CoachFeedback();
      coachFeedback.coachFeedbackContent = this.coachReviewContent;
      coachFeedback.coachFeedbackCreatedDate = new Date();
      coachFeedback.coachFeedbackStatus = 1;
      coachFeedback.coach = this.selectedCoach;
      coachFeedback.userProfile = this.selectedUserProfile;
      coachFeedback.numberOfLikes = 0;
      coachFeedback.numberOfDislikes = 0;
      coachFeedback.numberOfReplies = 0;
      this.addNewCoachFeedbackOnClent(coachFeedback);
      this.addNewCoachFeedbackToServer(coachFeedback);
    }
  }

  /**
   *
   * @param coachFeedback - selected coach's feedback
   *
   */
  private addNewCoachFeedbackOnClent(coachFeedback: CoachFeedback) {
    this.coachFeedbacks.push(coachFeedback);
    this.coachFeedbacksTemp = this.coachFeedbacks;
    this.totalCoachFeedbacks = this.coachFeedbacksTemp.length;
    if (this.coachFeedbacksPerPage.length < 8) {
      this.coachFeedbacksPerPage.push(coachFeedback);
    }
  }

  /**
   * add new coach's feedback to server
   */
  private addNewCoachFeedbackToServer(coachFeedback) {
    const addCoachFeedbackUrl = `${Config.apiBaseUrl}/${Config.apiCoachManagementPrefix}/${Config.apiCoachFeedbacks}`;
    this.coachFeedbackService.addCoachFeedback(addCoachFeedbackUrl, coachFeedback)
      .subscribe((insertedCoachFeedback: CoachFeedback) => {
        if (insertedCoachFeedback) {
          this.coachReviewContent = '';
          this.createNotification('success', 'Success', 'Thank your for your feedback!!!');
        } else {
          this.createNotification('error', 'Error', 'Cannot submit your feedback! Please try again!');
        }
      });
  }

  /**
   * add coach's rate
   */
  private addCoachRate() {
    const coachRate = new CoachRate();
    coachRate.rate = this.selectedCoachRateValue;
    coachRate.coach = this.selectedCoach;
    coachRate.userProfile = this.selectedUserProfile;
    const addCoachRateUrl = `${Config.apiBaseUrl}/${Config.apiCoachManagementPrefix}/${Config.apiCoachRates}`;
    this.coachRateService.addCoachRate(addCoachRateUrl, coachRate)
      .subscribe((insertedCoachRate: CoachRate) => {
        if (insertedCoachRate) {
          this.selectedCoachRateValue = insertedCoachRate.rate;
        }
      });
  }

  /**
   *
   * @param selectedCoachFeedback - selected comment that user wants to like
   */
  public like(selectedCoachFeedback: CoachFeedback) {
    if (selectedCoachFeedback.isLikeClicked === true) {
      return;
    }
    if (selectedCoachFeedback.numberOfDislikes > 0 && selectedCoachFeedback.isReacted) {
      selectedCoachFeedback.numberOfDislikes -= 1;
    }
    selectedCoachFeedback.numberOfLikes += 1;
    selectedCoachFeedback.isLikeClicked = true;
    selectedCoachFeedback.isReacted = true;
    // update number of likes of selected coach's feedback
    this.updateCoachFeedback(selectedCoachFeedback);
    this.submitNewCoachFeedbackReaction(selectedCoachFeedback, 1);
  }

  /**
   *
   * @param selectedCoachFeedback - selected comment that user wants to dislike
   */
  public dislike(selectedCoachFeedback: CoachFeedback) {
    if (selectedCoachFeedback.isLikeClicked === false) {
      return;
    }
    if (selectedCoachFeedback.numberOfLikes > 0 && selectedCoachFeedback.isReacted) {
      selectedCoachFeedback.numberOfLikes -= 1;
    }
    selectedCoachFeedback.numberOfDislikes += 1;
    selectedCoachFeedback.isLikeClicked = false;
    selectedCoachFeedback.isReacted = true;
    // update number of dislikes of selected coach's feedback
    this.updateCoachFeedback(selectedCoachFeedback);
    this.submitNewCoachFeedbackReaction(selectedCoachFeedback, 0);
  }

  /**
   *
   * @param selectedCoachFeedback - coach's feedback that will be updated
   */
  private updateCoachFeedback(selectedCoachFeedback: CoachFeedback) {
    const updateCoachFeedbackUrl = `${Config.apiBaseUrl}/${Config.apiCoachManagementPrefix}/${Config.apiCoachFeedbacks}`;
    this.coachFeedbackService.updateCoachFeedback(updateCoachFeedbackUrl, selectedCoachFeedback)
      .subscribe((updatedCoachFeedback: CoachFeedback) => {
        console.log(updatedCoachFeedback);
      });
  }

  /**
   *
   * @param selectedCoachFeedback - selected coach's feedback that user has reacted
   * @param reactionValue - reaction's value that will be set to selected coach's feedback
   */
  private submitNewCoachFeedbackReaction(selectedCoachFeedback: CoachFeedback, reactionValue: number) {
    const newCoachFeedbackReaction = new CoachFeedbackReaction();
    newCoachFeedbackReaction.coachFeedback = selectedCoachFeedback;
    newCoachFeedbackReaction.userProfile = this.selectedUserProfile;
    newCoachFeedbackReaction.reaction = reactionValue;
    const addCoachFeedbackReactionUrl = `${Config.apiBaseUrl}/${Config.apiCoachManagementPrefix}/${Config.apiCoachFeedbackReactions}`;
    this.coachFeedbackReactionService.addCoachFeedbackReaction(addCoachFeedbackReactionUrl, newCoachFeedbackReaction)
      .subscribe((insertedCoachFeedbackReaction: CoachFeedbackReaction) => {
        if (insertedCoachFeedbackReaction) {
          console.log(insertedCoachFeedbackReaction);
        }
      });
  }

  /**
   *
   * @param selectedCoachFeedback - selected coach's feedback that user want to view replies
   */
  public viewRepliesOfSelectedCoachFeedback(selectedCoachFeedback: CoachFeedback) {
    if (!selectedCoachFeedback.replies) {
      const selectedCoachFeedbackId = selectedCoachFeedback.id;
      const getRepliesOnCoachFeedbackUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiCoachFeedbacks}/
${selectedCoachFeedbackId}/
${Config.apiRepliesOnCoachFeedback}`;
      this.replyOnCoachFeedbackService.getRepliesOnCoachFeedback(getRepliesOnCoachFeedbackUrl)
        .subscribe((repliesOnCoachFeedback: ReplyOnCoachFeedback[]) => {
          if (repliesOnCoachFeedback) {
            selectedCoachFeedback.replies = repliesOnCoachFeedback;
            this.getReplyOnCoachFeedbackReactionsByUser(selectedCoachFeedback.replies);
          }
        });
    }
  }

  /**
   *
   * @param repliesOnCoachFeedback - replies on coach feedback that will be checked user liked or disliked
   */
  private getReplyOnCoachFeedbackReactionsByUser(repliesOnCoachFeedback: ReplyOnCoachFeedback[]) {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getReplyOnCoachFeedbackReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiReplyOnCoachFeedbackReactions}`;
    this.replyOnCoachFeedbackReactionService.getReplyOnCoachFeedbackReactions(getReplyOnCoachFeedbackReactionsUrl)
      .subscribe((replyOnCoachFeedbackReactions: ReplyOnCoachFeedbackReaction[]) => {
        if (replyOnCoachFeedbackReactions) {
          this.showRepliesOnCoachFeedbackUserLikedDisliked(repliesOnCoachFeedback, replyOnCoachFeedbackReactions);
        }
      });
  }

  /**
   *
   * @param repliesOnCoachFeedback - replies on coach's feedback that will be checked which replies user liked and disliked
   * @param replyOnCoachFeedbackReactions - replies on coach's feedback that user liked and disliked
   */
  private showRepliesOnCoachFeedbackUserLikedDisliked(repliesOnCoachFeedback: ReplyOnCoachFeedback[],
                                                      replyOnCoachFeedbackReactions: ReplyOnCoachFeedbackReaction[]) {
    for (const eachReplyOnCoachFeedbackReaction of replyOnCoachFeedbackReactions) {
      for (const eachReplyOnCoachFeedback of repliesOnCoachFeedback) {
        if (eachReplyOnCoachFeedbackReaction.replyOnCoachFeedback.id === eachReplyOnCoachFeedback.id) {
          this.changeReplyOnCoachFeedbackReactionStatus(eachReplyOnCoachFeedback, eachReplyOnCoachFeedbackReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - reply on coach's feedback that will be set reaction's value
   * @param selectedReplyOnCoachFeedbackReaction - reaction's value that will be set to reply on coach's feedback
   */
  private changeReplyOnCoachFeedbackReactionStatus(selectedReplyOnCoachFeedback: ReplyOnCoachFeedback,
                                                   selectedReplyOnCoachFeedbackReaction: ReplyOnCoachFeedbackReaction) {
    selectedReplyOnCoachFeedback.isReacted = true;
    if (selectedReplyOnCoachFeedbackReaction.reaction === 1) {
      selectedReplyOnCoachFeedback.isLikeClicked = true;
    } else if (selectedReplyOnCoachFeedbackReaction.reaction === 0) {
      selectedReplyOnCoachFeedback.isLikeClicked = false;
    }
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - reply on coach's feedback that user want to like
   */
  public likeReplyOnCoachFeedback(selectedReplyOnCoachFeedback: ReplyOnCoachFeedback) {
    if (selectedReplyOnCoachFeedback.isLikeClicked === true) {
      return;
    }
    if (selectedReplyOnCoachFeedback.numberOfDislikes > 0 && selectedReplyOnCoachFeedback.isReacted) {
      selectedReplyOnCoachFeedback.numberOfDislikes -= 1;
    }
    selectedReplyOnCoachFeedback.numberOfLikes += 1;
    selectedReplyOnCoachFeedback.isLikeClicked = true;
    selectedReplyOnCoachFeedback.isReacted = true;
    // update number of likes of reply on coach's feedback
    this.updateReplyOnCoachFeedback(selectedReplyOnCoachFeedback);
    this.submitNewReplyCoachFeedbackReaction(selectedReplyOnCoachFeedback, 1);
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - reply on coach's feedback that user want to dislike
   */
  public dislikeReplyOnCoachFeedback(selectedReplyOnCoachFeedback: ReplyOnCoachFeedback) {
    if (selectedReplyOnCoachFeedback.isLikeClicked === false) {
      return;
    }
    if (selectedReplyOnCoachFeedback.numberOfLikes > 0 && selectedReplyOnCoachFeedback.isReacted) {
      selectedReplyOnCoachFeedback.numberOfLikes -= 1;
    }
    selectedReplyOnCoachFeedback.numberOfDislikes += 1;
    selectedReplyOnCoachFeedback.isLikeClicked = false;
    selectedReplyOnCoachFeedback.isReacted = true;
    // update number of dislikes of reply on coach's feedback
    this.updateReplyOnCoachFeedback(selectedReplyOnCoachFeedback);
    this.submitNewReplyCoachFeedbackReaction(selectedReplyOnCoachFeedback, 0);
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - reply on coach's feedback that will be updated
   */
  private updateReplyOnCoachFeedback(selectedReplyOnCoachFeedback: ReplyOnCoachFeedback) {
    const updateReplyOnCoachFeedbackUrl = `${Config.apiBaseUrl}/${Config.apiCoachManagementPrefix}/${Config.apiRepliesOnCoachFeedback}`;
    this.replyOnCoachFeedbackService.updateReplyOnCoachFeedback(updateReplyOnCoachFeedbackUrl, selectedReplyOnCoachFeedback)
      .subscribe((updatedReplyOnCoachFeedback: ReplyOnCoachFeedback) => {
        console.log(updatedReplyOnCoachFeedback);
      });
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - selected reply on coach feedback
   * @param reactionValue - reaction's value
   */
  private submitNewReplyCoachFeedbackReaction(selectedReplyOnCoachFeedback: ReplyOnCoachFeedback, reactionValue: number) {
    const newReplyOnCoachFeedbackReaction = new ReplyOnCoachFeedbackReaction();
    newReplyOnCoachFeedbackReaction.replyOnCoachFeedback = selectedReplyOnCoachFeedback;
    newReplyOnCoachFeedbackReaction.userProfile = this.selectedUserProfile;
    newReplyOnCoachFeedbackReaction.reaction = reactionValue;
    const addReplyOnCoachFeedbackReactionUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiReplyOnCoachFeedbackReactions}`;
    this.replyOnCoachFeedbackReactionService
      .addNewReplyOnCoachFeedbackReaction(addReplyOnCoachFeedbackReactionUrl, newReplyOnCoachFeedbackReaction)
      .subscribe((insertedReplyOnCoachFeedbackReaction: ReplyOnCoachFeedbackReaction) => {
        if (insertedReplyOnCoachFeedbackReaction) {
          console.log(insertedReplyOnCoachFeedbackReaction);
        }
      });
  }

  /**
   *
   * @param selectedCoachFeedback - selected comment that user want to reply
   */
  public showReplyCoachFeedbackBox(selectedCoachFeedback: CoachFeedback) {
    selectedCoachFeedback.isReplyBoxShown = true;
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - reply on coach's feedback that user want to reply
   */
  public showReplyReplyCoachFeedbackBox(selectedReplyOnCoachFeedback: ReplyOnCoachFeedback) {
    for (const eachCoachFeedback of this.coachFeedbacksPerPage) {
      if (selectedReplyOnCoachFeedback.coachFeedback.id === eachCoachFeedback.id) {
        eachCoachFeedback.isReplyBoxShown = true;
        break;
      }
    }
  }

  /**
   *
   * @param replyContent - reply's content that user want to reply
   * @param selectedCoachFeedback - selected coach's feedback that user want to reply
   */
  public replyToCoachFeedback(selectedCoachFeedback: CoachFeedback, replyContent: string) {
    const newReplyOnCoachFeedback = new ReplyOnCoachFeedback();
    newReplyOnCoachFeedback.replyOnCoachFeedbackContent = replyContent;
    newReplyOnCoachFeedback.replyOnCoachFeedbackStatus = 1;
    newReplyOnCoachFeedback.replyOnCoachFeedbackCreatedDate = new Date();
    newReplyOnCoachFeedback.coachFeedback = selectedCoachFeedback;
    newReplyOnCoachFeedback.userProfile = this.selectedUserProfile;
    newReplyOnCoachFeedback.numberOfLikes = 0;
    newReplyOnCoachFeedback.numberOfDislikes = 0;
    const addReplyOnCoachFeedbackUrl = `${Config.apiBaseUrl}/${Config.apiCoachManagementPrefix}/${Config.apiRepliesOnCoachFeedback}`;
    this.replyOnCoachFeedbackService.addReplyOnCoachFeedback(addReplyOnCoachFeedbackUrl, newReplyOnCoachFeedback)
      .subscribe((insertedReplyOnCoachFeedback: ReplyOnCoachFeedback) => {
        if (insertedReplyOnCoachFeedback) {
          console.log(insertedReplyOnCoachFeedback);
        }
      });
    if (selectedCoachFeedback.replies && selectedCoachFeedback.replies.length) {
      selectedCoachFeedback.replies.push(newReplyOnCoachFeedback);
    }
    selectedCoachFeedback.numberOfReplies += 1;
  }

  /**
   * send hire request to coach
   */
  public sendHireRequestToCoach() {
    this.isLoadingSpinnerShown = true;
    const coachMembershipNotification = new CoachMembershipNotification();
    coachMembershipNotification.coach = this.selectedCoach;
    coachMembershipNotification.userProfile = this.selectedUserProfile;
    coachMembershipNotification.createdDate = new Date();
    coachMembershipNotification.status = 0;
    coachMembershipNotification.content =
      `${this.selectedUserProfile.fullName} wants to be trained by ${this.selectedCoach.userProfile.fullName}`;
    const addCoachMembershipNotificationUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiCoachMembershipNotifications}`;
    this.coachMembershipNotificationService.addCoachMembershipNotification(addCoachMembershipNotificationUrl, coachMembershipNotification)
      .subscribe((insertedCoachMembershipNotification: CoachMembershipNotification) => {
        if (insertedCoachMembershipNotification) {
          this.createNotification('success', 'Success', 'Your request was sent successfully');
          this.isHireCoachRequestSent = true;
        } else {
          this.createNotification('error', 'Error', 'Failure to send your request, please try again!');
        }
        this.isLoadingSpinnerShown = false;
      });
  }
}
