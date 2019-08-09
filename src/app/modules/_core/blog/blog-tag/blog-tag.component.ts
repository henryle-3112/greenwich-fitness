import {Component, OnInit} from '@angular/core';
import {PostTag, ResponseMessage, Tag} from '@gw-models/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SharePostService} from '@gw-services/core/shared/post/share-post.service';
import {PostTagService} from '@gw-services/core/api/post/post-tag.service';
import {ShareTagService} from '@gw-services/core/shared/tag/share-tag.service';

@Component({
  selector: 'app-blog-tag',
  templateUrl: './blog-tag.component.html',
  styleUrls: ['./blog-tag.component.css']
})
export class BlogTagComponent implements OnInit {

  // list of post tag
  postsByTag: PostTag[];

  // check loading component is showing or not
  loading: boolean;

  // current page
  currentPage: number;

  // get selected tag
  selectedTag: Tag;

  // number posts per page
  nPostsPerPage: number;

  // total posts
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

  ngOnInit() {
    // init data
    this.initData();
    // get selected tag
    this.getSelectedTag();
  }

  /**
   * get selected tag
   */
  private getSelectedTag() {
    // show loading component
    this.loading = true;
    this.shareTagService.currentTag
      .subscribe(selectedTag => {
        // get selected tag
        this.selectedTag = selectedTag;
        // check selected tag existed or not
        this.checkTagExistedOrNot();
      });
  }

  /**
   * get post tags by tag and by page
   */
  private loadPostTagsByTagAndByPage() {
    // get posts
    this.postTagService.getPostTagsByTagIdAndByPage(this.selectedTag.id, this.currentPage, 1)
      .subscribe(posts => {
        // get posts
        this.postsByTag = posts;
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * check tag existed or not
   */
  private checkTagExistedOrNot() {
    if (this.selectedTag == null) {
      // redirect to home page
      this.router.navigate(['/blog/home']);
    } else {
      // load post by post's tag and by page
      this.loadPostTagsByTagAndByPage();
      // load total posts by by
      this.loadTotalPostsByTag();
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
   * load total posts by tag
   */
  private loadTotalPostsByTag() {
    this.postTagService.getNumberOfPostTagsByTagId(this.selectedTag.id, 1)
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
    this.loadPostTagsByTagAndByPage();
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
