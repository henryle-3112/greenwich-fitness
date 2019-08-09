export enum Config {
  // base path
  api = 'http://localhost:8080',

  // path login api
  apiLogin = 'login',
  // path api login by facebook's account
  apiLoginByFacebook = 'login/facebook',
  // path api login by google's account
  apiLoginByGoogle = 'login/google',

  // path send email - reset password
  apiSendEmailResetPassword = 'send/email/reset/password',

  // path get galleries by page
  apiGetGalleriesByPage = 'galleries/paging',
  // path get number of galleries based on keywords
  apiGetNumberOfGalleries = 'galleries/count',

  // path get musics by page
  apiGetMusicsByPage = 'musics/paging',
  // path get number of musics based on keywords
  apiGetNumberOfMusics = 'musics/count',
  // path get all musics
  apiGetAllMusics = 'musics',

  // path change password
  apiChangePassword = 'change/password',

  // path upload image
  apiUploadImage = 'upload',

  // path register account
  apiRegisterAccount = 'register',
  // path active account
  apiActiveAccount = 'active/account',

  // api get user-account's account by user-account's name
  apiGetUserAccountByUserName = 'users/username?userName=',
  // api get facebook's account by facebook's id
  apiGetFacebookAccountByFacebookId = 'facebook',
  // api get google's account by google's id
  apiGetGoogleAccountByGoogleId = 'google',

  // api update user-account's account
  apiUpdateUserAccount = 'users/update',
  // api update user-account's profile
  apiUpdateUserProfile = 'users/profiles/update',

  // api get number of user-account's achievements
  apiGetNumberOfUserAchievements = 'achievements/count',
  // api add to achievement
  apiAddToAchievement = 'achievements/create',

  // api get body index by user-account's profile's id
  apiGetBodyIndexByUserProfileId = 'index',
  // api update body index
  apiUpdateBodyIndex = 'index/update',

  // google credentials
  googleCredentials = '197331173025-1vpu22gfgt1tj776n1o9btqhvv9tptjk.apps.googleusercontent.com',

  // current repetitions
  currentRepetitions = 'currentRepetitions',

  // current workout's volume
  currentWorkoutVolume = 'currentWorkoutVolume',

  // check type login ( login by facebook, google or normal account)
  loginType = 'loginType',

  // google id
  googleId = 'googleId',

  // facebook id
  facebookId = 'facebookId',

  // save current workout's state when user-account go to exercise's video component
  currentDetailedRoundPosition = 'currentDetailedRoundPosition',
  currentSingleExercisePosition = 'currentSingleExercisePosition',
  isCountDownShown = 'isCountDownShown',
  currentSecondWorkoutTime = 'currentSecondWorkoutTime',
  currentWorkoutTime = 'currentWorkouTime',

  // current exercise's time
  currentExerciseTime = 'currentExerciseTime',
  currentSecondExerciseTime = 'currentSecondExerciseTime',
  isCountDownSingleExerciseShown = 'isCountDownSingleExerciseShown',

  // current song position
  currentSongPosition = 'currentSongPosition',

  // api get all product's slide
  apiGetAllProductSlide = 'product/slides',

  // api get all product's categories
  apiGetAllProductCategory = 'product/categories',

  // api get all products
  apiGetProducts = 'products',

  // api get selected product
  // apiGetSelectedProduct = 'products',

  // api get products with paging
  apiGetProductsPaging = 'products/paging',

  // api get number of products by category
  apiGetNumberOfProductsByCategory = 'products/count',

  // selected product's category (for searching)
  selectedProductCategoryForSearching = 'selectedProductCategoryForSearching',

  // selected product's min price (for searching)
  selectedProductMinPriceForSearching = 'selectedProductMinPriceForSearching',

  // selected product's max price (for searching)
  selectedProductMaxPriceForSearching = 'selectedProductMaxPriceForSearching',

  // selected product's keywords (for searching)
  selectedProductNameKeywordsForSearching = 'selectedProductNameKeywordsForSearching',

  // api get number of searching products
  apiGetNumberOfSearchingProducts = 'products/searching/count',

  // api get searching products by page
  apiGetSearchingProductsByPage = 'products/searching',

  // api get product's feedback
  apiGetProductFeedback = 'product/feedbacks',

  // api create product's feedback
  apiAddProductFeedback = 'product/feedbacks/create',

  // api create product's rate
  apiAddProductRate = 'product/rates/create',

  // api get product's feedback by user's id and product's id
  apiGetProductFeedbackByUserIdAndProductId = 'product/feedbacks',

  // api get product's rate by user's id and product's id
  apiGetProductRateByUserIdAndProductId = 'product/rates',

  // api get about's content
  apiGetAboutContent = 'abouts',

  // api get contact's content
  apiGetContactContent = 'contacts',

  // api get privacy's policy
  apiGetPrivacyPolicy = 'policies',

  // api count number of replies
  apiCountNumberOfProductFeedbackReplies = 'product/feedback/replies/count',

  // api get product's feedback reaction
  apiCountProductFeedbackReaction = 'product/feedback/reactions/count',

  // api get product's feedback reactions by user's profile
  apiGetProductFeedbackReactionsByUserProfile = 'product/feedback/reactions',

  // api add new product's feedback reactions
  apiAddNewProductFeedbackReaction = 'product/feedback/reactions/create',

  // api get all replies of selected product's feedback
  apiGetRepliesOnSelectedProductFeedback = 'product/feedback/replies',

  // api count number reply on product feedback reaction
  apiCountReplyOnProductFeedbackReaction = 'product/feedback/reply/reactions/count',

  // api get reply on product reaction by user's profile
  apiGetReplyOnProductFeedbackReaction = 'product/feedback/reply/reactions',

  // api add new reply on product feedback reaction
  apiAddNewReplyOnProductFeedbackReaction = 'product/feedback/reply/reactions/create',

  // api add new reply on product feedback
  apiAddNewReplyOnProductFeedback = 'product/feedback/replies/create',

  // shopping cart
  shoppingCart = 'shoppingCart',

  // api add product's order
  apiAddProductOrder = 'product/orders/create',

  // api add new product's order's detail
  apiAddProductOrderDetail = 'product/order/details/create',


  // api get all post slides
  apiGetAllPostSlides = 'post/slides',

  // api get all product categories
  apiGetAllPostCategories = 'post/categories',

  // selected post's category for searching
  selectedPostCategoryForSearching = 'selectedPostCategoryForSearching',

  // selected post's category's name for searching
  selectedPostNameKeywordsForSearching = 'selectedPostNameKeywordsForSearching',

  // api get posts
  apiGetPosts = 'posts',

  // api get posts paging
  apiGetPostsPaging = 'posts/paging',

  // api get number of posts by category
  apiGetNumberOfPostsByCategory = 'posts/count',

  // api get searching posts by page
  apiGetSearchingPostsByPage = 'posts/searching',

  // api get number of searching products
  apiGetNumberOfSearchingPosts = 'posts/searching/count',

  // api get post's comments
  apiGetPostComments = 'post/comments',

  // api create post's comment
  apiAddPostComment = 'post/comments/create',

  // api create post's rate
  apiAddPostRate = 'post/rates/create',

  // api get post's rate by user's id and post's id
  apiGetPostRateByUserIdAndPostId = 'post/rates',

  // api count number of replies
  apiCountNumberOfPostCommentReplies = 'post/comment/replies/count',

  // api get all replies of selected post's comment
  apiGetRepliesOnSelectedPostComment = 'post/comment/replies',

  // api add new reply on post's comment
  apiAddNewReplyOnPostComment = 'post/comment/replies/create',

  // api get post's comment reaction
  apiCountPostCommentReaction = 'post/comment/reactions/count',

  // api get post's comment reactions by user's profile
  apiGetPostCommentReactionsByUserProfile = 'post/comment/reactions',

  // api add new post's comment reactions
  addAddNewPostCommentReaction = 'post/comment/reactions/create',

  // api count number reply on post's comment reaction
  apiCountReplyOnPostCommentReaction = 'post/comment/reply/reactions/count',

  // api get reply on post's comment reaction by user's profile
  apiGetReplyOnPostCommentReaction = 'post/comment/reply/reactions',

  // api add new reply on post's comment reaction
  apiAddNewReplyOnPostCommentReaction = 'post/comment/reply/reactions/create',

  // api get post tags by tag
  apiGetPostTagsPaging = 'post/tags/paging',

  // api get number of posts by tag
  apiGetNumberOfPostTagsByTag = 'post/tags/count',

  // api get tags by post
  apiGetTagsByPost = 'post/tags/post',

  // path get coaches by page
  apiGetCoachesByPage = 'coaches/paging',
  // path get number of coaches based on keywords
  apiGetNumberOfCoaches = 'coaches/count',
  // path get all coaches
  apiGetAllCoaches = 'coaches',

  // api get coach's rate by user's id and coach's id
  apiGetCoachRateByUserIdAndCoachId = 'coach/rates',

  // api count number of replies
  apiCountNumberOfMemberships = 'memberships/count',

  // api get rate average
  apiRateAverage = 'coach/rates',

  // api get coach's feedback
  apiGetCoachFeedback = 'coach/feedbacks',

  // api add coach's feedback
  apiAddCoachFeedback = 'coach/feedbacks/create',

  // api count coach feedback reactions
  apiCountCoachFeedbackReaction = 'coach/feedback/reactions/count',

  // api get coach's feedback reactions by user's profile
  apiGetCoachFeedbackReactionsByUserProfile = 'coach/feedback/reactions',

  // api add new coach feedback reaction
  apiAddNewCoachFeedbackReaction = 'coach/feedback/reactions/create',

  // api count number of replies
  apiCountNumberOfCoachFeedbackReplies = 'coach/feedback/replies/count',

  // api get all replies of selected coach's feedback
  apiGetRepliesOnSelectedCoachFeedback = 'coach/feedback/replies',

  // api add new reply on coach feedback
  apiAddNewReplyOnCoachFeedback = 'coach/feedback/replies/create',

  // api count number reply on coach feedback reaction
  apiCountReplyOnCoachFeedbackReaction = 'coach/feedback/reply/reactions/count',

  // api get reply on coach reaction by user's profile
  apiGetReplyOnCoachFeedbackReaction = 'coach/feedback/reply/reactions',

  // api add new reply on coach feedback reaction
  apiAddNewReplyOnCoachFeedbackReaction = 'coach/feedback/reply/reactions/create',

  // api create coach's rate
  apiAddCoachRate = 'coach/rates/create',

  // path get memberships by page
  apiGetMembershipsByPage = 'memberships/paging',
  // path get number of memberships based on keywords
  apiGetNumberOfMemberships = 'memberships/count',

  // api get coach by user's profile
  apiGetCoachByUserProfile = 'coaches',

  // path get coaches by page
  apiGetCoachesByUserProfileAndByPage = 'membership/coaches/paging',
  // path get number of coaches by user's profile and by page based on keywords
  apiGetNumberOfCoachesByUserProfileAndByPage = 'membership/coaches/count',

  // api get trainings by user's profile's id and coach's id
  apiGetTrainingsByUserProfileIdAndCoachId = 'trainings',

  // api add trainings
  apiAddTraining = 'trainings',

  // api get trainings by page
  apiGetTrainingsByPage = 'trainings/paging',

  // path get number of trainings based on keywords
  apiGetNumberOfTrainings = 'trainings/count',

  // api get trainings by user's profile and coach and training's date
  apiGetTrainingsByUserProfileAndCoachAndTrainingDate = 'trainings/date',

  // api check user has pay for selected coach or not
  apiCheckUserHasPayForSelectedCoachOrNot = 'memberships/count',

  // api update training status
  apiUpdateTrainingStatus = 'trainings/update',

  // api new feed
  apiAddNewFeed = 'feeds/create',

  // api get new feeds by status and by page
  apiGetNewFeedsdByStatusAndByPage = 'feeds/paging',

  // api get number of new feeds by status
  apiGetNumberOfNewFeedsByStatus = 'feeds/count',

  // api count number of new's feed's reactions
  apiCountNumberOfNewFeedReactions = 'feed/reactions/count',

  // api get new's feed's reaction by user's profile
  apiGetNewFeedReactionsByUserProfile = 'feed/reactions',

  // api add new's feed's reaction by user's profile
  apiAddNewFeedReaction = 'feed/reactions/create',

  // api get new's feed's comments by new feed and status
  apiGetNewFeedCommentsByNewFeedAndStatus = 'feed/comments',

  // api add new feed comment
  apiAddNewFeedComment = 'feed/comments/create',

  // api get new feed comment reactions by user profile
  apiGetNewFeedCommentReactionsByUserProfile = 'feed/comment/reactions',

  // api add new feed comment reaction
  apiAddNewFeedCommentReaction = 'feed/comment/reactions/create',

  // api count number of new feed comment reaction by new feed comment and reaction
  apiCountNumberOfNewFeedCommentReactionsByNewFeedCommentAndReaction = 'feed/comment/reactions/count',

  // api get reply on new feed comment by new feed comment and status
  apiGetRepliesOnNewFeedCommentByNewFeedCommentAndStatus = 'feed/comment/replies',

  // api count number of replies on new feed comment by new feed comment and status
  apiCountNumberOfRepliesOnNewFeedCommentByNewFeedCommentAndStatus = 'feed/comment/replies/count',

  // api create reply on new feed comment
  apiCreateReplyOnNewFeedComment = 'feed/comment/replies/create',

  // api count number of reply on new feed comment reaction reply on new feed comment and reaction
  apiCountNumberOfNewFeedCommentReactionsByReplyOnNewFeedCommentAndReaction = 'feed/comment/reply/reactions/count',

  // api get reply on new feed comment reaction by user profile
  apiGetReplyOnNewFeedCommentReactionByUserProfile = 'feed/comment/reply/reactions',

  // api add reply on new feed comment reaction
  apiAddReplyOnNewFeedCommentReaction = 'feed/comment/reply/reactions/create',

  // api count number of new feed comments by new feed and by status
  apiCountNumberOfNewFeedCommentsByNewFeedAndByStatus = 'feed/comments/count',

  // check user wants to view exercise's video from exercise-detail component. Therefore, when user comes back to
  // exercise-detail component. Number of repetitions is still there. When exercise-detail component is destroy, this
  // local storage will be destroyed too.
  checkUserGoToExerciseVideo = 'checkUserGoToExerciseVideo',

  // api make payment
  apiMakePayment = 'paypal/make/payment',

  // complete payment
  apiCompletePayment = 'paypal/complete/payment',

  // check what user want to pay
  checkWhatUserWantToPay = 'checkWhatUserWantToPay',

  // current user profile is used for payment method
  currentUserProfile = 'currentUserProfile',

  // current coach is used for payment method
  currentCoach = 'currentCoach',

  // current selected coach membership notification is used for payment methos
  currentCoachMembershipNotification = 'currentCoachMembershipNotification',

  // api get product orders by user profile and product order status and by page
  apiGetProductOrdersByUserProfileIdAndProductOrderStatusAndByPage = 'product/orders/paging',

  // count number of product orders by user profile and product order status and by page
  apiCountNumberOfProductOrdersByUserProfileIdAndProductOrderStatus = 'product/orders/count',

  // api get product order details by product order
  apiGetProductOrderDetailsByProductOrder = 'product/order/details',

  // api add coach membership notification
  apiAddCoachMembershipNotification = 'coach/membership/notifications/create',

  // api update coach membership notification
  apiUpdateCoachMembershipNotification = 'coach/membership/notifications/update',

  // api get coach membership notification by user profile id and by coach id and by status
  apiGetCoachMembershipNotificationByUserProfileIdAndByCoachIdAndByStatus = 'coach/membership/notifications',

  // api get coach membership notification by coach id and by keyword and by page
  apiGetCoachMembershipNotificationsByCoachIdAndByKeywordAndByPage = 'coach/notifications/paging',

  // api get number of coach membership notification by coach id and by keyword
  apiGetNumberOfCoachMembershipNotificationsByCoachIdAndByKeyword = 'coach/notifications/count',

  // api get coach membership notifications by usr profile id and by keyword and by page
  apiGetCoachMembershipNotificationsByUserProfileIdAndByKeywordAndByPage = 'membership/notifications/paging',

  // api get number of coach membershop notification by coach id and by keyword
  apiGetNumberOfCoachMembershipNotificationsByUserProfileIdAndByKeyword = 'membership/notifications/count',

  // api product payment
  apiAddProductPayment = 'product/payment/create',

  // api coach payment
  apiAddCoachPayment = 'coach/payment/create',

  // api add membership
  apiAddMembership = 'memberships/create',

  // api update membership
  apiUpdateMembership = 'memberships/update',

  // api get membership by coach and by user profile
  apiGetMembershipByCoachAndByUserProfile = 'memberships',

  // api get coach payments by coach id, month, year and page
  apiGetCoachPaymentsByCoachIdByMonthByYearByPage = 'coach/payment/paging',

  // api count number of coach payments by coach id, month, year
  apiCountCoachPaymentsByCoachIdAndByMonthAndByYear = 'coach/payment/count',

  // api get total payment by coach id, month, year
  apiGetTotalPaymentByCoachIdAndByMonthAndByYear = 'coach/payment/total',

  // api get coach payments by coach id, month, year and page
  apiGetCoachPaymentsByUserProfileIdByMonthByYearByPage = 'user/payment/paging',

  // api count number of coach payments by coach id, month, year
  apiCountCoachPaymentsByUserProfileIdAndByMonthAndByYear = 'user/payment/count',

  // api get total payment by user profile id and by month, year
  apiGetTotalPaymentByUserProfileIdAndByMonthAndByYear = 'user/payment/total',

  // api add notification
  apiAddNotification = 'notification/create',

  // api get notifications by user profile id and by page
  apiGetNotificationsByUserProfileIdAndByPage = 'notifications/paging',

  // api count notifications by user profile id and by page
  apiCountNotificationsByUserProfileId = 'notifications/count'


}
