const Barcode = (function() {
    'use strict';

    const DOM = {};
    const ItemArray = [];
    //Enter your institutions API key here
    const apikey = 'l8xx2878ed1a3ef44f43912cdb8320ecdf0d';
    const corsproxy = 'https://cors-anywhere.herokuapp.com/';

    let _mmsID, _holdID, dataObj;
    
    /* =================== private methods ================= */

    function cacheDom() {
        DOM.$searchInput = $('#callnum');
        DOM.$SearchBtn = $('#SearchBtn');
        DOM.$loading = $('#loading');
        DOM.$processing = $('#processing');
        DOM.$Done = $('#done');
        DOM.$DoneBtn = $('#doneBtn');
        DOM.$Results = $('#results');
        DOM.$InputForm = $('#input-form');
        DOM.$Title = $('#title');
        DOM.$Callnum = $('#callnumber');
        DOM.$Items = $('#items');
        DOM.$SubmitBtn = $('#submitBtn');
        DOM.$ResetBtn = $('#resetBtn');
    }

    function bindEvents() {
        // search button click handler   
        DOM.$SearchBtn.click(function() {
            DOM.$InputForm.css('display', 'none');
            DOM.$loading.css('display', 'inherit');
            const callnum = DOM.$searchInput.val();
            getItems(callnum);
        });

        // call search handler if user presses ENTER when typing in search textbox
        DOM.$searchInput.keypress(function (e) {
            if (e.which == 13) {
                DOM.$InputForm.css('display', 'none');
                DOM.$loading.css('display', 'inherit');
                const callnum = DOM.$searchInput.val();
                getItems(callnum);
                return false;
            }
        });

        // submit button click handler
        DOM.$SubmitBtn.click(function() {
            DOM.$InputForm.css('display', 'none');
            DOM.$processing.css('display', 'inherit');
            const deferreds = [];
            
            for (let i = 0; i < ItemArray.length; i++ ) {
                let newBarcode = $('#newBarcode'+i).val();
                if (newBarcode) {
                    console.log("Updating barcode " + newBarcode);
                    let itemID = ItemArray[i].itemID;
                    let reqObj = (dataObj.item[i]);
                    let url = corsproxy + 'https://api-na.hosted.exlibrisgroup.com/almaws/v1/bibs/' + _mmsID + '/holdings/' + _holdID + '/items/' + itemID +'?apikey=' + apikey +'&format=json';
                    reqObj.item_data.barcode = newBarcode;
                    let ajax = $.ajax({
                        cache: false,
                        url: url,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(reqObj),
                        headers: {
                            "x-requested-with": "xhr" // required for cors-anywhere
                        }
                    })
                    deferreds.push(ajax);
                }
            }
            
            $.when.apply($, deferreds).then(function() {
                console.log('done');
                DOM.$processing.css('display', 'none');
                DOM.$Done.css('display', 'inherit');
            });
        });

        // reset button handler
        DOM.$ResetBtn.click(function() {
            location.reload();
        });

        // OK button handler on done dialog
        DOM.$DoneBtn.click(function() {
            location.reload();
        });
    }


    function getItems(callnumber) {
        const url = corsproxy + 'https://api-na.hosted.exlibrisgroup.com/primo/v1/search?vid=01EGSC_INST:01EGSC&tab=UpstreamReports&scope=UpstreamReports&q=any,exact,' + callnumber + '&inst=01EGSC_INST&apikey=' + apikey + '&format=json';

        $.ajax({
            cache: false,
            url: url,
            type: 'GET',
            dataType: 'json',
            headers: {
                "x-requested-with": "xhr" // required for cors-anywhere
            }
        })
        .done(function (data) {
            DOM.$loading.css('display', 'none');
            console.log('getItems');
            console.log(data);
            if (data.docs.length == 0) {
                alert('Call number ' + callnumber + ' not found!')
            } else {
                _holdID = data.docs[0].delivery.bestlocation.holdId;
                _mmsID = data.docs[0].pnx.display.mms[0];
                getItems2();
            }
        })
        .fail( function(error) {
            console.log('error: ' + JSON.stringify(error));
        });
    }

    function getItems2() {
        const url = corsproxy + 'https://api-na.hosted.exlibrisgroup.com/almaws/v1/bibs/' + _mmsID + '/holdings/' + _holdID + '/items?limit=10&offset=0&order_by=none&direction=desc&apikey=' + apikey + '&format=json';

        $.ajax({
            cache: false,
            url: url,
            type: 'GET',
            dataType: 'json',
            headers: {
                "x-requested-with": "xhr" 
            }
        })
        .done(function (data) {
            console.log('getItems2');
            console.log(data);
            dataObj = data;

            for (let i = 0; i < data.item.length; i++ ) {
                ItemArray.push({
                    'itemID': dataObj.item[i].item_data.pid,
                    'title': dataObj.item[i].bib_data.title,
                    'description': dataObj.item[i].item_data.description,
                    'callnumber': dataObj.item[i].holding_data.call_number,
                    'oldBarcode': dataObj.item[i].item_data.barcode
                });
            };
            console.log(ItemArray);

            // display form
            DOM.$InputForm.css('display', 'inherit');

            DOM.$Title.html(ItemArray[0].title);
            $.each(ItemArray, function(i){
                DOM.$Items.append('<div class="row"><div class="col">' + ItemArray[i].callnumber + '</div><div class="col">' + ItemArray[i].description + '</div><div class="col">' +  ItemArray[i].oldBarcode + '</div><div class="col"><input type="text" id="newBarcode'+i+'" name="barcode'+i+'"></div></row>');
            });
            $('#newBarcode0').focus();
           
        })
        .fail( function(error) {
            console.log('error: ' + JSON.stringify(error));
        });
    }

    /* =================== public methods ================== */

    function init() {
        cacheDom();
        bindEvents();
    }

    /* =============== export public methods =============== */

    return {
        init : init
    }

}());