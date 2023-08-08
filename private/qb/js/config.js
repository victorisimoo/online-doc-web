var QBApp = {
/*    appId: 42215,
    authKey: 'Qe5emUZEy6fv43k',
    authSecret: 'KnxOHdUC79JHV5J'*/
    appId: 8    ,
    authKey: 'V2UQBTnpMVOAFkn',
    authSecret: 'yA658mGWHu3N-Ck'
};

var config = {
    endpoints: {
      api: "apidoctoronline.quickblox.com",
      chat: "chatdoctoronline.quickblox.com"
    },  
    chatProtocol: {
        active: 2
    },
    streamManagement: {
        enable: true
    },
    debug: {
        mode: 0,
        file: null
    },
    stickerpipe: {
        elId: 'stickers_btn',
        apiKey: '847b82c49db21ecec88c510e377b452c',
        enableEmojiTab: false,
        enableHistoryTab: true,
        enableStoreTab: true,

        userId: null,

        priceB: '0.99 $',
        priceC: '1.99 $'
    }
};

/*var QBUser1 = {
        id: 20778956,
        name: 'Luis Perez',
        login: 'matemiguel2005@hotmail.com',
        pass: 'DrOnline.2016'
    },
    QBUser2 = {
        id: 14046937,
        name: 'Sergio Mazariegos',
        login: 'smazariegos@micorreo.com',
        pass: 'DrOnline.2016'
    };*/

    var QBUser1 = {
        id: 13804703,
        name: 'Luis Enrique',
        login: 'lenrique@micorreo.com',
        pass: 'DrOnline.2016'
    },
    QBUser2 = {
        id: 14046937,
        name: 'Sergio Mazariegos',
        login: 'smazariegos@micorreo.com',
        pass: 'DrOnline.2016'
    };

QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);
