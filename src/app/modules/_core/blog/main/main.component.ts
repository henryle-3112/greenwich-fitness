import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Post, PostCategory} from '@gw-models/core';
import {SharePostCategoryService} from '@gw-services/core/shared/post-category/share-post-category.service';
import {PostService} from '@gw-services/core/api/post/post.service';
import {SharePostService} from '@gw-services/core/shared/post/share-post.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  // top training posts
  topTrainingPosts: Post[];

  // top nutrition posts
  topNutritionPosts: Post[];

  // top science posts
  topSciencePosts: Post[];

  // show loading component
  loading: boolean;

  // selected post's category
  selectedPostCategory: PostCategory;

  // all post's categories
  postCategories: PostCategory[];

  /**
   *
   * @param postService - inject postService
   * @param router - inject router
   * @param sharePostService - inject sharePostService
   * @param sharePostCategoryService - inject sharePostCategoryService
   */
  constructor(private postService: PostService,
              private router: Router,
              private sharePostService: SharePostService,
              private sharePostCategoryService: SharePostCategoryService) {
  }

  ngOnInit() {
    // get top training's posts
    this.getTopTrainingPosts();
    // get top nutrition's posts
    this.getTopNutritionPosts();
    // get top science's posts
    this.getTopSciencePosts();
    // get all post's categories
    this.getAllPostCategories();
  }

  /**
   * get top training's posts
   */
  private getTopTrainingPosts() {
    // show loading component
    this.loading = true;
    // get top men's posts
    this.postService.getTopPosts(4, 2, 1)
      .subscribe(posts => {
        // hide loading component
        this.loading = false;
        // get top training's posts
        this.topTrainingPosts = posts;
      });
  }

  /**
   * get top nutrition's posts
   */
  private getTopNutritionPosts() {
    // show loading component
    this.loading = true;
    // get top nutrition's posts
    this.postService.getTopPosts(4, 3, 1)
      .subscribe(posts => {
        // hide loading component
        this.loading = false;
        // get top nutrition's posts
        this.topNutritionPosts = posts;
      });
  }

  /**
   * get top science's posts
   */
  private getTopSciencePosts() {
    // show loading component
    this.loading = true;
    // get top science posts
    this.postService.getTopPosts(4, 4, 1)
      .subscribe(posts => {
        // hide loading component
        this.loading = false;
        // get top science's posts
        this.topSciencePosts = posts;
      });
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

  /**
   * go to post's category
   */
  public goToPostCategory(selectedPostCategoryName: string) {
    for (const eachPostCategory of this.postCategories) {
      if (eachPostCategory.postCategoryName.localeCompare(selectedPostCategoryName) === 0) {
        this.selectedPostCategory = eachPostCategory;
        break;
      }
    }
    // share selected post's category
    this.sharePostCategoryService.changePostCategory(this.selectedPostCategory);
    // go to post's category
    this.router.navigate([`/blog/category/${this.selectedPostCategory.postCategoryMetaTitle}`]);
  }

  /**
   * get all post's categories
   */
  private getAllPostCategories() {
    this.sharePostCategoryService.currentPostCategories
      .subscribe((postCateggories: PostCategory[]) => {
        if (postCateggories) {
          this.postCategories = postCateggories;
        }
      });
  }

}
