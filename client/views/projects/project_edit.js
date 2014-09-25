Template.projectEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentProjectId = this._id;
    
    var title = $(e.target).find('[name=title]').val();

    if (!title) {
      throwError('Please fill in a name');
      return false;
    }

    var projectProperties = {
      title: title
    }

    Projects.update(currentProjectId, {$set: projectProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('projectPage', {_id: currentProjectId});
      }
    });
  },
  
 
});

Template.projectEdit.rendered = function() {
  $('#project-title').focus();

};
