import {Component, OnInit} from '@angular/core';
import {Post, PostTag, Tag} from '@gw-models';
import {ActivatedRoute, Router} from '@angular/router';
import {SharePostService, ShareTagService} from '@gw-services/shared';
import {PostTagService} from '@gw-services/api';
import {Config} from '@gw-config';

@Component({
  selector: 'app-blog-tag',
  templateUrl: './blog-tag.component.html',
  styleUrls: ['./blog-tag.component.css']
})
export class BlogTagComponent implements OnInit {
  postsByTag: PostTag[];
  isLoadingSpinnerShown: boolean;
  currentPostsPage: number;
  selectedTag: Tag;
  nPostsPerPage: number;
  totalPosts: number;

  /**
   *
   * @param postTagService - inject postTagService
   * @param shareTagService - inject shareTagService
   * @param route - inject route
   * @param router - inject router
   * @param sharePostService - inject sharePostService
   */
  constructor(private postTagService: PostTagService,
              private shareTagService: ShareTagService,
              private router: Router,
              private route: ActivatedRoute,
              private sharePostService: SharePostService) {
  }

  ngOnInit(): void {
    this.initData();
    this.getSelectedTag();
  }

  /**
   *
   * @param event - current page
   */
  public postsPageChange(event): void {
    this.isLoadingSpinnerShown = true;
    this.currentPostsPage = event;
    this.getPostsByTag();
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
   * init data
   */
  private initData(): void {
    this.nPostsPerPage = Config.numberItemsPerPage;
    this.currentPostsPage = Config.currentPage;
  }

  /**
   * get selected tag
   */
  private getSelectedTag(): void {
    this.isLoadingSpinnerShown = true;
    this.shareTagService.currentTag
      .subscribe(selectedTag => {
        if (selectedTag) {
          this.selectedTag = selectedTag;
          this.getPostsByTag();
        } else {
          this.router.navigate(['/blog/home']);
        }
      });
  }

  /**
   * get post tags by tag and by page
   */
  private getPostsByTag(): void {
    const selectedTagId = this.selectedTag.id;
    const postStatus = 1;
    const getPostsByTagUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiTags}/
${selectedTagId}/
${Config.apiPosts}?
${Config.pageParameter}=${this.currentPostsPage}&
${Config.postStatusParameter}=${postStatus}`;
    this.postTagService.getPostTags(getPostsByTagUrl)
      .subscribe(response => {
        this.postsByTag = response.body;
        this.totalPosts = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

}
