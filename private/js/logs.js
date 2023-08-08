var qbDebugMode = (debugMode) ? 1 : 0;

function infoLog(text){
    if(debugMode){
        console.log(text);
    }
};

function warningLog(text){
    if(debugMode){
        console.warn(text);
    }
};

function errorLog(text){
    if(debugMode){
        console.error(text);
    }
};