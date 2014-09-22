Template.accessDenied.events({
    'click #toggle-signin-dropdown': function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#login-dropdown-list .dropdown-toggle').dropdown('toggle');
        console.log("calling dropdown");
    }
});
