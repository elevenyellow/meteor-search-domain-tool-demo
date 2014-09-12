// Tracker.autorun(function () {
//   Meteor.subscribe("singleProject", Session.get("currentProjectId"));
//   // console.log("subscribed to singleProject: " + Session.get("currentProjectId"));
// });

isDomainAvailable = function (domain, callback) {
  // console.log("calling isDomainAvailable from client for ", domain);
  Meteor.call('isDomainAvailable', domain, callback);
}
