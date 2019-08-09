import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  Post, PostComment, PostCommentReaction, PostRate, PostTag, ReplyOnPostComment, ReplyOnPostCommentReaction,
  ResponseMessage,
  UserProfile
} from '@gw-models/core';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {SharePostService} from '@gw-services/core/shared/post/share-post.service';
import {PostCommentService} from '@gw-services/core/api/post/post-comment.service';
import {PostRateService} from '@gw-services/core/api/post/post-rate.service';
import {ReplyOnPostCommentService} from '@gw-services/core/api/post/reply-on-post-comment.service';
import {PostCommentReactionService} from '@gw-services/core/api/post/post-comment-reaction.service';
import {ReplyOnPostCommentReactionService} from '@gw-services/core/api/post/reply-on-post-comment-reaction.service';
import {PostTagService} from '@gw-services/core/api/post/post-tag.service';
import {ShareTagService} from '@gw-services/core/shared/tag/share-tag.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogDetailComponent implements OnInit {

  // selected post that was chosen by user
  selectedPost: Post;

  // selected post's content
  selectedPostContent: string;

  // check loading component is showing or not
  loading: boolean;

  // review's content
  reviewContent: string;

  // check add review form is showing or not
  isReviewFormShown: boolean;

  // post's feedbacks
  postComments: PostComment[];

  // need to create post's comments temp to load data base on current page
  postCommentsTemp: PostComment[];

  // post's comments per page
  postCommentsPerPage: PostComment[];

  // current page
  currentPage: number;

  // number post's comments per page
  nPostCommentsPerPage: number;

  // total post's comments
  totalPostComments: number;

  // check post's comments list and pagination is showing or not
  isPostCommentsAndPaginationShown: boolean;

  // startIndex to get post's comments per page
  startIndex: number;

  // selected user's profile
  selectedUserProfile: UserProfile;

  // selected post's rate
  selectedPostRateValue: number;

  // selected post's rate
  selectedPostRate: PostRate;

  // tags by post
  tagsByPost: PostTag[];

  @ViewChild('postContainer') postContainer: ElementRef;


  /**
   *
   * @param sharePostService - inject sharePostService
   * @param router - inject router
   * @param postCommentService - inject postCommentService
   * @param notification - inject notification
   * @param shareUserProfileService - inject shareUserProfileService
   * @param postRateService - inject postRateService
   * @param replyOnPostCommentService - inject replyOnPostCommentService
   * @param postCommentReactionService - inject postCommentReactionService
   * @param replyOnPostCommentReactionService - inject replyOnPostCommentReactionService
   * @param postTagService - inject postTagService
   * @param shareTagService - inject shareTagService
   */
  constructor(private sharePostService: SharePostService,
              private router: Router,
              private postCommentService: PostCommentService,
              private notification: NzNotificationService,
              private shareUserProfileService: ShareUserProfileService,
              private postRateService: PostRateService,
              private replyOnPostCommentService: ReplyOnPostCommentService,
              private postCommentReactionService: PostCommentReactionService,
              private replyOnPostCommentReactionService: ReplyOnPostCommentReactionService,
              private postTagService: PostTagService,
              private shareTagService: ShareTagService) {
  }

  ngOnInit() {
    // init data
    this.initData();
    // get selected post
    this.getSelectedPost();
    // get selected user's profile
    this.getSelectedUserProfile();
    // get selected post's rate
    this.getSelectedPostRate();
  }

  /**
   * get selected post
   */
  private getSelectedPost() {
    // show loading component
    this.loading = true;
    this.sharePostService.currentPost
      .subscribe(selectedPost => {
        // show loading component
        this.selectedPost = selectedPost;
        // check selected post existed or not
        this.checkSelectedPostExistedOrNot();
        // get selected's content
        this.selectedPostContent = this.selectedPost.postContent;
        this.postContainer.nativeElement.innerHTML = this.selectedPostContent;
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * check selected post existed or not
   */
  private checkSelectedPostExistedOrNot() {
    console.log(`hello`);
    if (this.selectedPost == null) {
      console.log(`yahoo!!!`);
      // if selectedPost is not existed, redirect to home page
      this.router.navigate(['/blog/home']);
    } else {
      // get selected post's tags
      this.getSelectedTags();
      // get post's comments
      this.getPostCommentsByPost();
    }
  }

  /**
   * get selected tags by post
   */
  private getSelectedTags() {
    // show loading component
    this.loading = true;
    this.postTagService.getTagsByPost(this.selectedPost)
      .subscribe(tags => {
        if (tags) {
          this.tagsByPost = tags;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * toggle add review form
   */
  public toggleAddReviewForm() {
    this.isReviewFormShown = !this.isReviewFormShown;
  }

  /**
   * get post's comments by post
   */
  private getPostCommentsByPost() {
    // show loading component
    this.loading = true;
    // get post's comments
    this.postCommentService.getPostCommentsByPost(this.selectedPost, 1)
      .subscribe(postComments => {
        if (postComments) {
          // check post's comments list and pagination is showing or not
          if (postComments.length > 0) {
            // get post's comments
            this.postComments = postComments;
            // assign all data to post's comments temp the first time
            this.postCommentsTemp = postComments;
            // get total number of post's comments
            this.totalPostComments = this.postCommentsTemp.length;
            // load post's comments per page
            this.loadPostCommentsPerPage();
            //
            this.isPostCommentsAndPaginationShown = true;
          } else {
            this.isPostCommentsAndPaginationShown = false;
            this.postComments = [];
            this.postCommentsTemp = [];
            this.totalPostComments = 0;
            this.postCommentsPerPage = [];
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
  public postCommentsPageChange(event) {
    // set current page
    this.currentPage = event;
    // show loading component
    this.loading = true;
    // load new data
    this.loadPostCommentsPerPage();
  }

  /**
   * init data
   */
  private initData() {
    // init current page
    this.currentPage = 1;
    // init number of post's comments per page
    this.nPostCommentsPerPage = 8;
  }

  /**
   * load post's comments per page
   */
  private loadPostCommentsPerPage() {
    // init startIndex
    this.startIndex = ((this.currentPage - 1) * 8) + 1;
    // get post's comments data per page
    this.postCommentsPerPage = this.postCommentsTemp.slice(this.startIndex - 1, this.startIndex + 7);
    // hide loading component
    this.loading = false;
    // load number of reactions, replies for post's comments per page
    this.loadNumberOfRepliesAndReactions();
    // check which comment that current user liked and disliked
    this.loadPostCommentUserLikedAndDisliked();
  }

  /**
   * add post's comment for selected post
   */
  public addPostReview() {
    // add post's comment
    this.addPostComment();
    // add post's rate
    this.addPostRate();
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
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        }
      });
  }

  /**
   * get selected's post's rate
   */
  private getSelectedPostRate() {
    // show loading component
    this.loading = true;
    // get selected post rate
    this.postRateService.getPostRateByUserIdAndPostId(
      this.selectedUserProfile.id,
      this.selectedPost.id
    )
      .subscribe((selectedPostRate: PostRate) => {
        if (selectedPostRate) {
          this.selectedPostRate = selectedPostRate;
          this.selectedPostRateValue = this.selectedPostRate.rate;
        } else {
          this.selectedPostRateValue = 0;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - handle event when rate change
   */
  public onRateChanged(event) {
    // assign new rating value
    this.selectedPostRateValue = event;
  }

  /**
   * add post's comment
   */
  private addPostComment() {
    // check review's content is empty or not
    if (this.reviewContent.localeCompare('') === 0) {
      // show warning message to user
      this.createNotification('error', 'Error', 'Please input your review\'s content');
    } else {
      // create new post's comment
      const postComment = new PostComment();
      postComment.postCommentContent = this.reviewContent;
      postComment.postCommentCreatedDate = new Date();
      postComment.postCommentStatus = 1;
      postComment.post = this.selectedPost;
      postComment.userProfile = this.selectedUserProfile;
      postComment.nLikes = 0;
      postComment.nDislikes = 0;
      postComment.nReplies = 0;

      // add post's comment client
      this.addNewPostCommentOnClient(postComment);
      // add post's comment to database
      this.addNewPostCommentToServer(postComment);
    }
  }

  /**
   *
   * @param postComment - selected post's comment
   *
   */
  private addNewPostCommentOnClient(postComment: PostComment) {
    // add post's comment
    this.postComments.push(postComment);
    // assign all data to post's comments temp
    this.postCommentsTemp = this.postComments;
    // get total number of post's comments
    this.totalPostComments = this.postCommentsTemp.length;
    // add to current page if have any free space left
    if (this.postCommentsPerPage.length < 8) {
      this.postCommentsPerPage.push(postComment);
    }
  }

  /**
   *
   * @param postComment - post's comment that user want to add to server
   */
  private addNewPostCommentToServer(postComment) {
    this.postCommentService.addPostComment(postComment)
      .subscribe((insertedPostComment: PostComment) => {
        if (insertedPostComment) {
          // assign new post's comment
          this.reviewContent = '';
          // show success notification
          this.createNotification('success', 'Success', 'Thank your for your comment!!!');
        } else {
          // show error notification
          this.createNotification('error', 'Error', 'Cannot submit your comment! Please try again!');
        }
      });
  }

  /**
   * add post's rate
   */
  private addPostRate() {
    // create new post's rate object
    const postRate = new PostRate();
    postRate.rate = this.selectedPostRateValue;
    console.log(`Rate: ${this.selectedPostRateValue}`);
    postRate.post = this.selectedPost;
    postRate.userProfile = this.selectedUserProfile;

    // add to database
    this.postRateService.addPostRate(postRate)
      .subscribe((insertedPostRate: PostRate) => {
        if (insertedPostRate) {
          // assign new post's rate
          this.selectedPostRate = insertedPostRate;
          this.selectedPostRateValue = insertedPostRate.rate;
        }
      });
  }

  /**
   * load number of replies and reactions
   */
  private loadNumberOfRepliesAndReactions() {
    this.postCommentsPerPage.map(eachPostComment => {
      // count number of post's comment replies
      this.replyOnPostCommentService.countNumberOfPostCommentReplies(eachPostComment, 1)
        .subscribe((nReplies: ResponseMessage) => {
          if (nReplies) {
            eachPostComment.nReplies = Number(nReplies.message);
          } else {
            eachPostComment.nReplies = 0;
          }
        });
      // count number of like
      this.postCommentReactionService.countNumberOfPostCommentReactions(eachPostComment, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachPostComment.nLikes = Number(nLikes.message);
          } else {
            eachPostComment.nLikes = 0;
          }
        });
      // count number of dislikes
      this.postCommentReactionService.countNumberOfPostCommentReactions(eachPostComment, 0)
        .subscribe((nDisLikes: ResponseMessage) => {
          if (nDisLikes) {
            eachPostComment.nDislikes = Number(nDisLikes.message);
          } else {
            eachPostComment.nDislikes = 0;
          }
        });
    });
  }

  /**
   * load post's comment that user liked and disliked
   */
  private loadPostCommentUserLikedAndDisliked() {
    this.postCommentReactionService.getPostCommentReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((postCommentReactions: PostCommentReaction[]) => {
        if (postCommentReactions) {
          // show current like and dislike status of current user's profile
          for (const eachPostCommentReaction of postCommentReactions) {
            for (const eachPostComment of this.postCommentsPerPage) {
              if (eachPostCommentReaction.postComment.id === eachPostComment.id) {
                // set flag to check current post comment is reacted or not
                eachPostComment.isReacted = true;
                if (eachPostCommentReaction.reaction === 1) {
                  // show like status
                  eachPostComment.isLikeClicked = true;
                } else if (eachPostCommentReaction.reaction === 0) {
                  // show dislike status
                  eachPostComment.isLikeClicked = false;
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
  public like(selectedComment: PostComment) {
    if (selectedComment.isLikeClicked === true) {
      return;
    }
    if (selectedComment.nDislikes > 0 && selectedComment.isReacted) {
      selectedComment.nDislikes -= 1;
    }
    selectedComment.nLikes += 1;
    selectedComment.isLikeClicked = true;
    selectedComment.isReacted = true;
    // submit new post's comment reaction to database
    this.submitNewPostCommentReaction(selectedComment, 1);
  }

  /**
   *
   * @param selectedComment - selected comment that user wants to dislike
   */
  public dislike(selectedComment: PostComment) {
    if (selectedComment.isLikeClicked === false) {
      return;
    }
    if (selectedComment.nLikes > 0 && selectedComment.isReacted) {
      selectedComment.nLikes -= 1;
    }
    selectedComment.nDislikes += 1;
    selectedComment.isLikeClicked = false;
    selectedComment.isReacted = true;
    // submit new post's comment reaction to database
    this.submitNewPostCommentReaction(selectedComment, 0);
  }

  /**
   *
   * @param selectedComment - selected post's comment
   * @param reactionValue - reaction's value
   */
  private submitNewPostCommentReaction(selectedComment, reactionValue) {
    // create new post's comment reaction object
    const newPostCommentReaction = new PostCommentReaction();
    newPostCommentReaction.postComment = selectedComment;
    newPostCommentReaction.userProfile = this.selectedUserProfile;
    newPostCommentReaction.reaction = reactionValue;
    // submit to the database
    this.postCommentReactionService.addNewPostCommentReaction(newPostCommentReaction)
      .subscribe((insertedPostCommentReaction: PostCommentReaction) => {
        if (insertedPostCommentReaction) {
          console.log(insertedPostCommentReaction);
        }
      });
  }

  /**
   *
   * @param selectedComment - selected post's comment that user want to view replies
   */
  public viewRepliesOfSelectedPostComment(selectedComment) {
    if (!selectedComment.replies) {
      this.replyOnPostCommentService.getRepliesOnSelectedPostComment(selectedComment, 1)
        .subscribe((repliesOnPostComment: ReplyOnPostComment[]) => {
          if (repliesOnPostComment) {
            selectedComment.replies = repliesOnPostComment;
            // load number of likes and dislikes of replies on post's comment
            this.loadNumberOfReplyOnPostCommentReactions(selectedComment);
            // check which reply on post's comment that current user liked and disliked
            this.loadReplyOnPostCommentUserLikedAndDisliked(selectedComment);
          }
        });
    }
  }

  /**
   *
   * @param selectedComment - selected comment that user want to load number of reply's reactions
   */
  private loadNumberOfReplyOnPostCommentReactions(selectedComment: any) {
    for (const eachReplyOnPostComment of selectedComment.replies) {
      // count number of likes
      this.replyOnPostCommentReactionService.countNumberOfReplyOnPostCommentReaction(eachReplyOnPostComment, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachReplyOnPostComment.nLikes = Number(nLikes.message);
          } else {
            eachReplyOnPostComment.nLikes = 0;
          }
        });
      // count number dislikes
      this.replyOnPostCommentReactionService.countNumberOfReplyOnPostCommentReaction(eachReplyOnPostComment, 0)
        .subscribe((nDislikes: ResponseMessage) => {
          if (nDislikes) {
            eachReplyOnPostComment.nDislikes = Number(nDislikes.message);
          } else {
            eachReplyOnPostComment.nDislikes = 0;
          }
        });
    }
  }

  /**
   * check which reply on post's comment that current user liked and disliked
   */
  private loadReplyOnPostCommentUserLikedAndDisliked(selectedComment) {
    this.replyOnPostCommentReactionService.getReplyOnPostCommentReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((replyOnPostCommentReactions: ReplyOnPostCommentReaction[]) => {
        if (replyOnPostCommentReactions) {
          // show current like and dislike status of current user's profile
          for (const eachReplyOnPostCommentReaction of replyOnPostCommentReactions) {
            for (const eachReplyOnPostComment of selectedComment.replies) {
              // set flag to check user has reacted to this reply on post comment
              eachReplyOnPostComment.isReacted = true;
              if (eachReplyOnPostCommentReaction.replyOnPostComment.id === eachReplyOnPostComment.id) {
                if (eachReplyOnPostCommentReaction.reaction === 1) {
                  eachReplyOnPostComment.isLikeClicked = true;
                } else if (eachReplyOnPostCommentReaction.reaction === 0) {
                  eachReplyOnPostComment.isLikeClicked = false;
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
   * @param selectedReplyOnPostComment - selectedReplyOnPostComment
   */
  public likeReplyOnPostComment(selectedReplyOnPostComment: ReplyOnPostComment) {
    if (selectedReplyOnPostComment.isLikeClicked === true) {
      return;
    }
    if (selectedReplyOnPostComment.nDislikes > 0 && selectedReplyOnPostComment.isReacted) {
      selectedReplyOnPostComment.nDislikes -= 1;
    }
    selectedReplyOnPostComment.nLikes += 1;
    selectedReplyOnPostComment.isLikeClicked = true;
    selectedReplyOnPostComment.isReacted = true;
    // submit new reply on post's comment reaction to database
    this.submitNewReplyPostCommentReaction(selectedReplyOnPostComment, 1);
  }

  /**
   *
   * @param selectedReplyOnPostComment - selectedReplyOnPostComment
   */
  public dislikeReplyOnPostComment(selectedReplyOnPostComment: ReplyOnPostComment) {
    if (selectedReplyOnPostComment.isLikeClicked === false) {
      return;
    }
    if (selectedReplyOnPostComment.nLikes > 0 && selectedReplyOnPostComment.isReacted) {
      selectedReplyOnPostComment.nLikes -= 1;
    }
    selectedReplyOnPostComment.nDislikes += 1;
    selectedReplyOnPostComment.isLikeClicked = false;
    selectedReplyOnPostComment.isReacted = true;
    // submit new reply on post's comment reaction to database
    this.submitNewReplyPostCommentReaction(selectedReplyOnPostComment, 0);
  }

  /**
   *
   * @param selectedReplyOnPostComment - selected reply on post's comment
   * @param reactionValue - reaction's value
   */
  private submitNewReplyPostCommentReaction(selectedReplyOnPostComment, reactionValue) {
    // create new reply on post's comment reaction object
    const newReplyOnPostCommentReaction = new ReplyOnPostCommentReaction();
    newReplyOnPostCommentReaction.replyOnPostComment = selectedReplyOnPostComment;
    newReplyOnPostCommentReaction.userProfile = this.selectedUserProfile;
    newReplyOnPostCommentReaction.reaction = reactionValue;
    // submit to the database
    this.replyOnPostCommentReactionService.addNewReplyOnPostCommentReaction(newReplyOnPostCommentReaction)
      .subscribe((insertedReplyOnPostCommentReaction: ReplyOnPostCommentReaction) => {
        if (insertedReplyOnPostCommentReaction) {
          console.log(insertedReplyOnPostCommentReaction);
        }
      });
  }

  /**
   *
   * @param selectedComment - selected comment that user want to reply
   */
  public showReplyPostCommentBox(selectedComment) {
    selectedComment.isReplyBoxShown = true;
  }

  public showReplyReplyPostCommentBox(selectedReplyComment) {
    // find post's comment and show reply box
    for (const eachPostComment of this.postCommentsPerPage) {
      if (selectedReplyComment.postComment.id === eachPostComment.id) {
        eachPostComment.isReplyBoxShown = true;
        break;
      }
    }
  }

  /**
   *
   * @param replyContent - reply's content
   * @param selectedComment - selectedComment
   */
  public replyToPostComment(selectedComment, replyContent) {
    // create new reply on post's comment
    const newReplyOnPostComment = new ReplyOnPostComment();
    newReplyOnPostComment.replyOnPostCommentContent = replyContent;
    newReplyOnPostComment.replyOnPostCommentStatus = 1;
    newReplyOnPostComment.replyOnPostCommentCreatedDate = new Date();
    newReplyOnPostComment.postComment = selectedComment;
    newReplyOnPostComment.userProfile = this.selectedUserProfile;
    newReplyOnPostComment.nLikes = 0;
    newReplyOnPostComment.nDislikes = 0;

    // add new reply on post's comment to the server
    this.replyOnPostCommentService.addReplyOnPostComment(newReplyOnPostComment)
      .subscribe((insertedReplyOnPostComment: ReplyOnPostComment) => {
        if (insertedReplyOnPostComment) {
          console.log(insertedReplyOnPostComment);
        }
      });

    // add new reply on client
    if (selectedComment.replies && selectedComment.replies.length) {
      selectedComment.replies.push(newReplyOnPostComment);
    }
    selectedComment.nReplies += 1;
  }

  /**
   *
   * @param selectedTag - selected tag that user want to view post
   */
  public goToPostsByTag(selectedTag) {
    // share tag
    this.shareTagService.changeTag(selectedTag);
    // go to posts by tag component
    this.router.navigate([`/blog/tag/${selectedTag.tagName.toLowerCase()}`]);
  }
}
