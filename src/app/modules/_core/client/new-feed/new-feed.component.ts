import {Component, OnInit} from '@angular/core';
import {
  NewFeed,
  NewFeedComment,
  NewFeedCommentReaction,
  NewFeedReaction, ReplyOnNewFeedComment, ReplyOnNewFeedCommentReaction,
  ResponseMessage,
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

  // list of new feeds
  newFeeds: NewFeed[];

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // search value - return new feeds and change pagination based on keywords
  searchValue: string;

  // number new feeds per page
  nNewFeedsPerPage: number;

  // total new feeds
  totalNewFeeds: number;

  // user's profile
  selectedUserProfile: UserProfile;


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
  ngOnInit() {
    // init number of new feeds per page
    this.nNewFeedsPerPage = 8;
    // init current search value
    this.searchValue = '';
    // get selected user's profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  public getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // get total number of new feeds
          this.getNumberOfNewFeeds();
          // get new feeds by page
          this.getNewFeedsByPage();
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get new feeds by current's page
   */
  private getNewFeedsByPage() {
    // create url to get new feeds by current page
    let currentGetNewFeedsByStatusAndByPageUrl = `${Config.api}/${Config.apiGetNewFeedsdByStatusAndByPage}/1/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNewFeedsByStatusAndByPageUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // show loading component
    this.loading = true;
    // get new feeds by page and keywords (if existed)
    this.newFeedService.getNewFeedsByStatusAndByPage(currentGetNewFeedsByStatusAndByPageUrl)
      .subscribe((newFeeds: NewFeed[]) => {
        if (newFeeds) {
          console.log(newFeeds);
          this.newFeeds = [];
          // assign data to newFeeds
          this.newFeeds = newFeeds;
          // load number of replies and reactions (how many replies, how many likee and how many dislikes)
          this.loadNumberOfRepliesAndReactions();
          // load which new feeds that user liked or disliked
          this.loadNewFeedsUserLikedOrDisliked();
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * load number of replies and reactions
   */
  private loadNumberOfRepliesAndReactions() {
    // get each new feed and find number of replies and number of reactions (likes and dislikes)
    this.newFeeds.map(eachNewFeed => {
      // count number of likes
      this.newFeedReactionService.countNumberOfNewFeedReactions(eachNewFeed, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachNewFeed.nLikes = Number(nLikes.message);
          } else {
            eachNewFeed.nLikes = 0;
          }
        });
      // count number of dislikes
      this.newFeedReactionService.countNumberOfNewFeedReactions(eachNewFeed, 0)
        .subscribe((nDisLikes: ResponseMessage) => {
          if (nDisLikes) {
            eachNewFeed.nDislikes = Number(nDisLikes.message);
          } else {
            eachNewFeed.nDislikes = 0;
          }
        });
      // count number of new feed comments
      this.newFeedCommentService.countNumberOfNewFeedCommentsByNewFeedAndByStatus(eachNewFeed, 1)
        .subscribe((nReplies: ResponseMessage) => {
          if (nReplies) {
            eachNewFeed.nReplies = Number(nReplies.message);
          } else {
            eachNewFeed.nReplies = 0;
          }
        });
    });
  }

  /**
   * load new feeds user liked or disliked
   */
  private loadNewFeedsUserLikedOrDisliked() {
    console.log(`Selected User Profile: `);
    console.log(this.selectedUserProfile);
    this.newFeedReactionService.getNewFeedReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((newFeedReactions: NewFeedReaction[]) => {
        if (newFeedReactions) {
          for (const eachNewFeedReaction of newFeedReactions) {
            for (const eachNewFeed of this.newFeeds) {
              if (eachNewFeedReaction.newFeed.id === eachNewFeed.id) {
                eachNewFeed.isLikeClicked = eachNewFeedReaction.reaction === 1;
                break;
              }
            }
          }
        }
      });
  }

  /**
   *
   * @param selectedNewFeed - new feed that user want to like
   */
  likeNewFeed(selectedNewFeed: NewFeed) {
    if (selectedNewFeed.isLikeClicked) {
      return;
    }
    if (selectedNewFeed.nDislikes > 0) {
      selectedNewFeed.nDislikes -= 1;
    }
    selectedNewFeed.nLikes += 1;
    selectedNewFeed.isLikeClicked = true;
    // submit new feed reaction to database server
    this.submitNewFeedReactionToServer(selectedNewFeed, 1);
  }

  /**
   *
   * @param selectedNewFeed - new feed that user want to dislike
   */
  dislikeNewFeed(selectedNewFeed: NewFeed) {
    if (!selectedNewFeed.isLikeClicked) {
      return;
    }
    if (selectedNewFeed.nLikes > 0) {
      selectedNewFeed.nLikes -= 1;
    }
    selectedNewFeed.nDislikes += 1;
    selectedNewFeed.isLikeClicked = false;
    // submit new feed reaction to database server
    this.submitNewFeedReactionToServer(selectedNewFeed, 0);
  }

  /**
   *
   * @param selectedNewFeed - selected new feed
   * @param reactionValue - reaction value that user react to selected new feed
   */
  private submitNewFeedReactionToServer(selectedNewFeed: NewFeed, reactionValue: number) {
    // create new feed reaction object
    const newFeedReaction = new NewFeedReaction();
    newFeedReaction.reaction = reactionValue;
    newFeedReaction.newFeed = selectedNewFeed;
    newFeedReaction.userProfile = this.selectedUserProfile;
    // submit new feed reaction to server
    this.newFeedReactionService.addNewFeedReaction(newFeedReaction)
      .subscribe((insertedNewFeedReaction: NewFeedReaction) => {
        if (insertedNewFeedReaction) {
          console.log(insertedNewFeedReaction);
        }
      });
  }

  /**
   *
   * @param selectedNewFeed - new feed that user want to new feed
   */
  public viewNewFeedCommentsOfSelectedNewFeed(selectedNewFeed: NewFeed) {
    if (!selectedNewFeed.replies) {
      // show add new feed comment box
      selectedNewFeed.isReplyBoxShown = true;
      //  get new feed comment by selected new feed and status
      this.newFeedCommentService.getNewFeedCommentsByNewFeedAndStatus(selectedNewFeed, 1)
        .subscribe((newFeedComments: NewFeedComment[]) => {
          if (newFeedComments) {
            selectedNewFeed.replies = newFeedComments;
            // load number of likes and dislikes of new feed comment
            this.loadNumberOfRepliesAndReactionsOfSelectedNewFeedComment(selectedNewFeed);
            // check which reply on product's feedback that current user liked and disliked
            this.loadNewFeedCommentUserLikedAndDisliked(selectedNewFeed);
          }
        });
    }
  }

  /**
   *
   * @param selectedNewFeed - selected new feed
   */
  private loadNumberOfRepliesAndReactionsOfSelectedNewFeedComment(selectedNewFeed) {
    selectedNewFeed.replies.map(eachNewFeedComment => {
      // count number of likes
      this.newFeedCommentReactionService.countNumberOfNewFeedCommentReactionsByNewFeedCommentAndReaction(eachNewFeedComment, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachNewFeedComment.nLikes = Number(nLikes.message);
          } else {
            eachNewFeedComment.nLikes = 0;
          }
        });
      // count number of dislikes
      this.newFeedCommentReactionService.countNumberOfNewFeedCommentReactionsByNewFeedCommentAndReaction(eachNewFeedComment, 0)
        .subscribe((nDisLike: ResponseMessage) => {
          if (nDisLike) {
            eachNewFeedComment.nDislikes = Number(nDisLike.message);
          } else {
            eachNewFeedComment.nDislikes = 0;
          }
        });
      // count number of replies
      this.replyOnNewFeedCommentService.countNumberOfRepliesOnNewFeedCommentByNewFeedCommentAndStatus(eachNewFeedComment, 1)
        .subscribe((nReplies: ResponseMessage) => {
          if (nReplies) {
            eachNewFeedComment.nReplies = Number(nReplies.message);
          } else {
            eachNewFeedComment.nReplies = 0;
          }
        });
    });
  }

  /**
   *
   * @param selectedNewFeed - selected new feed
   */
  private loadNewFeedCommentUserLikedAndDisliked(selectedNewFeed) {
    this.newFeedCommentReactionService.getNewFeedCommentReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((newFeedCommentReactions: NewFeedCommentReaction[]) => {
        if (newFeedCommentReactions) {
          for (const eachNewFeedCommentReaction of newFeedCommentReactions) {
            for (const eachNewFeedComment of selectedNewFeed.replies) {
              if (eachNewFeedCommentReaction.newFeedComment.id === eachNewFeedComment.id) {
                eachNewFeedComment.isLikeClicked = eachNewFeedCommentReaction.reaction === 1;
              }
            }
          }
        }
      });
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   */
  public likeNewFeedComment(selectedNewFeedComment: NewFeedComment) {
    if (selectedNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedNewFeedComment.nDislikes > 0) {
      selectedNewFeedComment.nDislikes -= 1;
    }
    selectedNewFeedComment.nLikes += 1;
    selectedNewFeedComment.isLikeClicked = true;
    // submit new feed comment reaction to database server
    this.submitNewFeedCommentReactionToServer(selectedNewFeedComment, 1);
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   */
  public dislikeNewFeedComment(selectedNewFeedComment: NewFeedComment) {
    if (!selectedNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedNewFeedComment.nLikes > 0) {
      selectedNewFeedComment.nLikes -= 1;
    }
    selectedNewFeedComment.nDislikes += 1;
    selectedNewFeedComment.isLikeClicked = true;
    // submit new feed comment reaction to database server
    this.submitNewFeedCommentReactionToServer(selectedNewFeedComment, 0);
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   * @param reactionValue - reaction value
   */
  private submitNewFeedCommentReactionToServer(selectedNewFeedComment: NewFeedComment, reactionValue: number) {
    // create new feed comment reaction object
    const newFeedCommentReaction = new NewFeedCommentReaction();
    newFeedCommentReaction.reaction = reactionValue;
    newFeedCommentReaction.newFeedComment = selectedNewFeedComment;
    newFeedCommentReaction.userProfile = this.selectedUserProfile;
    this.newFeedCommentReactionService.addNewFeedCommentReaction(newFeedCommentReaction)
      .subscribe((insertedNewFeedCommentReaction: NewFeedCommentReaction) => {
        if (insertedNewFeedCommentReaction) {
          console.log(insertedNewFeedCommentReaction);
        }
      });
  }

  /**
   *
   * @param selectedNewFeedComment - selected new's feed's comment
   */
  public showReplyNewFeedCommentBox(selectedNewFeedComment: NewFeedComment) {
    // find new feed comment and show reply box
    selectedNewFeedComment.isReplyBoxShown = true;
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   * @param replyNewFeedCommentContent = reply new feed comment content
   */
  public replyToNewFeedComment(selectedNewFeedComment: NewFeedComment, replyNewFeedCommentContent: string) {
    // create new reply on new feed comment object
    const replyOnNewFeedComment = new ReplyOnNewFeedComment();
    replyOnNewFeedComment.newFeedComment = selectedNewFeedComment;
    replyOnNewFeedComment.replyOnNewFeedCommentContent = replyNewFeedCommentContent;
    replyOnNewFeedComment.replyOnNewFeedCommentStatus = 1;
    replyOnNewFeedComment.replyOnNewFeedCommentCreatedDate = new Date();
    replyOnNewFeedComment.userProfile = this.selectedUserProfile;
    replyOnNewFeedComment.nLikes = 0;
    replyOnNewFeedComment.nDislikes = 0;

    this.replyOnNewFeedCommentService.addReplyOnNewFeedComment(replyOnNewFeedComment)
      .subscribe((insertedReplyOnNewFeedComment: ReplyOnNewFeedComment) => {
        if (insertedReplyOnNewFeedComment) {
          console.log(insertedReplyOnNewFeedComment);
        }
      });

    if (selectedNewFeedComment.replies && selectedNewFeedComment.replies.length) {
      selectedNewFeedComment.replies.push(replyOnNewFeedComment);
    }
    selectedNewFeedComment.nReplies += 1;
  }

  /**
   *
   * @param selectedNewFeedComment - selected new's feed's comment
   */
  public viewRepliesOfSelectedNewFeedComment(selectedNewFeedComment: NewFeedComment) {
    if (!selectedNewFeedComment.replies) {
      this.replyOnNewFeedCommentService.getRepliesOnNewFeedCommentByNewFeedCommentAndStatus(selectedNewFeedComment, 1)
        .subscribe((repliesOnNewFeedComment: ReplyOnNewFeedComment[]) => {
          if (repliesOnNewFeedComment) {
            selectedNewFeedComment.replies = repliesOnNewFeedComment;
            // load number of likes and dislikes of replies on new feed comment
            this.loadNumberOfReplyOnNewFeedCommentReactions(selectedNewFeedComment);
            // check which reply on product's feedback that current user liked and disliked
            this.loadRepliesOnNewFeedCommentUserLikedAndDisliked(selectedNewFeedComment);
          }
        });
    }
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   */
  private loadNumberOfReplyOnNewFeedCommentReactions(selectedNewFeedComment: NewFeedComment) {
    selectedNewFeedComment.replies.map(replyOnNewFeedComment => {
      // count number of likes
      this.replyOnNewFeedCommentReactionService.countNumberOfNewFeedCommentReactionsByReplyOnNewFeedCommentAndReaction(
        replyOnNewFeedComment,
        1
      )
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            replyOnNewFeedComment.nLikes = Number(nLikes.message);
          } else {
            replyOnNewFeedComment.nLikes = 0;
          }
        });

      // count number of dislikes
      this.replyOnNewFeedCommentReactionService.countNumberOfNewFeedCommentReactionsByReplyOnNewFeedCommentAndReaction(
        replyOnNewFeedComment,
        0
      )
        .subscribe((nDisLikes: ResponseMessage) => {
          if (nDisLikes) {
            replyOnNewFeedComment.nDislikes = Number(nDisLikes.message);
          } else {
            replyOnNewFeedComment.nDislikes = 0;
          }
        });
    });
  }

  /**
   *
   * @param selectedNewFeedComment - selected new feed comment
   */
  private loadRepliesOnNewFeedCommentUserLikedAndDisliked(selectedNewFeedComment: NewFeedComment) {
    this.replyOnNewFeedCommentReactionService.getReplyOnNewFeedCommentReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((replyOnNewFeedCommentReactions: ReplyOnNewFeedCommentReaction[]) => {
        if (replyOnNewFeedCommentReactions) {
          for (const eachReplyOnNewFeedCommentReaction of replyOnNewFeedCommentReactions) {
            for (const eachReplyOnNewFeedComment of selectedNewFeedComment.replies) {
              if (eachReplyOnNewFeedCommentReaction.replyOnNewFeedComment.id === eachReplyOnNewFeedComment.id) {
                eachReplyOnNewFeedComment.isLikeClicked = eachReplyOnNewFeedCommentReaction.reaction === 1;
                break;
              }
            }
          }
        }
      });
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment
   */
  public likeReplyOnNewFeedComment(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment) {
    if (selectedReplyOnNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedReplyOnNewFeedComment.nDislikes > 0) {
      selectedReplyOnNewFeedComment.nDislikes -= 1;
    }
    selectedReplyOnNewFeedComment.nLikes += 1;
    selectedReplyOnNewFeedComment.isLikeClicked = true;
    // submit reply on new feed comment reaction to database server
    this.submitReplyOnNewFeedCommentReactionToServer(selectedReplyOnNewFeedComment, 1);
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment
   */
  public dislikeReplyOnNewFeedComment(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment) {
    if (!selectedReplyOnNewFeedComment.isLikeClicked) {
      return;
    }
    if (selectedReplyOnNewFeedComment.nLikes > 0) {
      selectedReplyOnNewFeedComment.nLikes -= 1;
    }
    selectedReplyOnNewFeedComment.nDislikes += 1;
    selectedReplyOnNewFeedComment.isLikeClicked = false;
    // submit reply on new feed comment reaction to database server
    this.submitReplyOnNewFeedCommentReactionToServer(selectedReplyOnNewFeedComment, 0);
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment
   * @param reactionValue - reaction value
   */
  private submitReplyOnNewFeedCommentReactionToServer(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment, reactionValue: number) {
    // create reply on new feed comment reaction object
    const replyOnNewFeedCommentReaction = new ReplyOnNewFeedCommentReaction();
    replyOnNewFeedCommentReaction.reaction = reactionValue;
    replyOnNewFeedCommentReaction.replyOnNewFeedComment = selectedReplyOnNewFeedComment;
    replyOnNewFeedCommentReaction.userProfile = this.selectedUserProfile;

    // add replyOnNewFeedCommentReaction to server
    this.replyOnNewFeedCommentReactionService.addReplyOnNewFeedCommentReaction(replyOnNewFeedCommentReaction)
      .subscribe((insertedNewFeedCommentReaction: ReplyOnNewFeedCommentReaction) => {
        if (insertedNewFeedCommentReaction) {
          console.log(insertedNewFeedCommentReaction);
        }
      });
  }

  /**
   *
   * @param selectedReplyOnNewFeedComment - selected reply on new feed comment
   */
  public showReplyRelyNewFeedCommentBox(selectedReplyOnNewFeedComment: ReplyOnNewFeedComment) {
    // check new feed comment is found or not
    let isNewFeedCommentFound = false;
    // find new feed comment and show reply box
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
  public addNewFeedComment(selectedNewFeed: NewFeed, newFeedCommentContent: string) {
    // create new feed comment object
    const newFeedComment = new NewFeedComment();
    newFeedComment.newFeed = selectedNewFeed;
    newFeedComment.newFeedCommentContent = newFeedCommentContent;
    newFeedComment.newFeedCommentCreatedDate = new Date();
    newFeedComment.newFeedCommentStatus = 1;
    newFeedComment.userProfile = this.selectedUserProfile;
    newFeedComment.nLikes = 0;
    newFeedComment.nDislikes = 0;

    // add new feed comment to the server
    this.addNewFeedCommentToServer(newFeedComment);

    // add new feed comment to selected new feed
    if (selectedNewFeed.replies && selectedNewFeed.replies.length) {
      selectedNewFeed.replies.push(newFeedComment);
    }
    selectedNewFeed.nReplies += 1;
  }

  /**
   * add new feed comment to server
   */
  private addNewFeedCommentToServer(newFeedComment: NewFeedComment) {
    this.newFeedCommentService.addNewFeedComment(newFeedComment)
      .subscribe((insertedNewFeedComment: NewFeedComment) => {
        if (insertedNewFeedComment) {
          console.log(insertedNewFeedComment);
        }
      });
  }

  /**
   *
   * @param event - selected page
   */
  public newFeedPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get newfeeds by page
    this.getNewFeedsByPage();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchNewFeed(keyword) {
    // set current search keyword - user-account search newfeeds by user's name and change pagination based on keyword
    this.searchValue = keyword;
    // reset current page
    this.currentPage = 1;
    // change pagination
    this.getNumberOfNewFeeds();
    this.getNewFeedsByPage();
  }

  /**
   * get total number of new feeds
   */
  private getNumberOfNewFeeds() {
    // create url to get total number of new feeds
    let currentGetNumberOfNewFeedsByStatusUrl = `${Config.api}/${Config.apiGetNumberOfNewFeedsByStatus}/1`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfNewFeedsByStatusUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // showing loading component
    this.loading = true;
    // get total number of newfeeds
    this.newFeedService.getNumberOfNewFeedsByStatus(currentGetNumberOfNewFeedsByStatusUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          // assign total number of galleries to totalGallery
          this.totalNewFeeds = Number(responseMessage.message);
        }
      });
  }

}
