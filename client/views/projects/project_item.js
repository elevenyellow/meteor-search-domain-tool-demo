Template.projectItem.events({
  'click .remove-project': function(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('clicked .remove-project');

    if (confirm("Delete this project?")) {
      Meteor.call('removeProject', this._id);
      Router.go('projectsList');
    }


    
  },
  'click .share-project': function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('clicked .share-project');
      $('#share-project-modal .modal-body p').html(Meteor.absoluteUrl(Router.path('projectPage', {_id: this._id}).substring(1)));
      $('#share-project-modal').modal('show');
      // Meteor.call('removeProject', this._id);
    },

    'click .edit-project': function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('clicked .edit-project');

      Router.go('projectEdit', {_id:this._id});

      
    },
});


Template.projectItem.rendered = function() {
    // $('.tip').tooltip();
};

Template.projectItem.helpers({
    editProjectClass: function () {
        if(Meteor.userId() == this.ownerId){
            return 'visible'
        } else {
            return ''
        }
    },
    
});

