Meteor.publish('posts', function(options) {
  return Posts.find({}, options);
});

Meteor.publish('projectPosts', function(projectId, options) {
  return Posts.find({projectId: projectId}, options);
});


process.env.HTTP_FORWARDED_COUNT = 1

Meteor.publish('projectUsers', function(projectId) {
  var project = Projects.findOne(projectId);
  // console.log('project.collaborators', project.collaborators);
  return Meteor.users.find({_id: {$in: project.collaborators} }, {fields: {'username': 1, 'status': 1}});
});



Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});


Meteor.publish('comments', function(postId) {
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});

Meteor.publish('projects', function() {
  //return Projects.find({ownerId:this.userId});
  return Projects.find({
    $or: [ {collaborators: {$in: [this.userId]} }, { ownerId: this.userId } ]
  });
});

Meteor.publish('singleProject', function(id) {
  return id && Projects.find(id);
});

Meteor.publish('projectMessages', function(projectId, options) {
  return Messages.find({projectId: projectId}, options);
});

Meteor.publish('prefixes', function() {
  return Prefixes.find({active: true});
});