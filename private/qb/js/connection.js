'use strict';

var currentUser,doctorUser,
    token;

$(document).ready(function () {
    

    /*$('#user1').on('click', function() {
        currentUser = QBUser1;
        connectToChat(QBUser1);
    });

    $('#user2').on('click', function() {
        currentUser = QBUser2;
        connectToChat(QBUser2);
    });*/

    currentUser = QBUser1;
    doctorUser = QBUser2;
    connectToChat(QBUser1,QBUser2);


    var niceScrollSettings = {
        cursorcolor:'#02B923',
        cursorwidth:'7',
        zindex:'99999'
    };

    $('html').niceScroll(niceScrollSettings);
    $('.nice-scroll').niceScroll(niceScrollSettings);

});

function connectToChat(user,userQB2) {
   

    QB.createSession({login: user.login, password: user.pass}, function(err, res) {
        if (res) {
            token = res.token;
            user.id = res.user_id;

            mergeUsers([{user: user}]);

            QB.chat.connect({userId: user.id, password: user.pass}, function(err, roster) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("antes de crear el dialogo");
                    createNewDialog(QBUser1,QBUser2);

                    // setup scroll stickerpipe module
                    setupStickerPipe();

                    retrieveChatDialogs();

                    // setup message listeners
                    setupAllListeners();

                    // setup scroll events handler
                    setupMsgScrollHandler();

                    setupStreamManagementListeners();
                            
                }
            });
        }
    });
}

function setupAllListeners() {
  QB.chat.onMessageListener         = onMessage;
  QB.chat.onSystemMessageListener   = onSystemMessageListener;
  QB.chat.onDeliveredStatusListener = onDeliveredStatusListener;
  QB.chat.onReadStatusListener      = onReadStatusListener;

  setupIsTypingHandler();
}
// reconnection listeners
function onDisconnectedListener(){
  console.log("onDisconnectedListener");
}

function onReconnectListener(){
  console.log("onReconnectListener");
}


// niceScroll() - ON
$(document).ready(
    function() {
        
    }
);
