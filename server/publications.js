Meteor.publish('posts', function(options) {
  return Posts.find({}, options);
});

Meteor.publish('projectPosts', function(projectId, options) {
  return Posts.find({projectId: projectId}, options);
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
  return Projects.find();
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