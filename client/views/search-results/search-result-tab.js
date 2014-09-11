var myInterval = 0;

Template.searchResultTab.events({
  'submit #add-tag-form': function(e) {
    
    $('#add-tag-form-fieldset').prop('disabled', true);
    e.preventDefault();
    
    var title =  $(e.target).find('[name=title]').val();
    console.log("title: ", title);

    var loopCounter = 0;
    
    var iFrequency = 1000;
    var loopTotal = prefixes_list.length;
    // var loopTotal = 5;

    function _checkDomain(i, check_type) {
      console.log("_checkDomain", i, check_type, prefixes_list[i]);
      if(check_type == 'prefix'){
        var domain = prefixes_list[i] + title + '.com';
      } else {
        var domain = title + prefixes_list[i] + '.com';
      }
      
      console.log('domain: ', domain);
      isDomainAvailable(domain, function(error, result){
        console.log("result: ", result.result)
        if (result.result.available){
          SearchResults.insert(
            {
              title: result.result.domain,
              projectId: Session.get('currentProjectId')
            }
          );
        }
      });
    }


    function startLoop() {
        $('.stop-search').removeClass('disabled');
        $('.spinner-wp').show();
        myInterval = Meteor.setInterval(function () {
            if(loopCounter > (loopTotal - 2)) {
              clearInterval(myInterval);  // stop
              $('#add-tag-form-fieldset').prop('disabled', false);
              $('.stop-search').addClass('disabled');
              $('.spinner-wp').hide();
            }
            console.log("loopCounter", loopCounter, "loopTotal", loopTotal);
            _checkDomain(loopCounter, 'prefix');
            _checkDomain(loopCounter, 'sufix');
            loopCounter = loopCounter + 1;
        }, iFrequency );  // run
    }

    startLoop();
    
    // for (var i = 0; i < /*prefixes_list.length*/ 10 ; i++) {
    //   _checkDomain(i, 'prefix');
    //   _checkDomain(i, 'sufix');
    // };
    
  },

  'click .remove-all': function(e) {
    e.preventDefault();
    SearchResults.remove({});
  },

  'click .stop-search': function(e) {
    e.preventDefault();
    clearInterval(myInterval);
    $('#add-tag-form-fieldset').prop('disabled', false);
    $('.stop-search').addClass('disabled');
    $('.spinner-wp').hide();
  }  

});