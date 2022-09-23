var logs = '';
var appIdGlobal = null;

function createTable(tableData) {
    var tableBody = document.createElement('tbody');
    var options = {year: 'numeric', month: 'short', day: 'numeric'};

    if (tableData != undefined) {
        tableData.reverse().forEach(function (rowData) {
            var tempDate = new Date(rowData.date);
            var row = document.createElement('tr');
            var cell1 = document.createElement('td');
            var cell2 = document.createElement('td');
            var cell3 = document.createElement('td');
            var cell4 = document.createElement('td');
            cell1.appendChild(document.createTextNode(tempDate.toLocaleDateString("en-US", options)));
            cell2.appendChild(document.createTextNode(rowData.time));
            cell3.appendChild(document.createTextNode(rowData.site));
            cell4.appendChild(document.createTextNode(rowData.value));
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);

            tableBody.appendChild(row);
        });
    }

    $('table').append(tableBody);

}
function showData() {

    chrome.storage.local.get(['key'], function (result) {
        logs = result.key;
        createTable(logs);
        var table = $('table').DataTable({
            "order": []
        });
        document.getElementById('spinner-box').style.display = "none";
        document.getElementById('spinner').style.display = "none";
        document.getElementById('non-spinner').style.display = "block";
        $('nav').append($('#DataTables_Table_0_filter'));

        // $('#min').change( function() { table.draw(); } );
        // $('#max').change( function() { table.draw(); } );
        // Add event listeners to the two range filtering inputs

    });
}
function loginFunctionality(){
    //check if logged in than show data else send to login screen
    chrome.storage.local.get(['loggedIn'], function (result) {
        loggedIn = result.loggedIn;
            if(loggedIn != true){

                //check for login
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open( "GET", 'https://www.tackker.com/is-logged-in?app-id='+appIdGlobal, false ); // false for synchronous request
                // xmlHttp.open( "GET", 'http://dev.tackker.com/is-logged-in?app-id='+appIdGlobal, false ); // false for synchronous request
                // xmlHttp.open( "GET", 'https://stagging.tackker.com/is-logged-in?app-id='+appIdGlobal, false ); // false for synchronous request
                xmlHttp.onload = function (){
                    // if not logged in send to login screen else
                    if(xmlHttp.responseText == "true"){
                        chrome.storage.local.set({loggedIn: true}, function () {
                        });
                        // showData();
                        window.open("https://www.tackker.com/dashboard","_self");
                    }else{
                        window.open("https://www.tackker.com/set-user?app-id="+appIdGlobal,"_self");
                        // window.open("http://dev.tackker.com/set-user?app-id="+appIdGlobal,"_self");
                       	// window.open("https://stagging.tackker.com/set-user?app-id="+appIdGlobal,"_self");
                    }
                }
                xmlHttp.send( null );


            }
            else{
                // showData();
                window.open("https://www.tackker.com/dashboard","_self");
            }
    });
}
function showLoader(){
    document.getElementById('spinner').style.display = "block";
    document.getElementById('non-spinner').style.display = "none";
}

showLoader();

    /*if app id is set than login
     else set app id than login
     and if already app id is set and login
     than show data.*/
    chrome.storage.local.get(['appId'], function (result) {
        appId = result.appId;
        appIdGlobal = appId;
        if(appId == ''  || appId == undefined || appId == null || appId.includes('DOCTYPE')){
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", 'https://www.tackker.com/set-app-id', false ); // false for synchronous request
            // xmlHttp.open( "GET", 'http://dev.tackker.com/set-app-id', false ); // false for synchronous request
            // xmlHttp.open( "GET", 'https://stagging.tackker.com/set-app-id', false ); // false for synchronous request

            xmlHttp.onload = function (){
                //save app id locally
                appIdGlobal = xmlHttp.responseText;
                chrome.storage.local.set({appId: xmlHttp.responseText}, function () {
                });

                loginFunctionality();
            }
            xmlHttp.send( null );


        }else{
            loginFunctionality();
        }

    });


