export enum Config {
  apiBaseUrl = 'http://localhost:8080/greenwich-fitness/api/v1',

  // api url parameters
  statusParameter = 'status',
  userProfileIdParameter = 'userProfileId',
  pageParameter = 'page',
  searchParameter = 'search',
  categoryIdParameter = 'categoryId',
  tagStatusParameter = 'tagStatus',
  postStatusParameter = 'postStatus',
  topParameter = 'top',
  userNameParameter = 'userName',
  minPriceParameter = 'minPrice',
  maxPriceParameter = 'maxPrice',
  sumParameter = 'sum',
  coachIdParameter = 'coachId',
  trainingDateParameter = 'trainingDate',
  paymentIdParameter = 'paymentId',
  payerIdParameter = 'payerId',
  monthParameter = 'month',
  yearParameter = 'year',

  // common value
  numberItemsPerPage = 8,
  currentPage = 1,

  // api header
  headerXTotalCount = 'X-Total-Count',
  headerXTotalPage = 'X-Total-Page',
  headerXTotalPayment = 'X-Total-Payment',

  // api about management
  apiAboutManagementPrefix = 'about-management',
  apiAbouts = 'abouts',

  // api coach management
  apiCoachManagementPrefix = 'coach-management',
  apiCoaches = 'coaches',
  apiCoachFeedbacks = 'feedbacks',
  apiCoachFeedbackReactions = 'feedback-reactions',
  apiRepliesOnCoachFeedback = 'replies',
  apiReplyOnCoachFeedbackReactions = 'reply-reactions',
  apiCoachRates = 'rates',

  // api membership management
  apiMembershipManagementPrefix = 'membership-management',
  apiMemberships = 'memberships',
  apiMembershipCoaches = 'coaches',

  // api contact management
  apiContactManagementPrefix = 'contact-management',
  apiContacts = 'contacts',

  // api feed management
  apiNewFeedManagementPrefix = 'feed-management',
  apiNewFeeds = 'feeds',
  apiNewFeedReactions = 'reactions',
  apiNewFeedComments = 'comments',
  apiNewFeedCommentReactions = 'comment-reactions',
  apiRepliesOnNewFeedComment = 'replies',
  apiReplyOnNewFeedCommentReactions = 'reply-reactions',

  // api gallery management
  apiGalleryManagementPrefix = 'gallery-management',
  apiGalleries = 'galleries',

  // api music management
  apiMusicManagementPrefix = 'music-management',
  apiMusics = 'musics',

  // api notification management
  apiNotificationManagementPrefix = 'notification-management',
  apiCoachMembershipNotifications = 'trainings',
  apiNotifications = 'notifications',

  // api payment management
  apiPaymentManagementPrefix = 'payment-management',
  apiCoachesPayment = 'coaches-payment',
  apiProductsPayment = 'products-payment',

  // api paypal management
  apiPaypalManagementPrefix = 'paypal-management',
  apiMakePayment = 'paypal/make/payment',
  apiCompletePayment = 'paypal/complete/payment',

  // api privacy policy management
  apiPrivacyPolicyManagementPrefix = 'privacy-policy-management',
  apiPrivacyPolicies = 'policies',

  // api post management
  apiPostManagementPrefix = 'post-management',
  apiPosts = 'posts',
  apiPostCategories = 'categories',
  apiPostComments = 'comments',
  apiPostCommentReactions = 'comment-reactions',
  apiRepliesOnPostComment = 'replies',
  apiReplyOnPostCommentReactions = 'reply-reactions',
  apiTags = 'tags',
  apiPostRates = 'rates',
  apiPostSlides = 'slides',

  // api product management
  apiProductManagementPrefix = 'product-management',
  apiProducts = 'products',
  apiProductCategories = 'categories',
  apiProductFeedbacks = 'feedbacks',
  apiProductFeedbackReactions = 'feedback-reactions',
  apiRepliesOnProductFeedback = 'replies',
  apiReplyOnProductFeedbackReaction = 'reply-reactions',
  apiProductOrders = 'orders',
  apiProductOrderDetails = 'order-details',
  apiProductSlides = 'slides',
  apiProductRates = 'rates',

  // api training management
  apiTrainingManagementPrefix = 'training-management',
  apiTrainings = 'trainings',

  // api upload management
  apiUploadManagementPrefix = 'upload-management',
  apiUploads = 'upload',

  // api user management
  apiUserManagementPrefix = 'user-management',
  apiUsers = 'users',
  apiLogin = 'login',
  apiFacebookLogin = 'login/facebook',
  apiGoogleLogin = 'login/google',
  apiRegister = 'register',
  apiUserAchievements = 'achievements',
  apiActiveUserAccount = 'account/active',
  apiUserBodyIndexes = 'indexes',
  apiFacebookAccount = 'facebook',
  apiGoogleAccount = 'google',
  apiSendEmailResetPassword = 'send-email-reset-password',
  apiChangeUserPassword = 'change-password',
  apiUserAccounts = 'accounts',
  apiUserProfiles = 'profiles',


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

  // selected product's category (for searching)
  selectedProductCategoryForSearching = 'selectedProductCategoryForSearching',

  // selected product's min price (for searching)
  selectedProductMinPriceForSearching = 'selectedProductMinPriceForSearching',

  // selected product's max price (for searching)
  selectedProductMaxPriceForSearching = 'selectedProductMaxPriceForSearching',

  // selected product's keywords (for searching)
  selectedProductNameKeywordsForSearching = 'selectedProductNameKeywordsForSearching',

  // shopping cart
  shoppingCart = 'shoppingCart',

  // selected post's category for searching
  selectedPostCategoryForSearching = 'selectedPostCategoryForSearching',

  // selected post's category's name for searching
  selectedPostNameKeywordsForSearching = 'selectedPostNameKeywordsForSearching',

  // check user wants to view exercise's video from exercise-detail component. Therefore, when user comes back to
  // exercise-detail component. Number of repetitions is still there. When exercise-detail component is destroy, this
  // local storage will be destroyed too.
  checkUserGoToExerciseVideo = 'checkUserGoToExerciseVideo',

  // check what user want to pay
  checkWhatUserWantToPay = 'checkWhatUserWantToPay',

  // current user profile
  currentUserProfile = 'currentUserProfile',

  // total coach payment
  totalCoachPayment = 'totalCoachPayment',

  // current coach
  currentCoach = 'currentCoach',

  // current selected coach membership notification is used for payment methos
  currentCoachMembershipNotification = 'currentCoachMembershipNotification'

}
