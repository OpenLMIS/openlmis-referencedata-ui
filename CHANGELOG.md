5.3.0 / In development
========================

New features:
* [OLMIS-3153](https://openlmis.atlassian.net/browse/OLMIS-3153)
    * Added facilityOperatorsService for communicating with the facilityOperators endpoints
    * Extended facilityService with the ability to save facility
* [OLMIS-3154](https://openlmis.atlassian.net/browse/OLMIS-3154): Changed facility view to edit screen.
* [OLMIS-3228](https://openlmis.atlassian.net/browse/OLMIS-3228): Create Download Current ISA Values page
* [OLMIS-2217](https://openlmis.atlassian.net/browse/OLMIS-2217): Added ability to send reset password email

Improvement:

* [OLMIS-2857](https://openlmis.atlassian.net/browse/OLMIS-2857): Added username filter to user list screen.
* [OLMIS-3283](https://openlmis.atlassian.net/browse/OLMIS-3283): Added a "Show password" option on password reset screen.

Bug fixes:

* Added openlmis-offline as a dependency to the referencedata-program module.

5.2.1 / 2017-09-01
========================

Improvements:

* [OLMIS-2780](https://openlmis.atlassian.net/browse/OLMIS-2780): User form now uses minimal facilities endpoint.

New functionality added in a backwards-compatible manner:

* [OLMIS-3085:](https://openlmis.atlassian.net/browse/OLMIS-3085) Made minimal facility list download and cache when user logs in.
* [OLMIS-2696](https://openlmis.atlassian.net/browse/OLMIS-2696): Added requisition group administration screen.
* [OLMIS-2698](https://openlmis.atlassian.net/browse/OLMIS-2698): Added geographic zone administration screens.
* [OLMIS-2853](https://openlmis.atlassian.net/browse/OLMIS-2853): Added view Supply Lines screen.
* [OLMIS-2600](https://openlmis.atlassian.net/browse/OLMIS-2600): Added view Program Settings screen.

Bug fixes

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
