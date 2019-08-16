import {Component, OnInit} from '@angular/core';
import {Post, PostCategory} from '@gw-models/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '@gw-services/core/api/post/post.service';
import {SharePostCategoryService} from '@gw-services/core/shared/post-category/share-post-category.service';
import {SharePostService} from '@gw-services/core/shared/post/share-post.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.css']
})
export class BlogCategoryComponent implements OnInit {
  postsByCategory: Post[];
  isLoadingSpinnerShown: boolean;
  currentPostsByCategoryPage: number;
  selectedPostCategory: PostCategory;
  nPostsByCategoryPerPage: number;
  totalPostsByCategory: number;
  isPostCategory: boolean;

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

  ngOnInit(): void {
    this.initData();
    this.getSelectedPostCategory();
  }

  /**
   * init data
   */
  private initData(): void {
    this.nPostsByCategoryPerPage = Config.numberItemsPerPage;
    this.currentPostsByCategoryPage = Config.currentPage;
  }

  /**
   * get selected post's category
   */
  private getSelectedPostCategory(): void {
    this.isLoadingSpinnerShown = true;
    this.sharePostCategoryService.currentPostCategory
      .subscribe(selectedPostCategory => {
        if (selectedPostCategory) {
          this.selectedPostCategory = selectedPostCategory;
          this.checkCategoryIsPostCategoryOrNot();
        } else {
          this.router.navigate(['/blog/home']);
        }
      });
  }

  /**
   * check post's category existed or not
   */
  private checkCategoryIsPostCategoryOrNot(): void {
    this.isPostCategory = this.selectedPostCategory.postCategoryName.localeCompare('About') !== 0 &&
      this.selectedPostCategory.postCategoryName.localeCompare('Contact') !== 0 &&
      this.selectedPostCategory.postCategoryName.localeCompare('Privacy Policy') !== 0 &&
      this.selectedPostCategory.postCategoryName.localeCompare('Home') !== 0;
    if (this.isPostCategory) {
      this.getPostsByCategory();
    }
  }

  /**
   * get posts by category and by page
   */
  private getPostsByCategory(): void {
    const selectedPostCategoryId = this.selectedPostCategory.id;
    const postCategoryStatus = 1;
    const getPostsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPosts}?
${Config.categoryIdParameter}=${selectedPostCategoryId}&
${Config.statusParameter}=${postCategoryStatus}&
${Config.pageParameter}=${this.currentPostsByCategoryPage}`;
    this.postService.getPosts(getPostsUrl)
      .subscribe(response => {
        this.postsByCategory = response.body;
        this.totalPostsByCategory = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - current page
   */
  public postsPageChange(event): void {
    this.isLoadingSpinnerShown = true;
    this.currentPostsByCategoryPage = event;
    this.getPostsByCategory();
  }


  /**
   *
   * @param selectedPost - selected post
   */
  public goToPostDetail(selectedPost): void {
    // share selected post to other components
    this.sharePostService.changePost(selectedPost);
    this.router.navigate([`/blog/post/${selectedPost.postMetaTitle}`]);
  }

}
