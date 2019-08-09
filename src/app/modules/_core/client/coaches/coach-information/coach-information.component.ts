import {Component, Input, OnInit} from '@angular/core';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {
  Coach,
  CoachFeedback,
  CoachFeedbackReaction, CoachMembershipNotification,
  CoachRate, Membership,
  ReplyOnCoachFeedback,
  ReplyOnCoachFeedbackReaction,
  ResponseMessage,
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

@Component({
  selector: 'app-coach-information',
  templateUrl: './coach-information.component.html',
  styleUrls: ['./coach-information.component.css']
})
export class CoachInformationComponent implements OnInit {
  // check loading component is showing or not
  loading: boolean;

  // selected coach
  selectedCoach: Coach;
  // number of memberships
  nMemberships: number;
  // rate average
  rateAverage: number;

  // check add review form is showing or not
  isReviewFormShown: boolean;

  // coach's feedbacks
  coachFeedbacks: CoachFeedback[];

  // need to create coach's feedbacks temp to load data base on current page
  coachFeedbacksTemp: CoachFeedback[];

  // coach's feedbacks per page
  coachFeedbacksPerPage: CoachFeedback[];

  // current page
  currentPage: number;

  // number coach's feedbacks per page
  nCoachFeedbacksPerPage: number;

  // total coach's feedbacks
  totalCoachFeedbacks: number;

  // check coach's feedback list and pagination is showing or not
  isCoachFeedbackAndPaginationShown: boolean;

  // startIndex to get coach's feedbacks per page
  startIndex: number;

  // selected coach's rate
  selectedCoachRateValue: number;

  // selected coach's rate
  selectedCoachRate: CoachRate;

  // review's content
  reviewContent: string;

  // selected user's profile
  selectedUserProfile: UserProfile;

  // check user sent request to coach or not
  isSentRequest: boolean;

  // check current user and selected coach are having a relationship or not
  selectedMembership: Membership;
  isRelationshipExisted: boolean;

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
    // init data
    this.initData();
    // get selected user's profile
    this.getSelectedUserProfile();
    // get selected coach
    this.getSelectedCoach();
  }

  private initData() {
    this.rateAverage = 0;
    this.nMemberships = 0;
    // init current page
    this.currentPage = 1;
    // init number of coach's feedbacks per page
    this.nCoachFeedbacksPerPage = 8;
  }

  /**
   * toggle add review form
   */
  public toggleAddReviewForm() {
    this.isReviewFormShown = !this.isReviewFormShown;
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    // show loading component
    this.loading = true;

    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          // check selected coach existed or not
          this.checkSelectedCoachExistedOrNot();
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get number of memberships
   */
  private getNumberOfMemberships() {
    this.membershipService.countNumberOfMembershipsByCoach(this.selectedCoach, 1)
      .subscribe((nMemberships: ResponseMessage) => {
        if (nMemberships) {
          this.nMemberships = Number(nMemberships.message);
        }
      });
  }

  /**
   * check selected coach existed or not
   */
  private checkSelectedCoachExistedOrNot() {
    if (this.selectedCoach == null) {
      this.router.navigate(['/client/coach']);
    } else {
      // get number of memberships
      this.getNumberOfMemberships();
      // get coach's rate's average
      this.getCoachRateAverage();
      // get coach's feedbacks per page
      this.getCoachFeedbacksByCoach();
      // get selected coach rate by current user's profile
      this.getSelectedCoachRate();
      // get selected membership
      this.getSelectedMembership();
    }
  }

  /**
   * get selected membership
   */
  private getSelectedMembership() {
    this.membershipService.getMembershipByCoachAndByUserProfile(this.selectedCoach.id, this.selectedUserProfile.id)
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
          this.isRelationshipExisted = this.selectedMembership.status === 1;
          // check user sent quest to coach or not
          this.checkUserSentRequestToCoach();
        } else {
          this.isRelationshipExisted = false;
          // check user sent request to coach or not
          this.checkUserSentRequestToCoach();
        }
      });
  }

  /**
   * check user sent request to coach or not
   */
  private checkUserSentRequestToCoach() {
    // show loading component
    this.loading = true;
    this.coachMembershipNotificationService.getCoachMembershipNotificationByUserProfileIdAndByCoachIdAndByStatus(
      this.selectedUserProfile.id,
      this.selectedCoach.id,
      0
    ).subscribe((selectedCoachMembershipNotification: CoachMembershipNotification) => {
      this.isSentRequest = !!selectedCoachMembershipNotification;
      // hide loading component
      this.loading = false;
    });
  }

  /**
   *
   * @param event - selectd rate
   */
  public onRateChanged(event) {
    // assign new rate value for coach
    this.selectedCoachRateValue = event;
  }

  /**
   * get coach's feedbacks by coach
   */
  private getCoachFeedbacksByCoach() {
    // show loading component
    this.loading = true;
    // get coach's feedbacks
    this.coachFeedbackService.getCoachFeedbacksByCoach(this.selectedCoach, 1)
      .subscribe(coachFeedbacks => {
        if (coachFeedbacks) {
          // check coach's feedbacks list and pagination is showing or not
          if (coachFeedbacks.length > 0) {
            // get coach's feedbacks
            this.coachFeedbacks = coachFeedbacks;
            // assign all data to coach's feedbacks temp the first time
            this.coachFeedbacksTemp = coachFeedbacks;
            // get total number of coach's feedbacks
            this.totalCoachFeedbacks = this.coachFeedbacksTemp.length;
            // load coach's feedbacks per page
            this.loadCoachFeedbacksPerPage();
            //
            this.isCoachFeedbackAndPaginationShown = true;
          } else {
            this.isCoachFeedbackAndPaginationShown = false;
            this.coachFeedbacks = [];
            this.coachFeedbacksTemp = [];
            this.totalCoachFeedbacks = 0;
            this.coachFeedbacksPerPage = [];
          }
          // hide loading component
          this.loading = false;
        }
      });
  }

  /**
   *
   * @param event - current's page
   */
  public coachFeedbacksPageChange(event) {
    // set current page
    this.currentPage = event;
    // show loading component
    this.loading = true;
    // load new data
    this.loadCoachFeedbacksPerPage();
  }

  /**
   * load coach's feedbacks per page
   */
  private loadCoachFeedbacksPerPage() {
    // init startIndex
    this.startIndex = ((this.currentPage - 1) * 8) + 1;
    // get coach's feedbacks data per page
    this.coachFeedbacksPerPage = this.coachFeedbacksTemp.slice(this.startIndex - 1, this.startIndex + 7);
    // hide loading component
    this.loading = false;
    // load number of reactions, replies for coach's feedbacks per page
    this.loadNumberOfRepliesAndReactions();
    // check which feedback that current user liked and disliked
    this.loadCoachFeedbackUserLikedAndDisliked();
  }

  /**
   * add coach's feedback for selected coach
   */
  public addCoachReview() {
    // add coach's feedback
    this.addCoachFeedback();
    // add coach's rate
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
   * get selected's coach rate
   */
  private getSelectedCoachRate() {
    // show loading component
    this.loading = true;
    // get selected coach's rate
    this.coachRateService.getCoachRateByUserIdAndCoachId(
      this.selectedUserProfile.id,
      this.selectedCoach.id
    )
      .subscribe((selectedCoachRate: CoachRate) => {
        if (selectedCoachRate) {
          this.selectedCoachRate = selectedCoachRate;
          this.selectedCoachRateValue = this.selectedCoachRate.rate;
        } else {
          this.selectedCoachRateValue = 0;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * add coach's feedback
   */
  private addCoachFeedback() {
    // check review's content is empty or not
    if (this.reviewContent.localeCompare('') === 0) {
      // show warning message to user
      this.createNotification('error', 'Error', 'Please input your review\'s content');
    } else {
      // create new coach's feedback
      const coachFeedback = new CoachFeedback();
      coachFeedback.coachFeedbackContent = this.reviewContent;
      coachFeedback.coachFeedbackCreatedDate = new Date();
      coachFeedback.coachFeedbackStatus = 1;
      coachFeedback.coach = this.selectedCoach;
      coachFeedback.userProfile = this.selectedUserProfile;
      coachFeedback.nLikes = 0;
      coachFeedback.nDislikes = 0;
      coachFeedback.nReplies = 0;

      // add coach's feedback client
      this.addNewCoachFeedbackOnClent(coachFeedback);
      // add coach's feedback to database
      this.addNewCoachFeedbackToServer(coachFeedback);
    }
  }

  /**
   *
   * @param coachFeedback - selected coach's feedback
   *
   */
  private addNewCoachFeedbackOnClent(coachFeedback: CoachFeedback) {
    // add coach's feedbacks
    this.coachFeedbacks.push(coachFeedback);
    // assign all data to coach's feedbacks temp
    this.coachFeedbacksTemp = this.coachFeedbacks;
    // get total number of coach's feedbacks
    this.totalCoachFeedbacks = this.coachFeedbacksTemp.length;
    // add to current page if have any free space left
    if (this.coachFeedbacksPerPage.length < 8) {
      this.coachFeedbacksPerPage.push(coachFeedback);
    }
  }

  /**
   * add new coach's feedback to server
   */
  private addNewCoachFeedbackToServer(coachFeedback) {
    this.coachFeedbackService.addCoachFeedback(coachFeedback)
      .subscribe((insertedCoachFeedback: CoachFeedback) => {
        if (insertedCoachFeedback) {
          // assign new coach's feedback
          this.reviewContent = '';
          // show success notification
          this.createNotification('success', 'Success', 'Thank your for your feedback!!!');
        } else {
          // show error notification
          this.createNotification('error', 'Error', 'Cannot submit your feedback! Please try again!');
        }
      });
  }

  /**
   * add coach's rate
   */
  private addCoachRate() {
    // create new coach's rate object
    const coachRate = new CoachRate();
    coachRate.rate = this.selectedCoachRateValue;
    coachRate.coach = this.selectedCoach;
    coachRate.userProfile = this.selectedUserProfile;

    // add to database
    this.coachRateService.addCoachRate(coachRate)
      .subscribe((insertedCoachRate: CoachRate) => {
        if (insertedCoachRate) {
          console.log(insertedCoachRate);
          // assign new coach's rate
          this.selectedCoachRate = insertedCoachRate;
          this.selectedCoachRateValue = insertedCoachRate.rate;
        }
      });
  }

  /**
   * load number of replies and reactions
   */
  private loadNumberOfRepliesAndReactions() {
    this.coachFeedbacksPerPage.map(eachCoachFeedback => {
      // count number of coach feedback replies
      this.replyOnCoachFeedbackService.countNumberOfCoachFeedbackReplies(eachCoachFeedback, 1)
        .subscribe((nReplies: ResponseMessage) => {
          if (nReplies) {
            eachCoachFeedback.nReplies = Number(nReplies.message);
          } else {
            eachCoachFeedback.nReplies = 0;
          }
        });
      // count number of like
      this.coachFeedbackReactionService.countNumberOfCoachFeedbackReactions(eachCoachFeedback, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachCoachFeedback.nLikes = Number(nLikes.message);
          } else {
            eachCoachFeedback.nLikes = 0;
          }
        });
      // count number of dislikes
      this.coachFeedbackReactionService.countNumberOfCoachFeedbackReactions(eachCoachFeedback, 0)
        .subscribe((nDisLikes: ResponseMessage) => {
          if (nDisLikes) {
            eachCoachFeedback.nDislikes = Number(nDisLikes.message);
          } else {
            eachCoachFeedback.nDislikes = 0;
          }
        });
    });
  }

  /**
   * load coach's feedback that user liked and disliked
   */
  private loadCoachFeedbackUserLikedAndDisliked() {
    this.coachFeedbackReactionService.getCoachFeedbackReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((coachFeedbackReactions: CoachFeedbackReaction[]) => {
        if (coachFeedbackReactions) {
          // show current like and dislike status of current user's profile
          for (const eachCoachFeedbackReaction of coachFeedbackReactions) {
            for (const eachCoachFeedback of this.coachFeedbacksPerPage) {
              eachCoachFeedback.isReacted = true;
              if (eachCoachFeedbackReaction.coachFeedback.id === eachCoachFeedback.id) {
                if (eachCoachFeedbackReaction.reaction === 1) {
                  // show like status
                  eachCoachFeedback.isLikeClicked = true;
                } else if (eachCoachFeedbackReaction.reaction === 0) {
                  // show dislike status
                  eachCoachFeedback.isLikeClicked = false;
                }
                break;
              }
            }
          }
        }
      });
  }

  /**
   *
   * @param selectedComment - selected comment that user wants to like
   */
  public like(selectedComment: CoachFeedback) {
    if (selectedComment.isLikeClicked === true) {
      return;
    }
    if (selectedComment.nDislikes > 0 && selectedComment.isReacted) {
      selectedComment.nDislikes -= 1;
    }
    selectedComment.nLikes += 1;
    selectedComment.isLikeClicked = true;
    selectedComment.isReacted = true;
    // submit new coach's feedback reaction to database
    this.submitNewCoachFeedbackReaction(selectedComment, 1);
  }

  /**
   *
   * @param selectedComment - selected comment that user wants to dislike
   */
  public dislike(selectedComment) {
    if (selectedComment.isLikeClicked === false) {
      return;
    }
    if (selectedComment.nLikes > 0 && selectedComment.isReacted) {
      selectedComment.nLikes -= 1;
    }
    selectedComment.nDislikes += 1;
    selectedComment.isLikeClicked = false;
    selectedComment.isReacted = true;
    // submit new coach's feedback reaction to database
    this.submitNewCoachFeedbackReaction(selectedComment, 0);
  }

  /**
   *
   * @param selectedComment - selected coach's feedback
   * @param reactionValue - reaction's value
   */
  private submitNewCoachFeedbackReaction(selectedComment, reactionValue) {
    // create new coach's feedback reaction object
    const newCoachFeedbackReaction = new CoachFeedbackReaction();
    newCoachFeedbackReaction.coachFeedback = selectedComment;
    newCoachFeedbackReaction.userProfile = this.selectedUserProfile;
    newCoachFeedbackReaction.reaction = reactionValue;
    // submit to the database
    this.coachFeedbackReactionService.addCoachFeedbackReaction(newCoachFeedbackReaction)
      .subscribe((insertedCoachFeedbackReaction: CoachFeedbackReaction) => {
        if (insertedCoachFeedbackReaction) {
          console.log(insertedCoachFeedbackReaction);
        }
      });
  }

  /**
   *
   * @param selectedComment - selected coach's feedback that user want to view replies
   */
  public viewRepliesOfSelectedCoachFeedback(selectedComment) {
    if (!selectedComment.replies) {
      this.replyOnCoachFeedbackService.getRepliesOnSelectedCoachFeedback(selectedComment, 1)
        .subscribe((repliesOnCoachFeedback: ReplyOnCoachFeedback[]) => {
          if (repliesOnCoachFeedback) {
            selectedComment.replies = repliesOnCoachFeedback;
            // load number of likes and dislikes of replies on coach's feedback
            this.loadNumberOfReplyOnCoachFeedbackReactions(selectedComment);
            // check which reply on coach's feedback that current user liked and disliked
            this.loadReplyOnCoachFeedbackUserLikedAndDisliked(selectedComment);
          }
        });
    }
  }

  /**
   *
   * @param selectedComment - selected comment that user want to load number of reply's reactions
   */
  private loadNumberOfReplyOnCoachFeedbackReactions(selectedComment: any) {
    for (const eachReplyOnCoachFeedback of selectedComment.replies) {
      // count number of likes
      this.replyOnCoachFeedbackReactionService.countNumberOfReplyOnCoachFeedbackReaction(eachReplyOnCoachFeedback, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachReplyOnCoachFeedback.nLikes = Number(nLikes.message);
          } else {
            eachReplyOnCoachFeedback.nLikes = 0;
          }
        });
      // count number dislikes
      this.replyOnCoachFeedbackReactionService.countNumberOfReplyOnCoachFeedbackReaction(eachReplyOnCoachFeedback, 0)
        .subscribe((nDislikes: ResponseMessage) => {
          if (nDislikes) {
            eachReplyOnCoachFeedback.nDislikes = Number(nDislikes.message);
          } else {
            eachReplyOnCoachFeedback.nDislikes = 0;
          }
        });
    }
  }

  /**
   * check which reply on coach's feedback that current user liked and disliked
   */
  private loadReplyOnCoachFeedbackUserLikedAndDisliked(selectedComment) {
    this.replyOnCoachFeedbackReactionService.getReplyOnCoachFeedbackReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((replyOnCoachFeedbackReactions: ReplyOnCoachFeedbackReaction[]) => {
        if (replyOnCoachFeedbackReactions) {
          // show current like and dislike status of current user's profile
          for (const eachReplyOnCoachFeedbackReaction of replyOnCoachFeedbackReactions) {
            for (const eachReplyOnCoachFeedback of selectedComment.replies) {
              eachReplyOnCoachFeedback.isReacted = true;
              if (eachReplyOnCoachFeedbackReaction.replyOnCoachFeedback.id === eachReplyOnCoachFeedback.id) {
                if (eachReplyOnCoachFeedbackReaction.reaction === 1) {
                  eachReplyOnCoachFeedback.isLikeClicked = true;
                } else if (eachReplyOnCoachFeedbackReaction.reaction === 0) {
                  eachReplyOnCoachFeedback.isLikeClicked = false;
                }
                break;
              }
            }
          }
        }
      });
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - selectedReplyOnCoachFeedback
   */
  public likeReplyOnCoachFeedback(selectedReplyOnCoachFeedback) {
    if (selectedReplyOnCoachFeedback.isLikeClicked === true) {
      return;
    }
    if (selectedReplyOnCoachFeedback.nDislikes > 0 && selectedReplyOnCoachFeedback.isReacted) {
      selectedReplyOnCoachFeedback.nDislikes -= 1;
    }
    selectedReplyOnCoachFeedback.nLikes += 1;
    selectedReplyOnCoachFeedback.isLikeClicked = true;
    selectedReplyOnCoachFeedback.isReacted = true;
    // submit new reply on coach feedback reaction to database
    this.submitNewReplyCoachFeedbackReaction(selectedReplyOnCoachFeedback, 1);
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - selectedReplyOnCoachFeedback
   */
  public dislikeReplyOnCoachFeedback(selectedReplyOnCoachFeedback) {
    if (selectedReplyOnCoachFeedback.isLikeClicked === false) {
      return;
    }
    if (selectedReplyOnCoachFeedback.nLikes > 0 && selectedReplyOnCoachFeedback.isReacted) {
      selectedReplyOnCoachFeedback.nLikes -= 1;
    }
    selectedReplyOnCoachFeedback.nDislikes += 1;
    selectedReplyOnCoachFeedback.isLikeClicked = false;
    selectedReplyOnCoachFeedback.isReacted = true;
    // submit new reply on coach feedback reaction to database
    this.submitNewReplyCoachFeedbackReaction(selectedReplyOnCoachFeedback, 0);
  }

  /**
   *
   * @param selectedReplyOnCoachFeedback - selected reply on coach feedback
   * @param reactionValue - reaction's value
   */
  private submitNewReplyCoachFeedbackReaction(selectedReplyOnCoachFeedback, reactionValue) {
    // create new reply on coach feedback reaction object
    const newReplyOnCoachFeedbackReaction = new ReplyOnCoachFeedbackReaction();
    newReplyOnCoachFeedbackReaction.replyOnCoachFeedback = selectedReplyOnCoachFeedback;
    newReplyOnCoachFeedbackReaction.userProfile = this.selectedUserProfile;
    newReplyOnCoachFeedbackReaction.reaction = reactionValue;
    // submit to the database
    this.replyOnCoachFeedbackReactionService.addNewReplyOnCoachFeedbackReaction(newReplyOnCoachFeedbackReaction)
      .subscribe((insertedReplyOnCoachFeedbackReaction: ReplyOnCoachFeedbackReaction) => {
        if (insertedReplyOnCoachFeedbackReaction) {
          console.log(insertedReplyOnCoachFeedbackReaction);
        }
      });
  }

  /**
   *
   * @param selectedComment - selected comment that user want to reply
   */
  public showReplyCoachFeedbackBox(selectedComment) {
    selectedComment.isReplyBoxShown = true;
  }

  public showReplyReplyCoachFeedbackBox(selectedReplyComment) {
    // find coach's feedback and show reply box
    for (const eachCoachFeedback of this.coachFeedbacksPerPage) {
      if (selectedReplyComment.coachFeedback.id === eachCoachFeedback.id) {
        eachCoachFeedback.isReplyBoxShown = true;
        break;
      }
    }
  }

  /**
   *
   * @param replyContent - reply's content
   * @param selectedComment - selectedComment
   */
  public replyToCoachFeedback(selectedComment, replyContent) {
    // create new reply on coach' feedback
    const newReplyOnCoachFeedback = new ReplyOnCoachFeedback();
    newReplyOnCoachFeedback.replyOnCoachFeedbackContent = replyContent;
    newReplyOnCoachFeedback.replyOnCoachFeedbackStatus = 1;
    newReplyOnCoachFeedback.replyOnCoachFeedbackCreatedDate = new Date();
    newReplyOnCoachFeedback.coachFeedback = selectedComment;
    newReplyOnCoachFeedback.userProfile = this.selectedUserProfile;
    newReplyOnCoachFeedback.nLikes = 0;
    newReplyOnCoachFeedback.nDislikes = 0;

    // add new reply on coach feedback to the server
    this.replyOnCoachFeedbackService.addReplyOnCoachFeedback(newReplyOnCoachFeedback)
      .subscribe((insertedReplyOnCoachFeedback: ReplyOnCoachFeedback) => {
        if (insertedReplyOnCoachFeedback) {
          console.log(insertedReplyOnCoachFeedback);
        }
      });

    // add new reply on client
    if (selectedComment.replies && selectedComment.replies.length) {
      selectedComment.replies.push(newReplyOnCoachFeedback);
    }
    selectedComment.nReplies += 1;
  }

  /**
   * get coach's rate's average
   */
  private getCoachRateAverage() {
    this.coachRateService.getCoachRateAverage(this.selectedCoach.id)
      .subscribe(rateAverage => {
        if (rateAverage) {
          this.rateAverage = Number(rateAverage.message);
        }
      });
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * send hire request to coach
   */
  public sendHireRequestToCoach() {
    // show loading component
    this.loading = true;
    // create coach membership notification object
    const coachMembershipNotification = new CoachMembershipNotification();
    coachMembershipNotification.coach = this.selectedCoach;
    coachMembershipNotification.userProfile = this.selectedUserProfile;
    coachMembershipNotification.createdDate = new Date();
    coachMembershipNotification.status = 0;
    coachMembershipNotification.content =
      `${this.selectedUserProfile.fullName} wants to be trained by ${this.selectedCoach.userProfile.fullName}`;

    // submit coach membership notification to server
    this.coachMembershipNotificationService.addCoachMembershipNotification(coachMembershipNotification)
      .subscribe((insertedCoachMembershipNotification: CoachMembershipNotification) => {
        if (insertedCoachMembershipNotification) {
          // show success message to user
          this.createNotification('success', 'Success', 'Your request was sent successfully');
          // set flag to isSentRequest
          this.isSentRequest = true;
        } else {
          // show error message to user
          this.createNotification('error', 'Error', 'Failure to send your request, please try again!');
        }
        // hide loading component
        this.loading = false;
      });
  }
}
