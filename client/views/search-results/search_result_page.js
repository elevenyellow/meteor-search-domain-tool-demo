var myInterval = 0;
var loopCounter = 0;
var iFrequency = 1000;
var loopTotal = prefixes_list.length;
var searchText = '';
var isPaused = false;

function _checkDomain(title, i, check_type) {
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

function stopSearch(){
  clearInterval(myInterval);  // stop
  loopCounter = 0;
  $('#add-tag-form-fieldset').prop('disabled', false);
  $('.pause-search').addClass('disabled');
  $('.stop-search').addClass('disabled');
  $('.resume-search').addClass('disabled');
  $('.spinner-wp').hide();
}

function pauseSearch(){
  clearInterval(myInterval);
  isPaused = true;
  $('.stop-search').removeClass('disabled');
  $('.pause-search').addClass('disabled');
  $('.resume-search').removeClass('disabled');
  $('.spinner-wp').hide();
}

function resumeSearch(){
  isPaused = false;
  startSearch();
}

function startSearch() {
    $('#add-tag-form-fieldset').prop('disabled', true);
    searchText =  $('#post-submit-input-id').val();
    console.log("searchText: ", searchText);
    $('.stop-search').removeClass('disabled');
    $('.pause-search').removeClass('disabled');
    $('.resume-search').addClass('disabled');
    $('.spinner-wp').show();
    
    myInterval = Meteor.setInterval(function () {
        if(loopCounter > (loopTotal - 2)) {
          stopSearch();
        }
        console.log("loopCounter", loopCounter, "loopTotal", loopTotal);
        _checkDomain(searchText, loopCounter, 'prefix');
        _checkDomain(searchText, loopCounter, 'sufix');
        loopCounter = loopCounter + 1;
    }, iFrequency );  // run
}



Template.searchResultPage.events({
  'submit #add-tag-form': function(e) {
    e.preventDefault();
    startSearch();

  },

  'click .remove-all': function(e) {
    e.preventDefault();
    SearchResults.remove({});
  },

  'click .stop-search': function(e) {
    e.preventDefault();
    stopSearch();
  },

  'click .pause-search': function(e) {
    e.preventDefault();
    pauseSearch();
  },

  'click .resume-search': function(e) {
    e.preventDefault();
    resumeSearch();
  }  

});

Template.searchResultPage.helpers ({
  'isRunning': function() {
    if(!isPaused && myInterval){
      return true;
    } else {
      return false;
    }
  }, 
  'isStopped': function() {
    return myInterval? false: true;
  }, 

  'isPaused': function() {
    return isPaused? true: false;
  }, 
  'searchText': function(){
    return searchText;
  }, 
  // 'fieldsetAttributes': function() {
  //   var attributes = {};
  //   if (this.isRunning()){
  //     attributes.disabled = true;
  //   }
  //   return attributes;
  // }, 

});