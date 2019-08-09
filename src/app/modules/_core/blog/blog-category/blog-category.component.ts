import {Component, OnInit} from '@angular/core';
import {Post, PostCategory, ResponseMessage} from '@gw-models/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '@gw-services/core/api/post/post.service';
import {SharePostCategoryService} from '@gw-services/core/shared/post-category/share-post-category.service';
import {SharePostService} from '@gw-services/core/shared/post/share-post.service';

@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.css']
})
export class BlogCategoryComponent implements OnInit {

  // list of post's by category
  postsByCategory: Post[];

  // check loading component is showing or not
  loading: boolean;

  // current page
  currentPage: number;

  // get selected post's category
  selectedPostCategory: PostCategory;

  // check is post's category or not
  isPostCategory: boolean;

  // number posts per page
  nPostsPerPage: number;

  // total posts
  totalPosts: number;

  /**
   *
   * @param postService - inject postService
   * @param sharePostCategoryService - inject sharePostCategoryService
   * @param route - inject route
   * @param router - inject router
   * @param sharePostService - inject sharePostService
   */
  constructor(private postService: PostService,
              private sharePostCategoryService: SharePostCategoryService,
              private router: Router,
              private route: ActivatedRoute,
              private sharePostService: SharePostService) {
  }

  ngOnInit() {
    // init data
    this.initData();
    // get selected post's category
    this.getSelectedPostCategory();
  }

  /**
   * get selected post's category
   */
  private getSelectedPostCategory() {
    // show loading component
    this.loading = true;
    this.sharePostCategoryService.currentPostCategory
      .subscribe(selectedPostCategory => {
        // get selected post's category
        this.selectedPostCategory = selectedPostCategory;
        // check selected post's category existed or not
        this.checkPostCategoryExistedOrNot();
      });
  }

  /**
   * get posts by category and by page
   */
  private loadPostsByCategoryAndByPage() {
    // get posts
    this.postService.getPostsByCategoryAndByPage(this.selectedPostCategory.id, this.currentPage, 1)
      .subscribe(posts => {
        // get posts
        this.postsByCategory = posts;
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * check post's category existed or not
   */
  private checkPostCategoryExistedOrNot() {
    if (this.selectedPostCategory == null) {
      // redirect to home page
      this.router.navigate(['/blog/home']);
    } else {
      // check is post's category or not
      if (this.selectedPostCategory.postCategoryName.localeCompare('About') !== 0 &&
        this.selectedPostCategory.postCategoryName.localeCompare('Contact') !== 0 &&
        this.selectedPostCategory.postCategoryName.localeCompare('Privacy Policy') !== 0 &&
        this.selectedPostCategory.postCategoryName.localeCompare('Home') !== 0) {
        this.isPostCategory = true;
      }
      // load post by category and by page
      this.loadPostsByCategoryAndByPage();
      // load total posts by category
      this.loadTotalPostsByCategory();
    }
  }

  /**
   * init data
   */
  private initData() {
    // init number posts per page
    this.nPostsPerPage = 8;
    // init current page
    this.currentPage = 1;
  }

  /**
   * load total posts by category
   */
  private loadTotalPostsByCategory() {
    this.postService.getNumberOfPostsByCategory(this.selectedPostCategory.id, 1)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          this.totalPosts = Number(responseMessage.message);
        }
      });
  }

  /**
   *
   * @param event - current page
   */
  public postsPageChange(event) {
    // show loading component
    this.loading = true;
    // set new page
    this.currentPage = event;
    // load new data
    this.loadPostsByCategoryAndByPage();
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

}
