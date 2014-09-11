Template.postSubmit.events({
  'submit #add-candidate-form': function(e) {
    e.preventDefault();
    
    var post = {
      title: $(e.target).find('[name=title]').val(),
      projectId: $(e.target).find('[name=projectId]').val(),
    }

    $(e.target).find('[name=title]').val('');
    
    Meteor.call('post', post, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        
      }
    });



  }
});