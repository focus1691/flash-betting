import React, {useEffect} from 'react';
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:8000");

export default () => {
    
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
        if(pair[0] === variable){return pair[1];}
         }
         return(false);
    }

    useEffect(() => {
        var code = getQueryVariable("code");
        if (code) {
            var sessionKey = localStorage.getItem("sessionKey");
            console.log('sess key on validation page:', sessionKey);
            socket.emit('request_access_token', {code: code, sessionKey: sessionKey});
        }
    })
    return (<section>Redirecting...</section>);
};