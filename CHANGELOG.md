5.6.17 / 2025-11-27
==================
New functionality:
* [OLMIS-8125](https://openlmis.atlassian.net/browse/OLMIS-8125): Added User Roles import/export
Bug fixes:
* [SELV3-782](https://openlmis.atlassian.net/browse/SELV3-782): Improved validation in modal when creating new Report


5.6.16 / 2025-03-31
==================
Improvements:
* [OLMIS-8044](https://openlmis.atlassian.net/browse/OLMIS-8044): Added translations to home page alerts component
* [OLMIS-8029](https://openlmis.atlassian.net/browse/OLMIS-8029): Made buq currency configurable and set it to $
* [OLMIS-8056](https://openlmis.atlassian.net/browse/OLMIS-8056): Added missing filter and pagination in requisiiton group edit
New functionality:
* [OLMIS-8082](https://openlmis.atlassian.net/browse/OLMIS-8082): Added UI for exporting population and added translations to the import/export component
* [OLMIS-8108](https://openlmis.atlassian.net/browse/OLMIS-8108): Added improved UI for data import. And users export/import type.
Bug fixes:
* [OLMIS-8095](https://openlmis.atlassian.net/browse/OLMIS-8095): Fixed user creation validation. And prevented user with wrong contact data from being stored in the system.
* [OLMIS-8105](https://openlmis.atlassian.net/browse/OLMIS-8105): removed not working, deleting supported programs feature. From Tanzania
* [OLMIS-8106](https://openlmis.atlassian.net/browse/OLMIS-8106): Removed unused skipSecondApproval variable
* [OLMIS-8107](https://openlmis.atlassian.net/browse/OLMIS-8107): Fixed breadcrumbs in add mode and removing facilities from table in edit mode.

5.6.15 / 2025-01-13
==================
New functionality:
* [SELV3-782](https://openlmis.atlassian.net/browse/SELV3-782): Added Reports Management Page in Administration
* [SELV3-784](https://openlmis.atlassian.net/browse/SELV3-784): Added Home Page Report Component to home page

5.6.14 / 2024-12-17
==================
* [OLMIS-8053](https://openlmis.atlassian.net/browse/OLMIS-8053): Enable the integration of country-level population data into the system

5.6.13 / 2024-10-31
==================
Improvements:
* [OLMIS-7954](https://openlmis.atlassian.net/browse/OLMIS-7954): Improved the scalability of local storage and login performance for /api/requisitionGroups request
* [OLMIS-7992](https://openlmis.atlassian.net/browse/OLMIS-7992): Added requisition groups cache
* [OIS-24](https://openlmis.atlassian.net/browse/OIS-24): Adjusted all components styles to support RTL

New functionality:
* [OLMIS-7976](https://openlmis.atlassian.net/browse/OLMIS-7976): Added homepage alerts component
* [OLMIS-7989](https://openlmis.atlassian.net/browse/OLMIS-7989): Added Facilities type to import and export data functionality

Bug fixes:
* [OLMIS-7749](https://openlmis.atlassian.net/browse/OLMIS-7749): Added note in popover on Supply Line page if there are not memeber facilities
* [OLMIS-7900](https://openlmis.atlassian.net/browse/OLMIS-7900): Updated breadcrumbs and added missing nav tag to New Requisition Group page
* [OLMIS-6908](https://openlmis.atlassian.net/browse/OLMIS-6908): Adding non-full supply product to the R&R

5.6.12 / 2024-04-19
==================
New functionality that are backwards-compatible:
* [OLMIS-7838](https://openlmis.atlassian.net/browse/OLMIS-7838): Move BUQ and TM Monthly functionalities from Tanzania to Core instance

5.6.11 / 2023-11-07
==================

New functionality that are backwards-compatible:
* [OLMIS-7752](https://openlmis.atlassian.net/browse/OLMIS-7752): Added Loading Component to Data Export and Import Pages
* [OLMIS-7673](https://openlmis.atlassian.net/browse/OLMIS-7673): Add import page

Bug fixes:
* [OLMIS-7802](https://openlmis.atlassian.net/browse/OLMIS-7802): Fix issue related to second approve

5.6.10 / 2023-06-26
==================

Bug fixes:
* [OLMIS-7772](https://openlmis.atlassian.net/browse/OLMIS-7772): Fix issues with new Chrome popover functionality
* [OLMIS-7723](https://openlmis.atlassian.net/browse/OLMIS-7723): Fix error related to 'Approve buttons not visible when trying to approve requisition'

5.6.9 / 2023-04-05
==================

New functionality that are backwards-compatible:
* [OLMIS-7649](https://openlmis.atlassian.net/browse/OLMIS-7649): Prepare administrator page for data export
* [OLMIS-7705](https://openlmis.atlassian.net/browse/OLMIS-7705): Implement sending to backend 'data export'
* [OLMIS-7707](https://openlmis.atlassian.net/browse/OLMIS-7707): Add the option of selecting export right + secure export page

5.6.8 / 2022-10-07
==================

New functionality that are backwards-compatible:
* [OLMIS-7604](https://openlmis.atlassian.net/browse/OLMIS-7604): Added valid destination page to the administration panel
* [OLMIS-7603](https://openlmis.atlassian.net/browse/OLMIS-7603): Added valid sources in administration panel

5.6.7 / 2022-04-21
==================

New functionality that are backwards-compatible:
* [OLMIS-7462](https://openlmis.atlassian.net/browse/OLMIS-7462): Show all lots when entering lot management page
* [OLMIS-7443](https://openlmis.atlassian.net/browse/OLMIS-7443): Add lot management view page
* [OLMIS-7444](https://openlmis.atlassian.net/browse/OLMIS-7444): Add edit modal to lot management page
* [OLMIS-7452](https://openlmis.atlassian.net/browse/OLMIS-7452): Add ORDER_CREATE right
* [OLMIS-7501](https://openlmis.atlassian.net/browse/OLMIS-7501): Add CCE_INVENTORY_TRANSFER right

Improvements:
* [OLMIS-6545](https://openlmis.atlassian.net/browse/OLMIS-6545): Add missing translation adminOrderableEdit.failedToUpdateProduct


5.6.6 / 2021-10-28
==================

Improvements:
* [OLMIS-7405](https://openlmis.atlassian.net/browse/OLMIS-7405): Minimize difference between uat Mobile UI and demo-v3 Mobile UI servers
* [OLMIS-7342](https://openlmis.atlassian.net/browse/OLMIS-7342): Create navigation bar and make it responsive.
* [OLMIS-7321](https://openlmis.atlassian.net/browse/OLMIS-7321): Improved the home page screen to be responsive.
* [OLMIS-7318](https://openlmis.atlassian.net/browse/OLMIS-7318): Added the ability to hide unnecessary modules on mobile.
* [OLMIS-7314](https://openlmis.atlassian.net/browse/OLMIS-7314): Update scss files to enable webpack build.

Bug fixes:
* [OLMIS-7422](https://openlmis.atlassian.net/browse/OLMIS-7422): Fix internal application error after trying to "Edit"  Supervisory Nodes.
* [OLMIS-7420](https://openlmis.atlassian.net/browse/OLMIS-7420): Fix internal application error during Unpacking the kit
* [OLMIS-7417](https://openlmis.atlassian.net/browse/OLMIS-7417): Fix internal application error when navigating to user's profile

5.6.5 / 2021-05-27
==================

Improvements:
* [OLMIS-7176](https://openlmis.atlassian.net/browse/OLMIS-7176): Added a possibility to get lots from local storage in offline mode.
* Updated dev-ui version to 9.0.2.
* Updated ui-components version to 7.2.5.
* Updated auth-ui version to 6.2.6.
* Updated ui-layout version to 5.1.9.

New functionality that are backwards-compatible:
* [OLMIS-7187](https://openlmis.atlassian.net/browse/OLMIS-7187): Added the ability to cache Lots and Orderable Fulfills in the local storage and Orderables in the local database on login.
* [OLMIS-7204](https://openlmis.atlassian.net/browse/OLMIS-7204): Added the error message when no facilities are available in offline mode.
* [OLMIS-7197](https://openlmis.atlassian.net/browse/OLMIS-7197): Added the count of pending offline events in a header in offline mode.
* [OLMIS-7198](https://openlmis.atlassian.net/browse/OLMIS-7198): Added redirection from offline header to the pending offline events table.
* [OLMIS-7207](https://openlmis.atlassian.net/browse/OLMIS-7207): Added the count of sync event errors in a header in online mode.

Bug fixes:
* [OLMIS-7217](https://openlmis.atlassian.net/browse/OLMIS-7217): Removed permissions from local storage only if savedUsedId is defined.
* [OLMIS-7220](https://openlmis.atlassian.net/browse/OLMIS-7220): Updated cachedAllMinimal to get facilities from PouchDb when offline.

5.6.4 / 2020-11-17
==================

Bug fixes:
* [OLMIS-6970](https://openlmis.atlassian.net/browse/OLMIS-6970): Fix selecting products in the kit unpack list modal.

Improvements:
* Updated ui-components version to 7.2.4.
* Updated auth-ui version to 6.2.5.
* Updated ui-layout version to 5.1.8.

5.6.3 / 2020-05-12
==================

New functionality:
* [OLMIS-6901](https://openlmis.atlassian.net/browse/OLMIS-6901): Adding the lot and orderable-fulfills services with saving their values ​​to localstorage.

Improvements:
* Updated ui-components version to 7.2.3.
* Updated auth-ui version to 6.2.4.
* Updated ui-layout version to 5.1.7.

5.6.2 / 2020-04-14
==================

Bug fixes:
* [OLMIS-6696](https://openlmis.atlassian.net/browse/OLMIS-6696): Fixed calling to permission strings twice upon login.
* [OLMIS-6750](https://openlmis.atlassian.net/browse/OLMIS-6750): Fixed adding processing periods for different timezones.

5.6.1 / 2019-12-19
==================

New functionality:
* [OLMIS-6662](https://openlmis.atlassian.net/browse/OLMIS-6662): Added possibility to assign Role Assignments based on another User's Assigned Roles.

Bug fixes:
* [OLMIS-6580](https://openlmis.atlassian.net/browse/OLMIS-6580): Fixed malformed table on the Supply Lines screen when Requisition Group is empty.
* [OLMIS-6539](https://openlmis.atlassian.net/browse/OLMIS-6539): Refreshed state after save program orderable.
* [OLMIS-6665](https://openlmis.atlassian.net/browse/OLMIS-6665): Fixed broken editing of orderable kits.
* [OLMIS-6592](https://openlmis.atlassian.net/browse/OLMIS-6592): Fixed bug with user being able to see Requisitions tab despite not having a Home Facility or a proper role with a Supervisory Node.

5.6.0 / 2019-10-17
==================

New functionality:
* [OLMIS-6350](https://openlmis.atlassian.net/browse/OLMIS-6350): Added UI for displaying system notifications.
* [OLMIS-6347](https://openlmis.atlassian.net/browse/OLMIS-6347): Renamed ADMINISTRATIVE_MESSAGES_MANAGE right to SYSTEM_NOTIFICATIONS_MANAGE.
* [OLMIS-6359](https://openlmis.atlassian.net/browse/OLMIS-6359): Added UI for adding and editing system notifications.
* [OLMIS-6361](https://openlmis.atlassian.net/browse/OLMIS-6361): Added UI for displaying system notifications on Home page.
* [OLMIS-6388](https://openlmis.atlassian.net/browse/OLMIS-6388): Adjusted UI after renaming displayed property of system notification to isDisplayed.
* [OLMIS-6399](https://openlmis.atlassian.net/browse/OLMIS-6399): Adjusted UI after renaming openlmis.administration.systemNotification state to openlmis.administration.systemNotifications.
* [OLMIS-6443](https://openlmis.atlassian.net/browse/OLMIS-6443): Reworked orderable view to allow editing.
* [OLMIS-6442](https://openlmis.atlassian.net/browse/OLMIS-6442): Added UI for managing facility type approved products.
* [OLMIS-6471](https://openlmis.atlassian.net/browse/OLMIS-6471): Added new LOTS_MANAGE right.
* [OLMIS-6441](https://openlmis.atlassian.net/browse/OLMIS-6441): Added UI for managing program orderables.
* [OLMIS-6476](https://openlmis.atlassian.net/browse/OLMIS-6476): Added sorting of orderables by product name.
* [OLMIS-6488](https://openlmis.atlassian.net/browse/OLMIS-6488): Added orderables caching.
* [OLMIS-6419](https://openlmis.atlassian.net/browse/OLMIS-6419): Added FTAP caching.

Improvements:
* [OLMIS-6389](https://openlmis.atlassian.net/browse/OLMIS-6389): Added caching of system notifications on Home page and in header indicator.
* [OLMIS-6402](https://openlmis.atlassian.net/browse/OLMIS-6402): Renamed versionId field to versionNumber.
* [OLMIS-6222](https://openlmis.atlassian.net/browse/OLMIS-6222): Updated some pagination usages after changes in openlmis-pagination component.
* [OLMIS-6416](https://openlmis.atlassian.net/browse/OLMIS-6416): Modified caching facilities and processing periods on get and added VersionObjectReferenceDataBuilder to adjust to v2 requisition endpoints.
    * Added offline message property to orderable and ftap resources.

Bug fixes:
* [OLMIS-6330](https://openlmis.atlassian.net/browse/OLMIS-6330): fixed trigerring reference-ui build.
* [OLMIS-6357](https://openlmis.atlassian.net/browse/OLMIS-6357): Fixed logging into the application on Firefox with cleared history.
* [OLMIS-6438](https://openlmis.atlassian.net/browse/OLMIS-6438): Fixed searching for orderables on products modal.
* [OLMIS-6526](https://openlmis.atlassian.net/browse/OLMIS-6526): Fixed searching for requisition groups list.

5.5.1 / 2019-05-27
==================

New functionality:
* [OLMIS-6052](https://openlmis.atlassian.net/browse/OLMIS-6052): Added a UI for managing kit unpack list in product page

Improvements:
* [OLMIS-3773](https://openlmis.atlassian.net/browse/OLMIS-3773): Updated UI after changing /facilities endpoint to return page.
* [OLMIS-5000](https://openlmis.atlassian.net/browse/OLMIS-5000): Updated supply line service to use refactored endpoints
* [OLMIS-5837](https://openlmis.atlassian.net/browse/OLMIS-5837): Added the ability to check for right based on role assignment instead of permission strings.
* [OLMIS-6055](https://openlmis.atlassian.net/browse/OLMIS-6055): Added translations for superset report rights.
* [OLMIS-6020](https://openlmis.atlassian.net/browse/OLMIS-6020): Reworked user profile into multiple tabs.
* [OLMIS-3641](https://openlmis.atlassian.net/browse/OLMIS-3641): Added usage of REST expand pattern to supply line admin screen.
* [OLMIS-4944](https://openlmis.atlassian.net/browse/OLMIS-4944): Added caching locale settings on login.

Bug fixes:
* [OLMIS-5904](https://openlmis.atlassian.net/browse/OLMIS-5904): Fixed issue with a random order of programs and facilities in openlmis-facility-program-select component.
* [OLMIS-5204](https://openlmis.atlassian.net/browse/OLMIS-5204): Fixed facility type list pagination
* [OLMIS-5915](https://openlmis.atlassian.net/browse/OLMIS-5915): Fixed products disappear after removing one of the Facility on the Add/Edit Association screen
* [OLMIS-5983](https://openlmis.atlassian.net/browse/OLMIS-5983): Fixed problem with entering Supply Lines screen when supervisory node has no requisition group
* [OLMIS-6073](https://openlmis.atlassian.net/browse/OLMIS-6073): Reduced the number of requests for users, auth users and user contact details when logging in.
* [OLMIS-5913](https://openlmis.atlassian.net/browse/OLMIS-5913): Fixed facility getting unselected in facility/program selector during load.
* [OLMIS-6157](https://openlmis.atlassian.net/browse/OLMIS-6157): Fixed UI issues with the orderable details screen
* [OLMIS-6167](https://openlmis.atlassian.net/browse/OLMIS-6167): Fixed UI issue of misplaced button after searching for products on the orderable details screen

5.5.0 / 2018-12-12
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-5354](https://openlmis.atlassian.net/browse/OLMIS-5354): Added Supply Partners list page.
* [OLMIS-5355](https://openlmis.atlassian.net/browse/OLMIS-5355): Added Add Supply Partner modal.
* [OLMIS-5625](https://openlmis.atlassian.net/browse/OLMIS-5625): Made Supervisory Node editable.
* [OLMIS-5643](https://openlmis.atlassian.net/browse/OLMIS-5643):
  * Added information about Partner Nodes to the View Supervisory Nodes page.
  * Added information about Partner Nodes to the View Supervisory Node page.
* [OLMIS-5623](https://openlmis.atlassian.net/browse/OLMIS-5623): Added Supply Partner view detail page.
* [OLMIS-5356](https://openlmis.atlassian.net/browse/OLMIS-5356):
  * Added select-products-modal component.
  * Added the ability to edit Supply Partners.

Improvements:
* [OLMIS-5134](https://openlmis.atlassian.net/browse/OLMIS-5134): Added ability to find user's role assignments by supervisoryNodeId and programId.
* [OLMIS-5409](https://openlmis.atlassian.net/browse/OLMIS-5409): Updated ui-components to version 7.0.0.
* [OLMIS-3696](https://openlmis.atlassian.net/browse/OLMIS-3696): Added dependency and development dependency locking.
* [OLMIS-5415](https://openlmis.atlassian.net/browse/OLMIS-5415): Disabled edit of some fields for externally managed facilities.
* [OLMIS-4292](https://openlmis.atlassian.net/browse/OLMIS-4292): Changed Facility Service and Facility Factory to reflect endpoint refactor.
* [OLMIS-5488](https://openlmis.atlassian.net/browse/OLMIS-5488): Added styles for select2 inside openlmis-facility-program-select component
* [OLMIS-5668](https://openlmis.atlassian.net/browse/OLMIS-5668):
  * Updated View User page to allow selecting whether user is enabled or not.
  * Removed the possibility to change login restricted as it has been removed from the model.

Bug fixes:
* [OLMIS-4403](https://openlmis.atlassian.net/browse/OLMIS-4403): Fix to appropriately show rights status under a give role
* [OLMIS-5798](https://openlmis.atlassian.net/browse/OLMIS-5798): Fix Report Only flag display when adding a processing period.

5.4.1 / 2018-10-01
==================

Improvements:
* [OLMIS-5235](https://openlmis.atlassian.net/browse/OLMIS-5235): Improved performance of login:
  * Made the requests when login concurrent (where possible).
  * Minimal Facilities are now cached in the LocalDatabase instead of the LocalStorage.

Bug fixes:
* [OLMIS-5235](https://openlmis.atlassian.net/browse/OLMIS-5235): FacilityProgramCacheService will now pass user ID when fetching user programs.

5.4.0 / 2018-08-16
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-2245](https://openlmis.atlassian.net/browse/OLMIS-2245): Added Users number column to Role List screen.
* [OLMIS-4732](https://openlmis.atlassian.net/browse/OLMIS-4732): Added role assignments tables to the User Profile screen.
* [OLMIS-4731](https://openlmis.atlassian.net/browse/OLMIS-4731): Added Change Password button on the User profile screen.
* [OLMIS-4833](https://openlmis.atlassian.net/browse/OLMIS-4833): Added Send Verification Email button on the user update and profile screens.
  * Added visual indication when there is pending verification
* [OLMIS-4980](https://openlmis.atlassian.net/browse/OLMIS-4980): Added Report Only flag to add processing period in edit processing schedule modal.
* [OLMIS-4835](https://openlmis.atlassian.net/browse/OLMIS-4835): Added ability to opt-out from notifications
* [OLMIS-5224](https://openlmis.atlassian.net/browse/OLMIS-5224): Added the OpenlmisPrinter class for showing/printing PDFs.

Improvements:
* [OLMIS-2998](https://openlmis.atlassian.net/browse/OLMIS-2998): Added served facilities popover to supply line and allowed filtering by program
* [OLMIS-4740](https://openlmis.atlassian.net/browse/OLMIS-4740): Added Jenkinsfile.
* [OLMIS-4730](https://openlmis.atlassian.net/browse/OLMIS-4730): Support new user resource fields
  * Modified user profile screen to allow see and edit own profile
  * Enable email validation
* [OLMIS-3519](https://openlmis.atlassian.net/browse/OLMIS-3519): Improved user password modal
  * user has two options to select: sending reset email or set password manually
  * if user has no email, the send email option is disabled
* [OLMIS-3795](https://openlmis.atlassian.net/browse/OLMIS-3795): Remove code duplication from admin-user-roles routes
* [OLMIS-4795](https://openlmis.atlassian.net/browse/OLMIS-4795): Updated dev-ui to version 8.
* [OLMIS-4813](https://openlmis.atlassian.net/browse/OLMIS-4813): Updated datepickers to use the new syntax.
* [OLMIS-4896](https://openlmis.atlassian.net/browse/OLMIS-4896): Handle new version of auth user endpoint
* [OLMIS-4813](https://openlmis.atlassian.net/browse/OLMIS-4813): Updated ui-components to version 6.0.0.
* [OLMIS-4830](https://openlmis.atlassian.net/browse/OLMIS-4830): Added popover with the list of rights when hover over role on the User Roles and User Profile screens.
  * Reworked typeNameFactory into right and roleType filters.
* [OLMIS-3240](https://openlmis.atlassian.net/browse/OLMIS-3240): Removed duplications in admin-facility modules.
* [OLMIS-4867](https://openlmis.atlassian.net/browse/OLMIS-4867): Add 'ORDERS_TRANSFER' in FULFILLMENT_RIGHTS constant.
* [OLMIS-4984](https://openlmis.atlassian.net/browse/OLMIS-4984): Refactored UserContactDetails to be a separate resource.
* [OLMIS-4985](https://openlmis.atlassian.net/browse/OLMIS-4985): Refactored ReferenceDataUser to be a separate resource.
* [OLMIS-4986](https://openlmis.atlassian.net/browse/OLMIS-4986): Refactored AuthUser to be a separate resource.

Bug fixes:
* [OLMIS-4613](https://openlmis.atlassian.net/browse/OLMIS-4613): Fixed error on User Roles screen when Supervisory Node is without facility
* [OLMIS-4402](https://openlmis.atlassian.net/browse/OLMIS-4402): Fixed column names for associated programs grid in Products view
* [OLMIS-4422](https://openlmis.atlassian.net/browse/OLMIS-4422): Fixed problem with entering the user roles screen.
  * if a user has no a home facility and some home facility roles, an error icon will be displayed next to those role assignments.
  * a user has ability to add new home facility roles but if the user has no home facility, those assignments will be ignored.
* [OLMIS-3675](https://openlmis.atlassian.net/browse/OLMIS-3675): Fixed pagination problems for nested views.
* [OLMIS-5179](https://openlmis.atlassian.net/browse/OLMIS-5179): Fixed problem with entering Supervisory Node Edit screen by getting facilities from cache.


5.3.0 / 2018-04-24
==================

New features:
* [OLMIS-3108:](https://openlmis.atlassian.net/browse/OLMIS-3108) Updated to use dev-ui v7 transifex build process
* [OLMIS-3828](https://openlmis.atlassian.net/browse/OLMIS-3828): Added Service Account list UI.
* [OLMIS-2695](https://openlmis.atlassian.net/browse/OLMIS-2695): Added Processing Schedule screens.
* [OLMIS-4027](https://openlmis.atlassian.net/browse/OLMIS-4027): Added Facility Type screens.

Improvements:

* [OLMIS-3306](https://openlmis.atlassian.net/browse/OLMIS-3306): Added role type column on the role list screen.
* [OLMIS-2285](https://openlmis.atlassian.net/browse/OLMIS-2285): Supported program start date is now editable on facility edit screen.
* [OLMIS-3403](https://openlmis.atlassian.net/browse/OLMIS-3403): Added query params for get facilities and get users.
* [OLMIS-2727](https://openlmis.atlassian.net/browse/OLMIS-2727): Added pagination for user roles tab.
* [OLMIS-3607](https://openlmis.atlassian.net/browse/OLMIS-3607): Added builders for period and schedule.
* [OLMIS-3542](https://openlmis.atlassian.net/browse/OLMIS-3542): Updated password modal title and button to be based on context.
* [OLMIS-3782](https://openlmis.atlassian.net/browse/OLMIS-3782): Added new flag (skipAuthorization) to the program object to match backend changes.
* [OLMIS-2666](https://openlmis.atlassian.net/browse/OLMIS-2666): Added create new program method in program service.
* [OLMIS-3805](https://openlmis.atlassian.net/browse/OLMIS-3805): Updated Roles UI to allow fulfillment roles to non-warehouses.
* [OLMIS-3918](https://openlmis.atlassian.net/browse/OLMIS-3918): Added new flag (supportLocallyFulfilled) to the supported program object to match backend changes.
* [OLMIS-3995](https://openlmis.atlassian.net/browse/OLMIS-3995): Extended LotDataBuilder with the withId method.
* [OLMIS-4087](https://openlmis.atlassian.net/browse/OLMIS-4087): Added new methods (buildAsDistrictHospital, buildAsDistrictStore) to FacilityTypeDataBuilder and updated facilityTypeService to support retrieving several types by ids.
* [OLMIS-4118](https://openlmis.atlassian.net/browse/OLMIS-4118): Show display unit for Dispensable
* [OLMIS-4384](https://openlmis.atlassian.net/browse/OLMIS-4384): Changed Supervisory Node Service to reflect endpoint refactor.
* [OLMIS-3325](https://openlmis.atlassian.net/browse/OLMIS-3325): Added Program column to Requisition Group list screen.

Bug fixes:
* [OLMIS-3501](https://openlmis.atlassian.net/browse/OLMIS-3501): Fixed caching home facility supervised programs.
* [OLMIS-3243](https://openlmis.atlassian.net/browse/OLMIS-3403): Added builders for ObjectReference, Facility, Program etc.
* [OLMIS-3727](https://openlmis.atlassian.net/browse/OLMIS-3727): Fixed getting user's programs.
* [OLMIS-3468](https://openlmis.atlassian.net/browse/OLMIS-3468): Fixed a bug with missing permissions after a relog.
* [OLMIS-3806](https://openlmis.atlassian.net/browse/OLMIS-3806): Fixed date picker to not change selected date
* [OLMIS-3759](https://openlmis.atlassian.net/browse/OLMIS-3759): Fixed program facility select to disable "supervised facility" if none to supervise.
* [OLMIS-4176](https://openlmis.atlassian.net/browse/OLMIS-4176): Fixed problems with loading modal on User Edit screen.
* [OLMIS-3599](https://openlmis.atlassian.net/browse/OLMIS-3599): Use ORDERABLES_MANAGE right instead of PRODUCTS_MANAGE right (it is not used on backend side)
* [OLMIS-4227](https://openlmis.atlassian.net/browse/OLMIS-4227): Fixed checking if role is already assigned.
* [OLMIS-4281](https://openlmis.atlassian.net/browse/OLMIS-4281): Updated Orderable service to use new reference data API.
* [OLMIS-4467](https://openlmis.atlassian.net/browse/OLMIS-4467): All facilities are cached upon login instead of only the active ones.
* [OLMIS-4443](https://openlmis.atlassian.net/browse/OLMIS-4443): Supply Lines list will no allow filtering by all facilities type (instead of only warehouses)
* [OLMIS-4187](https://openlmis.atlassian.net/browse/OLMIS-4187): Fixed no pagination on the Users list and no selected tab on the User Roles

5.2.2 / 2017-11-09
==================

New features:

* [OLMIS-3153](https://openlmis.atlassian.net/browse/OLMIS-3153)
    * Added facilityOperatorsService for communicating with the facilityOperators endpoints
    * Extended facilityService with the ability to save facility
* [OLMIS-3154](https://openlmis.atlassian.net/browse/OLMIS-3154): Changed facility view to edit screen.
* [OLMIS-3228](https://openlmis.atlassian.net/browse/OLMIS-3228): Create Download Current ISA Values page
* [OLMIS-2217](https://openlmis.atlassian.net/browse/OLMIS-2217): Added ability to send reset password email
* [OLMIS-396](https://openlmis.atlassian.net/browse/OLMIS-396): Added upload functionality to manage ISA screen.

Improvements:

* [OLMIS-2857](https://openlmis.atlassian.net/browse/OLMIS-2857): Added username filter to user list screen.
* [OLMIS-3283](https://openlmis.atlassian.net/browse/OLMIS-3283): Added a "Show password" option on password reset screen.
* [OLMIS-3296](https://openlmis.atlassian.net/browse/OLMIS-3296): Reworked facility-program select component to use cached rograms, minimal facilities and permission strings.
* Updated dev-ui version to 6.

Bug fixes:

* Added openlmis-offline as a dependency to the referencedata-program module.
* [OLMIS-3291](https://openlmis.atlassian.net/browse/OLMIS-3291): Fixed incorrect state name.
* [OLMIS-3499](https://openlmis.atlassian.net/browse/OLMIS-3499): Fixed changing username in title header.

5.2.1 / 2017-09-01
==================

Improvements:

* [OLMIS-2780](https://openlmis.atlassian.net/browse/OLMIS-2780): User form now uses minimal facilities endpoint.

New functionality added in a backwards-compatible manner:

* [OLMIS-3085:](https://openlmis.atlassian.net/browse/OLMIS-3085) Made minimal facility list download and cache when user logs in.
* [OLMIS-2696](https://openlmis.atlassian.net/browse/OLMIS-2696): Added requisition group administration screen.
* [OLMIS-2698](https://openlmis.atlassian.net/browse/OLMIS-2698): Added geographic zone administration screens.
* [OLMIS-2853](https://openlmis.atlassian.net/browse/OLMIS-2853): Added view Supply Lines screen.
* [OLMIS-2600](https://openlmis.atlassian.net/browse/OLMIS-2600): Added view Program Settings screen.

Bug fixes:

* [OLMIS-2905](https://openlmis.atlassian.net/browse/OLMIS-2905): User with only POD_MANAGE or ORDERS_MANAGE can now access 'View Orders' page.
* [OLMIS-2714](https://openlmis.atlassian.net/browse/OLMIS-2714): Fixed loading modal closing too soon after saving user.

5.2.0 / 2017-06-22
==================

New functionality added in a backwards-compatible manner:

* [OLMIS-2567](https://openlmis.atlassian.net/browse/OLMIS-2567): Added openlmis-facility-program-select component.
* [OLMIS-2729](https://openlmis.atlassian.net/browse/OLMIS-2729): Added getUserSupportedPrograms to program service.

Improvements:

* [OLMIS-2444](https://openlmis.atlassian.net/browse/OLMIS-2444): Added new "add" button class.
* [OLMIS-2384](https://openlmis.atlassian.net/browse/OLMIS-2384): Changed "email verified" label from text to checkbox and added cancel button to user edit page.
* [OLMIS-2385](https://openlmis.atlassian.net/browse/OLMIS-2385): Changed type message.
* [OLMIS-2495](https://openlmis.atlassian.net/browse/OLMIS-2495): Changed links to buttons on user list screen.
* [OLMIS-2494](https://openlmis.atlassian.net/browse/OLMIS-2494): Name, description and rights will
now properly be marked as required on the Role creation/edit screen.
* [OLMIS-2648](https://openlmis.atlassian.net/browse/OLMIS-2648): When changing user's home facility,
system also prompts for removing roles for old home facility.
* [OLMIS-2689](https://openlmis.atlassian.net/browse/OLMIS-2689): When filtering by home facility on initiate requisition view,
only programs supported by home facility are shown.
* [OLMIS-2446](https://openlmis.atlassian.net/browse/OLMIS-2446): Made Add/Edit title dynamic.
* [OLMIS-2411](https://openlmis.atlassian.net/browse/OLMIS-2411): Supervisory node dropdown always exists
  * If a role is getting assigned that is already assigned, an error notification is showed instead


5.1.0 / 2017-05-26
==================

New functionality added in a backwards-compatible manner:

* [OLMIS-2370](https://openlmis.atlassian.net/browse/OLMIS-2370) - Added list and view screens for Orderables.

Bug fixes

* [OLMIS-2445](https://openlmis.atlassian.net/browse/OLMIS-2445) - Button and title capitalization are consistent.

5.0.0 / 2017-05-08
==================

Compatibility breaking changes:

* [OLMIS-2107](https://openlmis.atlassian.net/browse/OLMIS-2107): Add breadcrumbs to top of page navigation
  * All states have been modified to be descendants of the main state.
* [OLMIS-2224](https://openlmis.atlassian.net/browse/OLMIS-2224): Fixed mocking localStorageFactory

New functionality added in a backwards-compatible manner:

* [OLMIS-2140](https://openlmis.atlassian.net/browse/OLMIS-2140): Admin Password Reset
* [OLMIS-2188](https://openlmis.atlassian.net/browse/OLMIS-2188): Admin UI screen View Roles
* [OLMIS-2189](https://openlmis.atlassian.net/browse/OLMIS-2189): Admin UI screen Create new role
* [OLMIS-2190](https://openlmis.atlassian.net/browse/OLMIS-2190): Admin UI screen assign Users to Roles
* [OLMIS-2215](https://openlmis.atlassian.net/browse/OLMIS-2215): Edit User Roles
* [OLMIS-2267](https://openlmis.atlassian.net/browse/OLMIS-2267): Email optional for user setup

Dev and tooling updates made in a backwards-compatible manner:

* [OLMIS-1853](https://openlmis.atlassian.net/browse/OLMIS-1853): Separate push and pull Transifex tasks in build
  * Migrated to dev-ui v3.
* [OLMIS-1609](https://openlmis.atlassian.net/browse/OLMIS-1609): UI i18N message strings are not standardized
