import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  Post, PostComment, PostCommentReaction, PostRate, PostTag, ReplyOnPostComment, ReplyOnPostCommentReaction, Tag,
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
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogDetailComponent implements OnInit {
  selectedPost: Post;
  isLoadingSpinnerShown: boolean;
  postReviewContent: string;
  isPostReviewFormShown: boolean;
  postComments: PostComment[];
  postCommentsTemp: PostComment[];
  postCommentsPerPage: PostComment[];
  currentPostCommentsPage: number;
  nPostCommentsPerPage: number;
  totalPostComments: number;
  selectedUserProfile: UserProfile;
  selectedPostRateValue: number;
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

  ngOnInit(): void {
    this.initData();
    this.getSelectedPost();
  }

  /**
   * get selected post
   */
  private getSelectedPost(): void {
    this.isLoadingSpinnerShown = true;
    this.sharePostService.currentPost
      .subscribe(selectedPost => {
        if (selectedPost) {
          this.selectedPost = selectedPost;
          this.postContainer.nativeElement.innerHTML = this.selectedPost.postContent;
          this.isLoadingSpinnerShown = false;
          this.getSelectedUserProfile();
          this.getSelectedTagsByPost();
          this.getPostCommentsByPost();
        } else {
          this.router.navigate(['/blog/home']);
        }
      });
  }

  /**
   * init data
   */
  private initData(): void {
    this.currentPostCommentsPage = Config.currentPage;
    this.nPostCommentsPerPage = Config.numberItemsPerPage;
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getSelectedPostRate();
        } else {
          this.router.navigate(['/blog/home']);
        }
      });
  }

  /**
   * get selected's post's rate
   */
  private getSelectedPostRate(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedPostId = this.selectedPost.id;
    const getPostRateUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiPosts}/
