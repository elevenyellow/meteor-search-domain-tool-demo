Template.postPage.helpers({
  comments: function() {
    return Comments.find({postId: this._id});
  }, 
  project: function(){
    return Projects.findOne(Session.get('currentProjectId'));
  }
});