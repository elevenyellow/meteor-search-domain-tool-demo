Template.searchResultList.helpers({
  searchResults: function() {
    //console.log("SearchResults: ", SearchResults.find().fetch());
    // if (SearchResults.find().count() === 0) {
    //     console.log("SearchResults.find().count() === 0");
    //     for (var i = 0; i < 3; i++) {
    //         SearchResults.insert(
    //           {
    //             title: 'testing'+i,
    //             projectId: Session.get('currentProjectId')
    //           }
    //         );
    //     };
    // }
    return SearchResults.find();
  }

});
