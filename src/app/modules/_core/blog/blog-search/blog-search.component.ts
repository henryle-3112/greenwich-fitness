import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post, ResponseMessage} from '@gw-models/core';
import {Router} from '@angular/router';
import {ShareMessageService} from '@gw-services/core/shared/message/share-message.service';
import {Config} from '@gw-config/core';
import {PostService} from '@gw-services/core/api/post/post.service';
import {SharePostService} from '@gw-services/core/shared/post/share-post.service';

@Component({
  selector: 'app-blog-search',
  templateUrl: './blog-search.component.html',
  styleUrls: ['./blog-search.component.css']
})
export class BlogSearchComponent implements OnInit, OnDestroy {

  // check loading component is showing or not
  loading: boolean;

  // selected post's category's id (for searching)
  selectedPostCategoryId: number;

  // selected post's name (for searching)
  selectedPostName: string;

  // total post for pagination
  totalPosts: number;

  // current page for pagination
  currentPage: number;

  // number posts per page
  nPostsPerPage: number;

  // searching posts
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

  ngOnInit() {
    // check search parameters existed or not. If not redirect to home page
    this.checkSearchParametersExistedOrNot();
    this.shareMessageService.currentMessage
      .subscribe(message => {
        if (message && message.localeCompare('searchPost') === 0) {
          // check search parameters existed or not. If not redirect to home page
          this.checkSearchParametersExistedOrNot();
          // init data
          this.initData();
        }
      });
  }

  /**
   * init data
   */
  private initData() {
    // current page
    this.currentPage = 1;

    // init number posts per page
    this.nPostsPerPage = 8;

    // get search's information that user want to search
    this.selectedPostCategoryId = Number(localStorage.getItem(Config.selectedPostCategoryForSearching));
    this.selectedPostName = localStorage.getItem(Config.selectedPostNameKeywordsForSearching);

    // get number of searching posts
    this.getNumberOfSearchingPosts();
    // get search result
    this.getSearchingPostsByPage();
  }

  /**
   * get searching posts
   */
  private getSearchingPostsByPage() {
    // show loading component
    this.loading = true;
    // base url
    let getSearchingPostsUrl =
      `${Config.api}/${Config.apiGetSearchingPostsByPage}/${this.currentPage}` +
      `/1?categoryId=&postNameKeywords=`;
    if (localStorage.getItem(Config.selectedPostCategoryForSearching)) {
      this.selectedPostCategoryId = Number(localStorage.getItem(Config.selectedPostCategoryForSearching));
      getSearchingPostsUrl = getSearchingPostsUrl.replace('categoryId=', `categoryId=${this.selectedPostCategoryId}`);
    }
    if (this.selectedPostName.localeCompare('') !== 0) {
      getSearchingPostsUrl = getSearchingPostsUrl.replace('postNameKeywords=',
        `postNameKeywords=${this.selectedPostName}`);
    }
    console.log(`Current searching url: ${getSearchingPostsUrl}`);
    this.postService.getSearchingPostsByPage(getSearchingPostsUrl)
      .subscribe(posts => {
        if (posts) {
          // get posts
          this.searchingPosts = posts;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get number of searching posts
   */
  private getNumberOfSearchingPosts() {
    // show loading component
    this.loading = true;
    // base url
    let getNumberOfSearchingPostsUrl =
      `${Config.api}/${Config.apiGetNumberOfSearchingPosts}/1?categoryId=&postNameKeywords=`;
    if (localStorage.getItem(Config.selectedPostCategoryForSearching)) {
      this.selectedPostCategoryId = Number(localStorage.getItem(Config.selectedPostCategoryForSearching));
      getNumberOfSearchingPostsUrl = getNumberOfSearchingPostsUrl.replace('categoryId=',
        `categoryId=${this.selectedPostCategoryId}`);
    }
    if (this.selectedPostName.localeCompare('') !== 0) {
      getNumberOfSearchingPostsUrl = getNumberOfSearchingPostsUrl.replace('postNameKeywords=',
        `postNameKeywords=${this.selectedPostName}`);
    }
    console.log(`Current searching url: ${getNumberOfSearchingPostsUrl}`);
    this.postService.getNumberOfSearchingPosts(getNumberOfSearchingPostsUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          this.totalPosts = Number(responseMessage.message);
          console.log(`Total Posts: ${this.totalPosts}`);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - current page
   */
  public postsPageChange(event) {
    // set current page
    this.currentPage = event;
    // reload data
    this.getSearchingPostsByPage();
  }

  /**
   * check search parameters existed or not
   */
  private checkSearchParametersExistedOrNot() {
    if (!localStorage.getItem(Config.selectedPostCategoryForSearching) &&
      !localStorage.getItem(Config.selectedPostNameKeywordsForSearching)
    ) {
      this.router.navigate(['/blog/home']);
    }
  }

  /**
   *
   * @param selectedPost - selected post
   */
  public goToPostDetail(selectedPost) {
    // share post to other components
    this.sharePostService.changePost(selectedPost);
    // go to post's detail page
    this.router.navigate([`/blog/post/${selectedPost.postMetaTitle}`]);
  }

  ngOnDestroy(): void {
    // clear local storage
    localStorage.removeItem(Config.selectedPostCategoryForSearching);
    localStorage.removeItem(Config.selectedPostNameKeywordsForSearching);
  }
}
