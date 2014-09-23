Template.projectItem.events({
  'click .remove-project': function(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('clicked .remove-project');
    Meteor.call('removeProject', this._id);
  }
});