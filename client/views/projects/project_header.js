Template.projectHeader.helpers({
    tabClass: function (tab) {
        if(this.tab == tab){
            return 'active'
        } else {
            return ''
        }
    },
    closedProjectHeaderAlertClass: function () {
        if(Session.equals('closedProjectHeaderAlert', true)){
            return 'hidden'
        } else {
            return ''
        }
    },

    
});



Template.projectHeader.rendered = function() {
    // console.log('Template.projectHeader.rendered.this', this.data.project.collaborators);
    var userId = Meteor.userId();
    // console.log('userId', userId);
    var isCollaborator = _.contains(this.data.project.collaborators, Meteor.userId());
    // console.log('isCollaborator', isCollaborator);
    if(!isCollaborator){
        Meteor.call('addCollaborator', this.data.project._id);
    }

    Session.setDefault('closedProjectHeaderAlert', false);

}

Template.projectHeader.events({
    'click .trigger-share': function(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('clicked .trigger-share');
        $('.share-project').click();
      },

    'click .close': function(){
        console.log('click .close');
        Session.set('closedProjectHeaderAlert', true);
    }

      
});


Template.unreadMessages.helpers({
    unreadMessages: function () {
        var total = Messages.find().count();
        // console.log('Template.unreadMessages', this.project._id);
        var read = Session.get('readMessages'+this.project._id) || 0;
        return total-read;
    },
    
});

Template.userPill.labelClass = function() {
  if (this.status && this.status.idle)
    return "label-warning"
  else if (this.status && this.status.online)
    return "label-success"
  else
    return "label-default"
};