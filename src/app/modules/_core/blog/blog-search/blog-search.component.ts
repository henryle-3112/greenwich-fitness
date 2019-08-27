import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '@gw-models/core';
import { Router } from '@angular/router';
import { ShareMessageService } from '@gw-services/core/shared/message/share-message.service';
import { Config } from '@gw-config/core';
import { PostService } from '@gw-services/core/api/post/post.service';
import { SharePostService } from '@gw-services/core/shared/post/share-post.service';

@Component({
  selector: 'app-blog-search',
  templateUrl: './blog-search.component.html',
  styleUrls: ['./blog-search.component.css']
})
export class BlogSearchComponent implements OnInit, OnDestroy {
  isLoadingSpinnerShown: boolean;
  totalSearchingPosts: number;
  currentSearchingPostsPage: number;
  nSearchingPostsPerPage: number;
  searchingPosts: Post[];


  /**
   *
   * @param postService - inject postService
   * @param router - inject router
   * @param shareMessageService - inject shareMessageService
   * @param sharePostService - inject sharePostService
   */
  constructor(private postService: PostService,
    private router: Router,
    private shareMessageService: ShareMessageService,
    private sharePostService: SharePostService) {
  }

  ngOnInit(): void {
    this.shareMessageService.currentMessage
      .subscribe(message => {
        if (message && message.localeCompare('searchPost') === 0) {
          this.checkSearchParametersExistedOrNot();
          this.initData();
        }
      });
  }

  /**
   * check search parameters existed or not
   */
  private checkSearchParametersExistedOrNot(): void {
    const isParametersNotExisted = !localStorage.getItem(Config.selectedPostCategoryForSearching) &&
      !localStorage.getItem(Config.selectedPostNameKeywordsForSearching);
    if (isParametersNotExisted) {
      this.router.navigate(['/blog/home']);
    }
  }

  /**
   * init data
   */
  private initData(): void {
    this.currentSearchingPostsPage = Config.currentPage;
    this.nSearchingPostsPerPage = Config.numberItemsPerPage;
    this.getSearchingPosts();
  }

  /**
   * get searching posts
   */
  private getSearchingPosts(): void {
    this.isLoadingSpinnerShown = true;
    const postStatus = 1;
    let getSearchingPostsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPosts}?
${Config.pageParameter}=${this.currentSearchingPostsPage}&
${Config.categoryIdParameter}=&
${Config.searchParameter}=&
${Config.statusParameter}=${postStatus}`;
    if (localStorage.getItem(Config.selectedPostCategoryForSearching)) {
      const selectedPostCategoryId = Number(localStorage.getItem(Config.selectedPostCategoryForSearching));
      getSearchingPostsUrl = getSearchingPostsUrl.replace(
        `${Config.categoryIdParameter}=`,
        `${Config.categoryIdParameter}=${selectedPostCategoryId}`);
    }
    if (localStorage.getItem(Config.selectedPostNameKeywordsForSearching)) {
      const selectedPostName = localStorage.getItem(Config.selectedPostNameKeywordsForSearching);
      getSearchingPostsUrl = getSearchingPostsUrl.replace(
        `${Config.searchParameter}=`,
        `${Config.searchParameter}=${selectedPostName}`);
    }
    this.postService.getPosts(getSearchingPostsUrl)
      .subscribe(response => {
        this.searchingPosts = response.body;
        this.totalSearchingPosts = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - current page
   */
  public postsPageChange(event): void {
    this.currentSearchingPostsPage = event;
    this.getSearchingPosts();
  }

  /**
   *
   * @param selectedPost - selected post
   */
  public goToPostDetail(selectedPost: Post): void {
    // share post to other components
    this.sharePostService.changePost(selectedPost);
    this.router.navigate([`/blog/post/${selectedPost.postMetaTitle}`]);
  }

  /**
   * destroy component
   */
  ngOnDestroy(): void {
    localStorage.removeItem(Config.selectedPostCategoryForSearching);
    localStorage.removeItem(Config.selectedPostNameKeywordsForSearching);
  }
}
