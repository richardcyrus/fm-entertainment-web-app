# Features and User Stories

## View the optimal layout for the app depending on their device's screen size

**User Story**
As a user,
I want the navigation to be full-width at the top on mobile screens

**Acceptance Criteria**
Given that a user visits the app from a mobile device
When they visit the Home page
Then the navigation bar will be full-width at the top of the screen

Given that a user visits the app from a mobile device
When they visit the Movies page
Then the navigation bar will be full-width at the top of the screen

Given that a user visits the app from a mobile device
When they visit the TV Series page
Then the navigation bar will be full-width at the top of the screen

Given that a user visits the app from a mobile device
When they visit the Bookmarked shows page
Then the navigation bar will be full-width at the top of the screen

**User Story**
As a user,
I want the navigation to be full-width at the top on tablet screens

**Acceptance Criteria**
Given that a user visits the app from a tablet device
When they visit the TV Series page
Then the navigation bar will be full-width at the top of the screen

Given that a user visits the app from a tablet device
When they visit the Movies page
Then the navigation bar will be full-width at the top of the screen

Given that a user visits the app from a tablet device
When they visit the Home page
Then the navigation bar will be full-width at the top of the screen

Given that a user visits the app from a tablet device
When they visit the Bookmarked shows page
Then the navigation bar will be full-width at the top of the screen

**User Story**
As a user,
I want the navigation to be fixed to the left on larger screens

**Acceptance Criteria**
Given that a user visits the app from a laptop or larger screen device
When they visit the Home page
Then the navigation bar will be fixed to the left of the screen

Given that a user visits the app from a laptop or larger screen device
When they visit the Movies page
Then the navigation bar will be fixed to the left of the screen

Given that a user visits the app from a laptop or larger screen device
When they visit the TV Series page
Then the navigation bar will be fixed to the left of the screen

Given that a user visits the app from a laptop or larger screen device
When they visit the Bookmarked shows page
Then the navigation bar will be fixed to the left of the screen

**User Story**
As a user,
I want the trending section on the Home page to scroll sideways in a single row on all screen sizes

**Acceptance Criteria**
Given that a user visits the Home page
When the Trending section is displayed
Then it should scroll to the left

## See hover states for all interactive elements on the page

**User Story**
As a user,
I want to see hover/active states on non-touch devices
so I know which elements are interactive

**Acceptance Criteria**
Given that a user visits the app from a non-touch device
When interactive elements are displayed
Then when the mouse is hovered over such element, hover/active states should display

## Navigate between Home, Movies, TV Series, and Bookmarked Shows pages

**User Story**
As a user,
I want the Movies page to only show videos with a category of "Movies"

**Acceptance Criteria**
Given that a user visits the app
When they choose the Movies page
Then only videos with a category of Movies should be displayed

**User Story**
As a user
I want the TV Series page to only show videos with a category of "TV Series"

**Acceptance Criteria**
Given that a user visits the app
When they choose the TV Series page
Then only videos with a category of TV Series should be displayed

**User Story**
As a user,
I want the Bookmarked Shows page to show all bookmarked videos.

**Acceptance Criteria**
Given that a user visits the app
When they choose the Bookmarked Shows page
Then Movies and TV Series that have been bookmarked should be displayed.

## Add/Remove bookmarks for all movies and TV series

**User Story**
As a user,
I want to be able to bookmark a movie

**Acceptance Criteria**

Given that a user finds a movie they want to visit later
When they choose to bookmark the movie
Then the movie should be persisted to the Bookmarked shows page.

**User Story**
As a user,
I want to be able to bookmark a TV Series

**Acceptance Criteria**
Given that a user finds a TV show they want to visit later
When they choose to bookmark the TV show
Then the TV show should be persisted to the Bookmarked shows page

**User Story**
As a user,
I want to be able to remove a bookmark from a Movie

**Acceptance Criteria**
Given that a user chooses to remove the bookmark from a movie
When they choose the option to remove the bookmark
Then the movie should be removed from the Bookmarked shows page

**User Story**
As a user,
I want to be able to remove a bookmark from a TV Series

**Acceptance Criteria**
Given that a user chooses to remove the bookmark from a TV show
When they choose the option to remove the bookmark
Then the TV show should be removed from the Bookmarked shows page

## Search for relevant shows on all pages

**User Story**
As a user,
I want search on the Home page to search all movies and all TV series

**Acceptance Criteria**
Given a user initiates a search
When on the homepage
Then the search should return movies and TV series


**User Story**
As a user,
I want search on the Movies page to only return movies

**Acceptance Criteria**
Given a user initiates a search
When on the Movies page
Then the search should only return results from the movies category

**User Story**
As a user,
I want search on the TV Series page to only return TV Series

**Acceptance Criteria**
Given a user initiates a search
When on the TV series page
Then the search should only return results from the TV Series category

**User Story**
As a user,
I want search on the Bookmarked Shows page to search through all bookmarked videos.

**Acceptance Criteria**
Given a user initiates a search
When on the Bookmarks page
Then the search should return bookmarked TV Series and bookmarked movies
