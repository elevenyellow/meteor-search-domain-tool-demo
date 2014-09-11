Template.projectSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var project = {
      title: $(e.target).find('[name=title]').val(),
    }
    
    Meteor.call('createProject', project, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        
        if (error.error === 302)
          Router.go('projectPage', {_id: error.details})
      } else {
        Router.go('projectPage', {_id: id});
      }
    });
  }
});