Projects = new Meteor.Collection('projects');


// Projects.allow({
//   update: ownsDocument,
//   remove: ownsDocument
// });

// Projects.deny({
//   update: function(userId, project, fieldNames) {
//     // may only edit the following two fields:
//     return (_.without(fieldNames, 'title').length > 0);
//   }
// });


Meteor.methods({
  createProject: function(projectAttributes) {
    var user = Meteor.user()
    
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to project new stories");
    
    // ensure the project has a title
    if (!projectAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');
    
    
    
    // pick out the whitelisted keys
    var project = _.extend(_.pick(projectAttributes, 'title'), {
      ownerId: user._id, 
      owner: user.username, 
      submitted: new Date().getTime(),
    });
    
    var projectId = Projects.insert(project);
    console.log("projectId: "+ projectId);
    
    return projectId;
  },
  
});