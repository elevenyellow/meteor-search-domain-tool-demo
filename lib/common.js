

if (Meteor.isServer) {
  Meteor.methods({
    'isDomainAvailable': function (domain) {
      domainLookup = DomainLookups.findOne({domain: domain});
      if (domainLookup){
        console.log("domainLookup found for ", domain);
        return {result: domainLookup};
      }
      else{
        var whoisApi = Meteor.npmRequire('node-whois');
        var whois = Async.runSync(function(done) {
          //console.log("whoisApi.lookup for ", domain);
          whoisApi.lookup(domain, 
            Meteor.bindEnvironment(function(err, data) {
              //console.log("data: ", data);
              var available = data.indexOf("No match for domain") != -1;
              response = {
                domain: domain,
                available: available 
              }
              DomainLookups.upsert({domain:domain}, {
                domain:domain, 
                available:available,
                created: new Date().getTime()
              });
              done(err, response);
            }, function (err) {console.log("couldn't wrap the callback"); })
          )
        });
        return whois;
      }
    }
  });
}





// if (Meteor.isServer) {
//   Meteor.methods({
//     'isDomainAvailable': function (domain) {
//       // check first if the result is cached in DomainLookups collection

//       domainLookup = DomainLookups.findOne({domain: domain});
//       if (domainLookup){
//         console.log("domainLookup found for ", domain);
//         return {result: domainLookup};
//       }
//       else{
//         console.log("domainLookup NOT found for ", domain);
//         var whoisApi = Meteor.npmRequire('node-whois');
//         var whois = Async.runSync(function(done) {
//           //console.log("whoisApi.lookup for ", domain);
//           whoisApi.lookup(domain, function(err, data) {
//               //console.log("data: ", data);
//               var available = data.indexOf("No match for domain") != -1;
//               response = {
//                 domain: domain,
//                 available: available 
//               }
//               //DomainLookups.insert(response);
//               DomainLookups.upsert({domain: domain}, {$set: response})
//               done(err, response);
//           })
//         });
//         return whois;
//       }

      
//     }
//   });
// }

