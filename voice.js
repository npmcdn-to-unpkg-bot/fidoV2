$( document ).ready(function() {
  console.log("hello world again");

  var audio = new Audio('ding.mp3');
  var end = new Audio('woosh.mp3');
  var toggle = false;
  var recognition = new webkitSpeechRecognition();
  var lucyActivated = false;
  var lucyTimer;
  if ('webkitSpeechRecognition' in window) {
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en";
    var final_transcript = '';
    var interim_transcript = '';
    recognition.start();

    recognition.onspeechstart = function(event) {
      start_timestamp = event.timeStamp;
    };

    recognition.onresult = function (event) {
      var final = "";
      var interim = "";
      var intent = "";

      for (var i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // log the latest phrase
          console.log(event.results[i][0].transcript);

          if(lucyActivated){
            clearTimeout(lucyTimer);
            lucyTimer = setTimeout(function(){ lucyActivated = false;}, 10000);
            // intent = getIntent(event.results[i][0].transcript);
          } else if( (event.results[i][0].transcript == "Archie") || (event.results[i][0].transcript == "Hello Archie") || (event.results[i][0].transcript == "Hey Archie") ){
            audio.play();
            lucyActivated = true;
            toggle = true;
            lucyTimer = setTimeout(function(){ lucyActivated = false;}, 10000);
          }
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
    };

    recognition.onend = function() {
      recognition.start();
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        console.log('info_no_speech');
        if (lucyActivated && toggle) {
          toggle = false;
          end.play();
        }
      }
      if (event.error == 'audio-capture') {
        console.log('info_no_microphone');
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          console.log('info_blocked');
        } else {
          console.log('info_denied');
        }
      }
    };
  }

  // extract an intent
  // var accessToken = "cfa415db33e24195927987711addac1c";
  // var subscriptionKey = "d0426b7da80d43b49c635e746ebd80df";
  // var baseUrl = "https://api.api.ai/v1/";

  // function getIntent(query) {
  //   console.log(query);
  //   $.ajax({
  //     type: "POST",
  //     url: baseUrl + "query/",
  //     contentType: "application/json; charset=utf-8",
  //     dataType: "json",
  //     headers: {
  //       "Authorization": "Bearer " + accessToken,
  //       "ocp-apim-subscription-key": subscriptionKey
  //     },
  //     data: JSON.stringify({ q: query, lang: "en" }),
  //     success: function(data) {
  //       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         chrome.tabs.sendMessage(tabs[0].id, {data:data}, function(response) {
  //           if(response.type == "test"){
  //             console.log('test received');
  //           }
  //         });
  //       });
  //     },
  //     error: function() {
  //       return("Internal Server Error");
  //     }
  //   });
  // }
});