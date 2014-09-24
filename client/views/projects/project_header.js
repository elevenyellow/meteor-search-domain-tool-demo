Template.projectHeader.helpers({
    tabClass: function (tab) {
        if(this.tab == tab){
            return 'active'
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
    console.log('isCollaborator', isCollaborator);
    if(!isCollaborator){
        Meteor.call('addCollaborator', this.data.project._id);
    }

}