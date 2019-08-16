import {Component, OnInit} from '@angular/core';
import {
  NewFeed,
  NewFeedComment,
  NewFeedCommentReaction,
  NewFeedReaction, ReplyOnNewFeedComment, ReplyOnNewFeedCommentReaction,
  UserProfile
} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {NewFeedService} from '@gw-services/core/api/feed/new-feed.service';
import {NewFeedReactionService} from '@gw-services/core/api/feed/new-feed-reaction.service';
import {NewFeedCommentService} from '@gw-services/core/api/feed/new-feed-comment.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {NewFeedCommentReactionService} from '@gw-services/core/api/feed/new-feed-comment-reaction.service';
import {ReplyOnNewFeedCommentService} from '@gw-services/core/api/feed/reply-on-new-feed-comment.service';
import {ReplyOnNewFeedCommentReactionService} from '@gw-services/core/api/feed/reply-on-new-feed-comment-reaction.service';

@Component({
  selector: 'app-new-feed',
  templateUrl: './new-feed.component.html',
  styleUrls: ['./new-feed.component.css']
})
export class NewFeedComponent implements OnInit {
  newFeeds: NewFeed[];
  currentNewFeedsPage;
  isLoadingSpinnerShown = true;
  newFeedContentKeywords: string;
  nNewFeedsPerPage: number;
  totalNewFeeds: number;
  selectedUserProfile: UserProfile;

