var QBApp = {
  appId: 8,
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
  debug: {
    mode: 1,
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

var QBUser1 = {
        id: 6729114,
        name: 'quickuser',
        login: 'chatusr11',
        pass: 'chatusr11'
    },
    QBUser2 = {
        id: 6729119,
        name: 'bloxuser',
        login: 'chatusr22',
        pass: 'chatusr22'
    };

QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);
