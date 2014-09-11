Template.searchResultItem.events({
  'click .add-to-candidates': function(e) {
    e.preventDefault();

    var title = this.title.replace(/ /g,'').replace(/.com/g,'');
    
    var post = {
      title: title,
      projectId: this.projectId,
    }

    
    Meteor.call('post', post, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        
      }
    });

    SearchResults.remove(this._id);

  },
  'click .remove-from-candidates': function(e) {
    e.preventDefault();

    SearchResults.remove(this._id);

  }

});