  /**
   *
   * @param newFeedService - inject newFeedService
   * @param newFeedReactionService - inject newFeedReactionService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param newFeedCommentReactionService - inject newFeedCommentReactionService
   * @param replyOnNewFeedCommentService - inject replyOnNewFeedCommentService
   * @param replyOnNewFeedCommentReactionService - inject replyOnNewFeedCommentReactionService
   * @param newFeedCommentService - inject newFeedCommentService
   */
  constructor(private newFeedService: NewFeedService,
              private newFeedReactionService: NewFeedReactionService,
              private shareUserProfileService: ShareUserProfileService,
              private newFeedCommentReactionService: NewFeedCommentReactionService,
              private replyOnNewFeedCommentService: ReplyOnNewFeedCommentService,
              private replyOnNewFeedCommentReactionService: ReplyOnNewFeedCommentReactionService,
              private newFeedCommentService: NewFeedCommentService) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.currentNewFeedsPage = Config.currentPage;
    this.nNewFeedsPerPage = Config.numberItemsPerPage;
    this.newFeedContentKeywords = '';
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  public getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getNewFeeds();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get new feeds by current's page
   */
  private getNewFeeds(): void {
    const newFeedStatus = 1;
    let getNewFeedsUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiNewFeeds}?
${Config.pageParameter}=${this.currentNewFeedsPage}&
${Config.statusParameter}=${newFeedStatus}`;
    if (this.newFeedContentKeywords.localeCompare('') !== 0) {
      getNewFeedsUrl += `&${Config.searchParameter}=${this.newFeedContentKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.newFeedService.getNewFeeds(getNewFeedsUrl)
      .subscribe(response => {
        this.newFeeds = response.body;
        this.totalNewFeeds = Number(response.headers.get(Config.headerXTotalCount));
        this.getNewFeedReactionsByUser();
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * load new feeds user liked or disliked
   */
  private getNewFeedReactionsByUser(): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getNewFeedReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiNewFeedReactions}`;
    this.newFeedReactionService.getNewFeedReactions(getNewFeedReactionsUrl)
      .subscribe((newFeedReactions: NewFeedReaction[]) => {
        if (newFeedReactions) {
          this.showNewFeedsUserLikedDisliked(newFeedReactions);
        }
      });
  }

  /**
   *
   * @param newFeedReactions - newfeeds that user liked and disliked
   */
  private showNewFeedsUserLikedDisliked(newFeedReactions: NewFeedReaction[]): void {
    for (const eachNewFeedReaction of newFeedReactions) {
      for (const eachNewFeed of this.newFeeds) {
        if (eachNewFeedReaction.newFeed.id === eachNewFeed.id) {
          this.changeNewFeedReactionStatus(eachNewFeed, eachNewFeedReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedNewFeed - newfeed that its reaction will be changed
   * @param selectedNewFeedReaction - reaction's value that will be set to selected newfeed
   */
  private changeNewFeedReactionStatus(selectedNewFeed: NewFeed, selectedNewFeedReaction: NewFeedReaction): void {
    selectedNewFeed.isReacted = true;
    selectedNewFeed.isLikeClicked = selectedNewFeedReaction.reaction === 1;
  }

  /**
   *
   * @param selectedNewFeed - new feed that user want to like
   */
  likeNewFeed(selectedNewFeed: NewFeed): void {
    if (selectedNewFeed.isLikeClicked) {
      return;
    }
    if (selectedNewFeed.numberOfDislikes > 0 && selectedNewFeed.isReacted) {
      selectedNewFeed.numberOfDislikes -= 1;
    }
    selectedNewFeed.numberOfLikes += 1;
    // update number of likes of selected new feed
    this.updateNewFeed(selectedNewFeed);
    selectedNewFeed.isLikeClicked = true;
    this.submitNewFeedReactionToServer(selectedNewFeed, 1);
  }

  /**
   *
   * @param selectedNewFeed - new feed that user want to dislike
   */
  dislikeNewFeed(selectedNewFeed: NewFeed): void {
    if (!selectedNewFeed.isLikeClicked) {
      return;
    }
    if (selectedNewFeed.numberOfLikes > 0 && selectedNewFeed.isReacted) {
      selectedNewFeed.numberOfLikes -= 1;
    }
    selectedNewFeed.numberOfDislikes += 1;
    // update number of dislikes of selected new feed
    this.updateNewFeed(selectedNewFeed);
    selectedNewFeed.isLikeClicked = false;
    this.submitNewFeedReactionToServer(selectedNewFeed, 0);
  }

  /**
   *
   * @param selectedNewFeed - newfeed that will be updated
   */
  private updateNewFeed(selectedNewFeed: NewFeed): void {
    const updateNewFeedUrl = `${Config.apiBaseUrl}/${Config.apiNewFeedManagementPrefix}/${Config.apiNewFeeds}`;
    this.newFeedService.updateNewFeed(updateNewFeedUrl, selectedNewFeed).subscribe();
  }


  /**
   *
   * @param selectedNewFeed - selected new feed
   * @param reactionValue - reaction value that user react to selected new feed
   */
  private submitNewFeedReactionToServer(selectedNewFeed: NewFeed, reactionValue: number): void {
    const newFeedReaction = new NewFeedReaction();
    newFeedReaction.reaction = reactionValue;
    newFeedReaction.newFeed = selectedNewFeed;
    newFeedReaction.userProfile = this.selectedUserProfile;
    const addNewFeedReactionUrl = `${Config.apiBaseUrl}/${Config.apiNewFeedManagementPrefix}/${Config.apiNewFeedReactions};`;
    this.newFeedReactionService.addNewFeedReaction(addNewFeedReactionUrl, newFeedReaction).subscribe();
  }

  /**
   *
   * @param selectedNewFeed - new feed that user want to new feed
   */
  public viewNewFeedCommentsOfSelectedNewFeed(selectedNewFeed: NewFeed): void {
    if (!selectedNewFeed.replies) {
      selectedNewFeed.isReplyBoxShown = true;
      const newFeedCommentStatus = 1;
      const getNewFeedCommentsUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiNewFeeds}/
${selectedNewFeed.id}/
${Config.apiNewFeedComments}?
${Config.statusParameter}=${newFeedCommentStatus}`;
      this.newFeedCommentService.getNewFeedComments(getNewFeedCommentsUrl)
        .subscribe((newFeedComments: NewFeedComment[]) => {
          if (newFeedComments) {
            selectedNewFeed.replies = newFeedComments;
            this.getNewFeedCommentReactionsByUser(selectedNewFeed.replies);
          }
        });
    }
  }

