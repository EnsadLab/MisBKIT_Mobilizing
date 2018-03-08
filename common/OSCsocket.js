class OSCsocket{
    constructor(receiver,url){
        this.url = "ws://127.0.0.1:8080";
        this.oscPort;
        this.listener=receiver;
        this.timerReconnect;
        //if(url){
            this.open(url);
        //}
    }

    open(url){
        if(this.oscPort){
            if(this.oscPort.socket.readyState <= 1){
                this.oscPort.close();
            }
        }
        if(url==undefined){
            var hostIp = location.host;
            var colon = hostIp.indexOf(':');
            if(colon>0) hostIp = hostIp.substr(0,colon);
            var ip = prompt("MisBKIT ip:",hostIp);
            url = "ws://"+ip+":8080";
            console.log("userURL:",url);
        }

        this.url = url;
        clearInterval(this.timerReconnect);        
        this.connect();
        this.timerReconnect = setInterval(this.reconnect.bind(this),5000);
    }

    isReady(){
        if(this.oscPort)
            return (this.oscPort.socket.readyState == 1);
        else
            return false;
    }

    sendValue(addr,val){
        if(this.oscPort){
            //console.log("osc send:",this.oscPort.socket.readyState);
            //REM metadata false
            if(this.oscPort.socket.readyState == 1){
                this.oscPort.send({
                    address:addr,
                    //args:[{type:"i",value:val}]
                    args:[val]
                });
            }
        }
    }

    send(addr,args){
        if(this.oscPort){
            if(this.oscPort.socket.readyState == 1){
                this.oscPort.send({
                    address:addr,
                    args:args
                });
            }
        }
    }

    //readystate:
    //0: not connected
    //1: connected
    //2: closing
    //3: closed
    reconnect(){
        if(this.oscPort){
            var r = this.oscPort.socket.readyState;
            console.log("tryConnect:state=",r);            
            if(this.oscPort.socket.readyState > 1)
                this.connect();
        }
        else{
            this.connect();        
        }        
    }

    connect(){
        console.log("osc connect:",this.url);
        var self = this;

        this.oscPort = new osc.WebSocketPort({
            url: this.url,
            metadata: false
        });

        this.oscPort.on("error", function (event) {
            console.log("osc error",event);
            //GRRRRRR: no error when "Connection refused" !!!
        });

        this.oscPort.on("osc", function (msg) {
            //console.log("osc msg:",msg);
            if(self.listener){
                self.listener.oscMsg(msg);
            }
        });
 
        this.oscPort.on("close", function (event) {
            console.log("osc close",event);
            self.timerReconnect = setInterval(self.reconnect.bind(self),5000);
        });

        this.oscPort.on("ready", function () {
            clearInterval(self.timerReconnect);
            console.log("osc ready");
            //console.log("osc state:",this.oscPort.socket.readyState);
        });
        
        this.oscPort.open();
    }
}