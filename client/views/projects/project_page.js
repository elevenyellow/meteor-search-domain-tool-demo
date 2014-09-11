Template.projectPage.helpers({
    tabClass: function (tab) {
        if(this.tab == tab){
            return 'active'
        } else {
            return ''
        }
    },
    // postsWithRank: function() {
    //     this.posts.rewind();
    //     return this.posts.map(function(post, index, cursor) {
    //       post._rank = index;
    //       return post;
    //   });
    // }
});

// Template.projectPage.events({
//     'click .remove-positions': function(){
//         console.log("click .remove-positions");
//         Positions.remove({});
//         console.log(" Positions.remove({});");
//         console.log(" Positions: ", Positions.find().fetch());
//     }

// });

