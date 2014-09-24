Projects = new Meteor.Collection('projects');


Projects.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Projects.deny({
  update: function(userId, project, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title').length > 0);
  }
});


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
      collaborators: [user._id],
    });
    
    var projectId = Projects.insert(project);
    console.log("projectId: "+ projectId);
    
    return projectId;
  },

  removeProject: function(projectId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to remove a project");

    var project = Projects.findOne(projectId);
    if (user._id != project.ownerId) {
      console.log("removing collaborator from project:", project.title);
      Projects.update({
            _id: projectId, 
            collaborators: {$in: [user._id]}
          }, {
            $pull: {collaborators: user._id}
          });

    } else {
      console.log("removing project:", project.title);
      // todo: remove project, project posts and posts comments
      var projectPosts = Posts.find({projectId: projectId}).fetch();
      //console.log("projectPosts:", projectPosts);


      for (var i = 0; i < projectPosts.length; i++) {
        console.log("projectPost:", projectPosts[i].title);
        // var postComments = Comments.find({postId:projectPosts[i]._id}).fetch();
        // console.log("postComments:", postComments);
        Comments.remove({postId:projectPosts[i]._id});


      };

      Messages.remove({projectId: projectId});
      Projects.remove(projectId);
    }

  },

  addCollaborator: function(projectId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to add it to your projects");

    var project = Projects.findOne(projectId);
    Projects.update({
      _id: projectId, 
      collaborators: {$nin: [user._id]}
    }, {
      $addToSet: {collaborators: user._id}
    });

    console.log("called addCollaborator:", user._id, projectId);

  },


  
});