${selectedPostId}/
${Config.apiPostRates}`;
    this.postRateService.getPostRate(getPostRateUrl)
      .subscribe((selectedPostRate: PostRate) => {
        if (selectedPostRate) {
          this.selectedPostRateValue = selectedPostRate.rate;
        } else {
          this.selectedPostRateValue = 0;
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected tags by post
   */
  private getSelectedTagsByPost(): void {
    this.isLoadingSpinnerShown = true;
    const selectedPostId = this.selectedPost.id;
    const tagStatus = 1;
    const getTagsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPosts}/
${selectedPostId}/
${Config.apiTags}?
${Config.tagStatusParameter}=${tagStatus}`;
    this.postTagService.getPostTags(getTagsUrl)
      .subscribe(response => {
        this.tagsByPost = response.body;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get post's comments by post
   */
  private getPostCommentsByPost(): void {
    this.isLoadingSpinnerShown = true;
    const selectedPostId = this.selectedPost.id;
    const postCommentStatus = 1;
    const getPostCommentsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPosts}/
${selectedPostId}/
${Config.apiPostComments}?
${Config.statusParameter}=${postCommentStatus}`;
    this.postCommentService.getPostComments(getPostCommentsUrl)
      .subscribe((postComments: PostComment[]) => {
        if (postComments && postComments.length > 0) {
          this.postComments = postComments;
          this.postCommentsTemp = postComments;
          this.totalPostComments = this.postCommentsTemp.length;
          this.getPostCommentsPerPage();
        } else {
          this.postComments = [];
          this.postCommentsTemp = [];
          this.totalPostComments = 0;
          this.postCommentsPerPage = [];
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get post's comments per page
   */
  private getPostCommentsPerPage(): void {
    const startIndex = ((this.currentPostCommentsPage - 1) * 8) + 1;
    this.postCommentsPerPage = this.postCommentsTemp.slice(startIndex - 1, startIndex + 7);
    this.isLoadingSpinnerShown = false;
    this.getPostCommentReactionsByUser();
  }

  /**
   * get reactions of post's comments. Therefore, we can know which post's comment user liked and disliked
   */
  private getPostCommentReactionsByUser(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const postCommentReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiPostCommentReactions}`;
    this.postCommentReactionService.getPostCommentReactions(postCommentReactionsUrl)
      .subscribe((postCommentReactions: PostCommentReaction[]) => {
        if (postCommentReactions) {
          this.showPostCommentsUserLikedDisliked(postCommentReactions);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param postCommentReactions - post's comment that user liked or disliked
   */
  private showPostCommentsUserLikedDisliked(postCommentReactions: PostCommentReaction[]): void {
    for (const eachPostCommentReaction of postCommentReactions) {
      for (const eachPostComment of this.postCommentsPerPage) {
        if (eachPostCommentReaction.postComment.id === eachPostComment.id) {
          this.changePostCommentReactionStatus(eachPostComment, eachPostCommentReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedPostComment - selected post's comment that its reaction's status will be changed
   * @param selectedPostCommentReaction - reaction's value that user has reacted to selected post's comment
   */
  private changePostCommentReactionStatus(selectedPostComment: PostComment, selectedPostCommentReaction: PostCommentReaction): void {
    selectedPostComment.isReacted = true;
    if (selectedPostCommentReaction.reaction === 1) {
      selectedPostComment.isLikeClicked = true;
    } else if (selectedPostCommentReaction.reaction === 0) {
      selectedPostComment.isLikeClicked = false;
    }
  }

  /**
   *
   * @param event - current's page
   */
  public postCommentsPageChange(event): void {
    this.currentPostCommentsPage = event;
    this.isLoadingSpinnerShown = true;
    this.getPostCommentsPerPage();
  }

  /**
   * toggle add review form
   */
  public toggleAddReviewForm(): void {
    this.isPostReviewFormShown = !this.isPostReviewFormShown;
  }

  /**
   * add post's comment for selected post
   */
  public addPostReview() {
    this.addPostComment();
    this.addPostRate();
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string): void {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   *
   * @param event - handle event when rate change
   */
  public onRateChanged(event): void {
    this.selectedPostRateValue = event;
  }

  /**
   * add post's comment
   */
  private addPostComment(): void {
    if (this.postReviewContent.localeCompare('') === 0) {
      this.createNotification('error', 'Error', 'Please input your review\'s content');
    } else {
      const postComment = new PostComment();
      postComment.postCommentContent = this.postReviewContent;
      postComment.postCommentCreatedDate = new Date();
      postComment.postCommentStatus = 1;
      postComment.post = this.selectedPost;
      postComment.userProfile = this.selectedUserProfile;
      postComment.numberOfLikes = 0;
      postComment.numberOfDislikes = 0;
      postComment.numberOfReplies = 0;
      this.addNewPostCommentOnClient(postComment);
      this.addNewPostCommentToServer(postComment);
    }
  }

  /**
   *
   * @param postComment - post's comment that will be add on client page
   *
   */
  private addNewPostCommentOnClient(postComment: PostComment): void {
    this.postComments.push(postComment);
    this.postCommentsTemp = this.postComments;
    this.totalPostComments = this.postCommentsTemp.length;
    if (this.postCommentsPerPage.length < 8) {
      this.postCommentsPerPage.push(postComment);
    }
  }

  /**
   *
   * @param postComment - post's comment that will be added to server
   */
  private addNewPostCommentToServer(postComment: PostComment): void {
    const addPostCommentUrl = `${Config.apiBaseUrl}/${Config.apiPostManagementPrefix}/${Config.apiPostComments}`;
    this.postCommentService.addPostComment(addPostCommentUrl, postComment)
      .subscribe((insertedPostComment: PostComment) => {
        if (insertedPostComment) {
          this.postReviewContent = '';
          this.createNotification('success', 'Success', 'Thank your for your comment!!!');
        } else {
          this.createNotification('error', 'Error', 'Cannot submit your comment! Please try again!');
        }
      });
  }

  /**
   * add post's rate
   */
  private addPostRate(): void {
    const postRate = new PostRate();
    postRate.rate = this.selectedPostRateValue;
    postRate.post = this.selectedPost;
    postRate.userProfile = this.selectedUserProfile;
    const addPostRateUrl = `${Config.apiBaseUrl}/${Config.apiPostManagementPrefix}/${Config.apiPostRates}`;
    this.postRateService.addPostRate(addPostRateUrl, postRate)
      .subscribe((insertedPostRate: PostRate) => {
        if (insertedPostRate) {
          this.selectedPostRateValue = insertedPostRate.rate;
        }
      });
  }

  /**
   *
   * @param selectedPostComment - selected comment that user wants to like
   */
  public like(selectedPostComment: PostComment): void {
    if (selectedPostComment.isLikeClicked === true) {
      return;
    }
    if (selectedPostComment.numberOfDislikes > 0 && selectedPostComment.isReacted) {
      selectedPostComment.numberOfDislikes -= 1;
    }
    selectedPostComment.numberOfLikes += 1;
    selectedPostComment.isLikeClicked = true;
    selectedPostComment.isReacted = true;
    // update number of likes of selected post's comment
    this.updatePostComment(selectedPostComment);
    this.submitNewPostCommentReaction(selectedPostComment, 1);
  }

  /**
   *
   * @param selectedPostComment - selected comment that user wants to dislike
   */
  public dislike(selectedPostComment: PostComment): void {
    if (selectedPostComment.isLikeClicked === false) {
      return;
    }
    if (selectedPostComment.numberOfLikes > 0 && selectedPostComment.isReacted) {
      selectedPostComment.numberOfLikes -= 1;
    }
    selectedPostComment.numberOfDislikes += 1;
    selectedPostComment.isLikeClicked = false;
    selectedPostComment.isReacted = true;
    // update number of dislikes of selected post's comment
    this.updatePostComment(selectedPostComment);
    this.submitNewPostCommentReaction(selectedPostComment, 0);
  }

  /**
   *
   * @param selectedPostComment - selected post's comment that will be updated
   */
  private updatePostComment(selectedPostComment: PostComment): void {
    const updatePostCommentUrl = `${Config.apiBaseUrl}/${Config.apiPostManagementPrefix}/${Config.apiPostComments}`;
    this.postCommentService.updatePostComment(updatePostCommentUrl, selectedPostComment)
      .subscribe();
  }

  /**
   *
   * @param selectedPostComment - selected post's comment
   * @param reactionValue - reaction's value
   */
  private submitNewPostCommentReaction(selectedPostComment: PostComment, reactionValue: number): void {
    const newPostCommentReaction = new PostCommentReaction();
    newPostCommentReaction.postComment = selectedPostComment;
    newPostCommentReaction.userProfile = this.selectedUserProfile;
    newPostCommentReaction.reaction = reactionValue;
    const addPostCommentReactionUrl = `${Config.apiBaseUrl}/${Config.apiPostManagementPrefix}/${Config.apiPostCommentReactions}`;
    this.postCommentReactionService.addNewPostCommentReaction(addPostCommentReactionUrl, newPostCommentReaction).subscribe();
  }

  /**
   *
   * @param selectedPostComment - selected post's comment that user want to view replies
   */
  public viewRepliesOfSelectedPostComment(selectedPostComment: PostComment): void {
    if (!selectedPostComment.replies) {
      const selectedPostCommentId = selectedPostComment.id;
      const replyOnPostCommentStatus = 1;
      const getRepliesOnPostCommentUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPostComments}/
${selectedPostCommentId}/
${Config.apiRepliesOnPostComment}?
${Config.statusParameter}=${replyOnPostCommentStatus}`;
      this.replyOnPostCommentService.getRepliesOnPostComment(getRepliesOnPostCommentUrl)
        .subscribe((repliesOnPostComment: ReplyOnPostComment[]) => {
          if (repliesOnPostComment) {
            selectedPostComment.replies = repliesOnPostComment;
            this.getReplyOnPostCommentReactionsByUser(selectedPostComment.replies);
          }
        });
    }
  }

  /**
   *
   * @param repliesOnPostComment - get reactions of replies on post's comment.
   * Therefore, we can know which replies that user liked and disliked
   */
  private getReplyOnPostCommentReactionsByUser(repliesOnPostComment: ReplyOnPostComment[]): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getReplyOnPostCommentReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiReplyOnPostCommentReactions}`;
    this.replyOnPostCommentReactionService.getReplyOnPostCommentReactions(getReplyOnPostCommentReactionsUrl)
      .subscribe((replyOnPostCommentReactions: ReplyOnPostCommentReaction[]) => {
        if (replyOnPostCommentReactions) {
          this.showRepliesOnPostCommentUserLikedAndDisliked(repliesOnPostComment, replyOnPostCommentReactions);
        }
      });
  }

  /**
   *
   * @param repliesOnPostComment - replies on post's comment that will be check which replies user liked and disliked
   * @param replyOnPostCommentReactions - replies on post's comment that user liked and disliked
   */
  private showRepliesOnPostCommentUserLikedAndDisliked(repliesOnPostComment: ReplyOnPostComment[],
                                                       replyOnPostCommentReactions: ReplyOnPostCommentReaction[]): void {
    for (const eachReplyOnPostCommentReaction of replyOnPostCommentReactions) {
      for (const eachReplyOnPostComment of repliesOnPostComment) {
        if (eachReplyOnPostCommentReaction.replyOnPostComment.id === eachReplyOnPostComment.id) {
          this.changeReplyOnPostCommentReactionStatus(eachReplyOnPostComment, eachReplyOnPostCommentReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedReplyOnPostComment - reply on post's comment that its reactions' status will be changed
   * @param selectedReplyOnPostCommentReaction - reaction's value that will be set to selected reply on post's comment
   */
  private changeReplyOnPostCommentReactionStatus(selectedReplyOnPostComment: ReplyOnPostComment,
                                                 selectedReplyOnPostCommentReaction: ReplyOnPostCommentReaction): void {
    selectedReplyOnPostComment.isReacted = true;
    if (selectedReplyOnPostCommentReaction.reaction === 1) {
      selectedReplyOnPostComment.isLikeClicked = true;
    } else if (selectedReplyOnPostCommentReaction.reaction === 0) {
      selectedReplyOnPostComment.isLikeClicked = false;
    }
  }

  /**
   *
   * @param selectedReplyOnPostComment - reply on post's comment that user want to like
   */
  public likeReplyOnPostComment(selectedReplyOnPostComment: ReplyOnPostComment): void {
    if (selectedReplyOnPostComment.isLikeClicked === true) {
      return;
    }
    if (selectedReplyOnPostComment.numberOfDislikes > 0 && selectedReplyOnPostComment.isReacted) {
      selectedReplyOnPostComment.numberOfDislikes -= 1;
    }
    selectedReplyOnPostComment.numberOfLikes += 1;
    // update number of likes of reply on post's comment
    this.updateReplyOnPostComment(selectedReplyOnPostComment);
    selectedReplyOnPostComment.isLikeClicked = true;
    selectedReplyOnPostComment.isReacted = true;
    this.submitNewReplyPostCommentReaction(selectedReplyOnPostComment, 1);
  }

  /**
   *
   * @param selectedReplyOnPostComment - reply on post's comment that user want to dislike
   */
  public dislikeReplyOnPostComment(selectedReplyOnPostComment: ReplyOnPostComment): void {
    if (selectedReplyOnPostComment.isLikeClicked === false) {
      return;
    }
    if (selectedReplyOnPostComment.numberOfLikes > 0 && selectedReplyOnPostComment.isReacted) {
      selectedReplyOnPostComment.numberOfLikes -= 1;
    }
    selectedReplyOnPostComment.numberOfDislikes += 1;
    // update number of dislikes of reply on post's comment
    this.updateReplyOnPostComment(selectedReplyOnPostComment);
    selectedReplyOnPostComment.isLikeClicked = false;
    selectedReplyOnPostComment.isReacted = true;
    this.submitNewReplyPostCommentReaction(selectedReplyOnPostComment, 0);
  }

  /**
   *
   * @param selectedReplyOnPostComment - reply on post's comment that user want to update
   */
  private updateReplyOnPostComment(selectedReplyOnPostComment: ReplyOnPostComment) {
    const updateReplyOnPostCommentUrl = `${Config.apiBaseUrl}/${Config.apiPostManagementPrefix}/${Config.apiRepliesOnPostComment}`;
    this.replyOnPostCommentService.updateReplyOnPostComment(updateReplyOnPostCommentUrl, selectedReplyOnPostComment).subscribe();
  }

  /**
   *
   * @param selectedReplyOnPostComment - selected reply on post's comment that user reacted
   * @param reactionValue - reaction's value that user reacted to selected reply on post's comment
   */
  private submitNewReplyPostCommentReaction(selectedReplyOnPostComment, reactionValue): void {
    const newReplyOnPostCommentReaction = new ReplyOnPostCommentReaction();
    newReplyOnPostCommentReaction.replyOnPostComment = selectedReplyOnPostComment;
    newReplyOnPostCommentReaction.userProfile = this.selectedUserProfile;
    newReplyOnPostCommentReaction.reaction = reactionValue;
    const addReplyOnPostCommentReactionUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiReplyOnPostCommentReactions}`;
    this.replyOnPostCommentReactionService.addNewReplyOnPostCommentReaction(addReplyOnPostCommentReactionUrl, newReplyOnPostCommentReaction)
      .subscribe();
  }

  /**
   *
   * @param selectedPostComment - selected comment that user want to reply
   */
  public showReplyPostCommentBox(selectedPostComment: PostComment): void {
    selectedPostComment.isReplyBoxShown = true;
  }

  /**
   *
   * @param selectedReplyOnPostComment - selected reply on post's comment that user want to reply
   */
  public showReplyReplyPostCommentBox(selectedReplyOnPostComment: ReplyOnPostComment): void {
    for (const eachPostComment of this.postCommentsPerPage) {
      if (selectedReplyOnPostComment.postComment.id === eachPostComment.id) {
        eachPostComment.isReplyBoxShown = true;
        break;
      }
    }
  }

  /**
   *
   * @param replyContent - reply's content that user want to reply to selected post's comment
   * @param selectedPostComment - selected post's comment that user want to reply
   */
  public replyToPostComment(selectedPostComment: PostComment, replyContent: string): void {
    // create new reply on post's comment
    const newReplyOnPostComment = new ReplyOnPostComment();
    newReplyOnPostComment.replyOnPostCommentContent = replyContent;
    newReplyOnPostComment.replyOnPostCommentStatus = 1;
    newReplyOnPostComment.replyOnPostCommentCreatedDate = new Date();
    newReplyOnPostComment.postComment = selectedPostComment;
    newReplyOnPostComment.userProfile = this.selectedUserProfile;
    newReplyOnPostComment.numberOfLikes = 0;
    newReplyOnPostComment.numberOfDislikes = 0;
    const addReplyOnPostCommentUrl = `${Config.apiBaseUrl}/${Config.apiPostManagementPrefix}/${Config.apiRepliesOnPostComment}`;
    this.replyOnPostCommentService.addReplyOnPostComment(addReplyOnPostCommentUrl, newReplyOnPostComment)
      .subscribe();
    selectedPostComment.numberOfReplies += 1;
    // update number of replies of selected post's comment
    this.updatePostComment(selectedPostComment);
    if (selectedPostComment.replies && selectedPostComment.replies.length) {
      selectedPostComment.replies.push(newReplyOnPostComment);
    }
  }

  /**
   *
   * @param selectedTag - selected tag that user want to view posts
   */
  public goToPostsByTag(selectedTag: Tag): void {
    // share tag to other components (tag that user want to view posts)
    this.shareTagService.changeTag(selectedTag);
    this.router.navigate([`/blog/tag/${selectedTag.tagName.toLowerCase()}`]);
  }
}