  /**
   *
   * @param newFeedComments - newfeed's comments that will be check which comments that user liked and disliked
   */
  private getNewFeedCommentReactionsByUser(newFeedComments: NewFeedComment[]): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getNewFeedCommentReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiNewFeedCommentReactions}`;
    this.newFeedCommentReactionService.getNewFeedCommentReactions(getNewFeedCommentReactionsUrl)
      .subscribe((newFeedCommentReactions: NewFeedCommentReaction[]) => {
        if (newFeedCommentReactions) {
          this.showNewFeedCommentsUserLikedDisliked(newFeedComments, newFeedCommentReactions);
        }
      });
  }

  /**
   *
   * @param newFeedComments - newfeed's comments that will be checked which comments user liked and disliked
   * @param newFeedCommentReactions - newfeed's comments that user liked and disliked
   */
  private showNewFeedCommentsUserLikedDisliked(newFeedComments: NewFeedComment[],
                                               newFeedCommentReactions: NewFeedCommentReaction[]): void {
    for (const eachNewFeedCommentReaction of newFeedCommentReactions) {
      for (const eachNewFeedComment of newFeedComments) {
        if (eachNewFeedCommentReaction.newFeedComment.id === eachNewFeedComment.id) {
          this.changeNewFeedCommentReactionStatus(eachNewFeedComment, eachNewFeedCommentReaction);
        }
      }
    }
  }

  /**
   *
   * @param selectedNewFeedComment - newfeed's comment that its reaction will be changed
   * @param selectedNewFeedCommentReaction - reaction's value that will be set to selected newfeed
   */
  private changeNewFeedCommentReactionStatus(selectedNewFeedComment: NewFeedComment,
                                             selectedNewFeedCommentReaction: NewFeedCommentReaction): void {
    selectedNewFeedComment.isReacted = true;
    selectedNewFeedComment.isLikeClicked = selectedNewFeedCommentReaction.reaction === 1;
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment that user liked
   */
  public likeNewFeedComment(selectedNewFeedComment: NewFeedComment): void {
    if (selectedNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedNewFeedComment.numberOfDislikes > 0 && selectedNewFeedComment.isReacted) {
      selectedNewFeedComment.numberOfDislikes -= 1;
    }
    selectedNewFeedComment.numberOfLikes += 1;
    // update number of likes of selected newfeed's comment
    this.updateNewFeedComment(selectedNewFeedComment);
    selectedNewFeedComment.isLikeClicked = true;
    this.submitNewFeedCommentReactionToServer(selectedNewFeedComment, 1);
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   */
  public dislikeNewFeedComment(selectedNewFeedComment: NewFeedComment): void {
    if (!selectedNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedNewFeedComment.numberOfLikes > 0 && selectedNewFeedComment.isReacted) {
      selectedNewFeedComment.numberOfLikes -= 1;
    }
    selectedNewFeedComment.numberOfDislikes += 1;
    // update number of dislikes of selected newfeed's comment
    this.updateNewFeedComment(selectedNewFeedComment);
    selectedNewFeedComment.isLikeClicked = true;
    this.submitNewFeedCommentReactionToServer(selectedNewFeedComment, 0);
  }

  /**
   *
   * @param selectedNewFeedComment - newfeeds' comment that will be updated
   */
  private updateNewFeedComment(selectedNewFeedComment: NewFeedComment): void {
    const updateNewFeedCommentUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiNewFeedComments}`;
    this.newFeedCommentService.updateNewFeedComment(updateNewFeedCommentUrl, selectedNewFeedComment).subscribe();
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   * @param reactionValue - reaction value
   */
  private submitNewFeedCommentReactionToServer(selectedNewFeedComment: NewFeedComment, reactionValue: number): void {
    const newFeedCommentReaction = new NewFeedCommentReaction();
    newFeedCommentReaction.reaction = reactionValue;
    newFeedCommentReaction.newFeedComment = selectedNewFeedComment;
    newFeedCommentReaction.userProfile = this.selectedUserProfile;
    const addNewFeedCommentReactionUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiNewFeedCommentReactions}`;
    this.newFeedCommentReactionService.addNewFeedCommentReaction(addNewFeedCommentReactionUrl, newFeedCommentReaction).subscribe();
  }

  /**
   *
   * @param selectedNewFeedComment - selected new's feed's comment
   */
  public showReplyNewFeedCommentBox(selectedNewFeedComment: NewFeedComment): void {
    selectedNewFeedComment.isReplyBoxShown = true;
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   * @param replyNewFeedCommentContent = reply new feed comment content
   */
  public replyToNewFeedComment(selectedNewFeedComment: NewFeedComment, replyNewFeedCommentContent: string): void {
    const replyOnNewFeedComment = new ReplyOnNewFeedComment();
    replyOnNewFeedComment.newFeedComment = selectedNewFeedComment;
    replyOnNewFeedComment.replyOnNewFeedCommentContent = replyNewFeedCommentContent;
    replyOnNewFeedComment.replyOnNewFeedCommentStatus = 1;
    replyOnNewFeedComment.replyOnNewFeedCommentCreatedDate = new Date();
    replyOnNewFeedComment.userProfile = this.selectedUserProfile;
    replyOnNewFeedComment.numberOfLikes = 0;
    replyOnNewFeedComment.numberOfDislikes = 0;
    const addReplyOnNewFeedCommentUrl = `${Config.apiBaseUrl}/${Config.apiNewFeedManagementPrefix}/${Config.apiRepliesOnNewFeedComment}`;
    this.replyOnNewFeedCommentService.addReplyOnNewFeedComment(addReplyOnNewFeedCommentUrl, replyOnNewFeedComment).subscribe();
    selectedNewFeedComment.numberOfReplies += 1;
    // update number of replies of newfeed's comment
    this.updateNewFeedComment(selectedNewFeedComment);
    if (selectedNewFeedComment.replies && selectedNewFeedComment.replies.length) {
      selectedNewFeedComment.replies.push(replyOnNewFeedComment);
    }
  }

  /**
   *
   * @param selectedNewFeedComment - selected new's feed's comment
   */
  public viewRepliesOfSelectedNewFeedComment(selectedNewFeedComment: NewFeedComment): void {
    if (!selectedNewFeedComment.replies) {
      const replyOnNewFeedCommentStatus = 1;
      const getRepliesOnNewFeedComment = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiNewFeedComments}/
${selectedNewFeedComment.id}/
${Config.apiRepliesOnNewFeedComment}?
${Config.statusParameter}=${replyOnNewFeedCommentStatus}`;
      this.replyOnNewFeedCommentService.getRepliesOnNewFeedComment(getRepliesOnNewFeedComment)
        .subscribe((repliesOnNewFeedComment: ReplyOnNewFeedComment[]) => {
          if (repliesOnNewFeedComment) {
            selectedNewFeedComment.replies = repliesOnNewFeedComment;
            this.getReplyOnNewFeedCommentReactionsByUser(selectedNewFeedComment.replies);
          }
        });
    }
  }

  /**
   *
   * @param repliesOnNewFeedComment - replies on newfeed's comment that will be check user liked or disliked
   */
  private getReplyOnNewFeedCommentReactionsByUser(repliesOnNewFeedComment: ReplyOnNewFeedComment[]): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getReplyOnNewFeedCommentReactionUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiReplyOnNewFeedCommentReactions}`;
    this.replyOnNewFeedCommentReactionService.getReplyOnNewFeedCommentReactions(getReplyOnNewFeedCommentReactionUrl)
      .subscribe((replyOnNewFeedCommentReactions: ReplyOnNewFeedCommentReaction[]) => {
        if (replyOnNewFeedCommentReactions) {
          this.showRepliesOnNewFeedCommentUserLikedDisliked(repliesOnNewFeedComment, replyOnNewFeedCommentReactions);
        }
      });
  }

  /**
   *
   * @param repliesOnNewFeedComment - replies on newfeed's comment that will be checked which replies user liked and disliked
   * @param replyOnNewFeedCommentReactions - replies on newfeed's comment that user liked and disliked
   */
  private showRepliesOnNewFeedCommentUserLikedDisliked(repliesOnNewFeedComment: ReplyOnNewFeedComment[],
                                                       replyOnNewFeedCommentReactions: ReplyOnNewFeedCommentReaction[]): void {
    for (const eachReplyOnNewFeedCommentReaction of replyOnNewFeedCommentReactions) {
      for (const eachReplyOnNewFeedComment of repliesOnNewFeedComment) {
        if (eachReplyOnNewFeedCommentReaction.replyOnNewFeedComment.id === eachReplyOnNewFeedComment.id) {
          this.changeReplyOnNewFeedCommentReactionStatus(eachReplyOnNewFeedComment, eachReplyOnNewFeedCommentReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - reply on newfeed's comment that will be set reaction value
   * @param selectedReplyOnNewFeedCommentReaction - reaction's value that will be set to reply on newfeed's comment
   */
  private changeReplyOnNewFeedCommentReactionStatus(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment,
                                                    selectedReplyOnNewFeedCommentReaction: ReplyOnNewFeedCommentReaction): void {
    selectedReplyOnNewFeedComment.isReacted = true;
    selectedReplyOnNewFeedComment.isLikeClicked = selectedReplyOnNewFeedCommentReaction.reaction === 1;
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment that user want to like
   */
  public likeReplyOnNewFeedComment(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment): void {
    if (selectedReplyOnNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedReplyOnNewFeedComment.numberOfDislikes > 0 && selectedReplyOnNewFeedComment.isReacted) {
      selectedReplyOnNewFeedComment.numberOfDislikes -= 1;
    }
    selectedReplyOnNewFeedComment.numberOfLikes += 1;
    // update number of likes of reply on newfeed's comment
    this.updateReplyOnNewFeedComment(selectedReplyOnNewFeedComment);
    selectedReplyOnNewFeedComment.isLikeClicked = true;
    this.submitReplyOnNewFeedCommentReactionToServer(selectedReplyOnNewFeedComment, 1);
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment
   */
  public dislikeReplyOnNewFeedComment(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment): void {
    if (!selectedReplyOnNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedReplyOnNewFeedComment.numberOfLikes > 0 && selectedReplyOnNewFeedComment.isReacted) {
      selectedReplyOnNewFeedComment.numberOfLikes -= 1;
    }
    selectedReplyOnNewFeedComment.numberOfDislikes += 1;
    // update number of dislikes of reply on newfeed's comment
    this.updateReplyOnNewFeedComment(selectedReplyOnNewFeedComment);
    selectedReplyOnNewFeedComment.isLikeClicked = false;
    this.submitReplyOnNewFeedCommentReactionToServer(selectedReplyOnNewFeedComment, 0);
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - reply on newfeed's comment that will be updated
   */
  private updateReplyOnNewFeedComment(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment): void {
    const updateReplyOnNewFeedCommentUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiRepliesOnNewFeedComment}`;
    this.replyOnNewFeedCommentService
      .updateReplyOnNewFeedComment(updateReplyOnNewFeedCommentUrl, selectedReplyOnNewFeedComment)
      .subscribe();
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment that user has reacted
   * @param reactionValue - reaction value that user has reacted to reply on newfeed's comment
   */
  private submitReplyOnNewFeedCommentReactionToServer(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment,
                                                      reactionValue: number): void {
    const replyOnNewFeedCommentReaction = new ReplyOnNewFeedCommentReaction();
    replyOnNewFeedCommentReaction.reaction = reactionValue;
    replyOnNewFeedCommentReaction.replyOnNewFeedComment = selectedReplyOnNewFeedComment;
    replyOnNewFeedCommentReaction.userProfile = this.selectedUserProfile;
    const addReplyOnNewFeedCommentReactionUrl = `${Config.apiBaseUrl}/
${Config.apiNewFeedManagementPrefix}/
${Config.apiReplyOnNewFeedCommentReactions}`;
    this.replyOnNewFeedCommentReactionService
      .addReplyOnNewFeedCommentReaction(addReplyOnNewFeedCommentReactionUrl, replyOnNewFeedCommentReaction)
      .subscribe();
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment that user want to reply
   */
  public showReplyRelyNewFeedCommentBox(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment): void {
    let isNewFeedCommentFound = false;
    for (const eachNewFeed of this.newFeeds) {
      if (eachNewFeed.replies && eachNewFeed.replies.length) {
        for (const eachNewFeedComment of eachNewFeed.replies) {
          if (selectedReplyOnNewFeedComment.newFeedComment.id === eachNewFeedComment.id) {
            eachNewFeedComment.isReplyBoxShown = true;
            isNewFeedCommentFound = true;
            break;
          }
        }
        if (isNewFeedCommentFound) {
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedNewFeed - selected new feed
   * @param newFeedCommentContent - new feed comment content
   */
  public addNewFeedComment(selectedNewFeed: NewFeed, newFeedCommentContent: string): void {
    const newFeedComment = new NewFeedComment();
    newFeedComment.newFeed = selectedNewFeed;
    newFeedComment.newFeedCommentContent = newFeedCommentContent;
    newFeedComment.newFeedCommentCreatedDate = new Date();
    newFeedComment.newFeedCommentStatus = 1;
    newFeedComment.userProfile = this.selectedUserProfile;
    newFeedComment.numberOfLikes = 0;
    newFeedComment.numberOfDislikes = 0;
    this.addNewFeedCommentToServer(newFeedComment);
    selectedNewFeed.numberOfComments += 1;
    // update number of comments of selected newfeed
    this.updateNewFeed(selectedNewFeed);
    if (selectedNewFeed.replies && selectedNewFeed.replies.length) {
      selectedNewFeed.replies.push(newFeedComment);
    }
  }

  /**
   *
   * @param newFeedComment - newfeed's comment that will be added
   */
  private addNewFeedCommentToServer(newFeedComment: NewFeedComment): void {
    const addNewFeedCommentUrl = `${Config.apiBaseUrl}/${Config.apiNewFeedManagementPrefix}/${Config.apiNewFeedComments}`;
    this.newFeedCommentService.addNewFeedComment(addNewFeedCommentUrl, newFeedComment).subscribe();
  }

  /**
   *
   * @param event - selected page
   */
  public newFeedPageChange(event): void {
    this.currentNewFeedsPage = event;
    this.getNewFeeds();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchNewFeed(keyword): void {
    this.newFeedContentKeywords = keyword;
    this.currentNewFeedsPage = 1;
    this.getNewFeeds();
  }

}
