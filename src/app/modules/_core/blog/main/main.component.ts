import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Post, PostCategory} from '@gw-models/core';
import {SharePostCategoryService} from '@gw-services/core/shared/post-category/share-post-category.service';
import {PostService} from '@gw-services/core/api/post/post.service';
import {SharePostService} from '@gw-services/core/shared/post/share-post.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  topTrainingPosts: Post[];
  topNutritionPosts: Post[];
  topSciencePosts: Post[];
  isLoadingSpinnerShown: boolean;
  selectedPostCategory: PostCategory;
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

  ngOnInit(): void {
    this.getTopTrainingPosts();
    this.getTopNutritionPosts();
    this.getTopSciencePosts();
    this.getAllPostCategories();
  }

  /**
   * get top training's posts
   */
  private getTopTrainingPosts(): void {
    this.isLoadingSpinnerShown = true;
    const trainingPostCategory = 2;
    const postStatus = 1;
    const topLimit = 4;
    const getTopTrainingPostsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPosts}?
${Config.categoryIdParameter}=${trainingPostCategory}&
${Config.statusParameter}=${postStatus}&
${Config.topParameter}=${topLimit}`;
    this.postService.getPosts(getTopTrainingPostsUrl)
      .subscribe(response => {
        this.topTrainingPosts = response.body;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get top nutrition's posts
   */
  private getTopNutritionPosts(): void {
    this.isLoadingSpinnerShown = true;
    const nutritionPostCategory = 3;
    const postStatus = 1;
    const topLimit = 4;
    const getTopNutritionPostsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPosts}?
${Config.categoryIdParameter}=${nutritionPostCategory}&
${Config.statusParameter}=${postStatus}&
${Config.topParameter}=${topLimit}`;
    this.postService.getPosts(getTopNutritionPostsUrl)
      .subscribe(response => {
        this.topNutritionPosts = response.body;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get top science's posts
   */
  private getTopSciencePosts(): void {
    this.isLoadingSpinnerShown = true;
    const sciencePostCategory = 4;
    const postStatus = 1;
    const topLimit = 4;
    const getTopSciencePostsUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPosts}?
${Config.categoryIdParameter}=${sciencePostCategory}&
${Config.statusParameter}=${postStatus}&
${Config.topParameter}=${topLimit}`;
    this.postService.getPosts(getTopSciencePostsUrl)
      .subscribe(response => {
        this.topSciencePosts = response.body;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedPost - selected post that user want to view
   */
  public goToPostDetail(selectedPost: Post): void {
    // share post to other components
    this.sharePostService.changePost(selectedPost);
    this.router.navigate([`/blog/post/${selectedPost.postMetaTitle}`]);
  }

  /**
   *
   * @param selectedPostCategoryName - category that user want to view
   */
  public goToPostCategory(selectedPostCategoryName: string): void {
    for (const eachPostCategory of this.postCategories) {
      if (eachPostCategory.postCategoryName.localeCompare(selectedPostCategoryName) === 0) {
        this.selectedPostCategory = eachPostCategory;
        break;
      }
    }
    // share selected post's category
    this.sharePostCategoryService.changePostCategory(this.selectedPostCategory);
    this.router.navigate([`/blog/category/${this.selectedPostCategory.postCategoryMetaTitle}`]);
  }

  /**
   * get all post's categories
   */
  private getAllPostCategories(): void {
    this.sharePostCategoryService.currentPostCategories
      .subscribe((postCategories: PostCategory[]) => {
        if (postCategories) {
          this.postCategories = postCategories;
        }
      });
  }

}
