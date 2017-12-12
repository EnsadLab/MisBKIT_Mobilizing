/**
*  controle du moteur 0
* par un 'drag' de la souris en largeur 
*
* Le moteur 0 doit être en mode joint
*/

//TODO fonctions MisBKIT.motorAngle(index,angle) ... etc

function script()
{
    var misBKIT_url     = "ws://10.0.0.12:8080"; //MisBKit server URL : replace it if needed
    var oscSocket; //OSC Socket
    var trackpads       = [];
    
    this.preLoad = function(loader)
    {
        M = this.getContext();  
        EasyContext.SetContext(M);       
    };

    // reception des messages OSC : { address, args[] }
    this.oscMsg = function(msg)
    {
        var addr = msg.address;
        var val1  = msg.args[0];
        var val2  = msg.args[1];
        console.log("oscMsg:",addr,msg.args);
    }
    //TODO onReady onClose --> visu

    this.setup = function()
    {
        EasyContext.CreateScene(); 
        //connect to the MisBKit server
        oscSocket = new OSCsocket(this,misBKIT_url);
        //scene creation
        var trackpad_width = 1.8;
        var trackpad_height = 3.8;
        trackpads.push(EasyContext.CreateTrackpad(new Mobilizing.Vector3(-1, 2, -15), new Mobilizing.Vector3(trackpad_width, trackpad_height, 1), 0, 200));
        trackpads.push(EasyContext.CreateTrackpad(new Mobilizing.Vector3(1, 2, -15), new Mobilizing.Vector3(trackpad_width, trackpad_height, 1), 1, 200));
        trackpads.push(EasyContext.CreateTrackpad(new Mobilizing.Vector3(-1, -2, -15), new Mobilizing.Vector3(trackpad_width, trackpad_height, 1), 2, 200));
        trackpads.push(EasyContext.CreateTrackpad(new Mobilizing.Vector3(1, -2, -15), new Mobilizing.Vector3(trackpad_width, trackpad_height, 1), 3, 200));
   };
   
    this.update = function()
    {
        for (var i in trackpads)
        {
            var t = trackpads[i];
            t.update();
            if (t.pressed)
            {
                var data = {};
                data.x = t.movex * t.multiplier;
                data.y = t.movey * t.multiplier;
                t.movex = 0;
                t.movey = 0;
                t.currentx += data.x;
                t.currenty += data.y;

                var val = (t.lastposy-0.5)*t.multiplier;
                //val = t.currenty;
                console.log("trackpad " + t.message + " " + t.currenty);
                //this.genericClient.pubsub.publish(t.message, data);
                //console.log("publish " , t.message, data)
                oscSocket.send("/mbk/motors/speed",[t.message,val]);
            }
            else
            {
                //t.currentx = 0;
                //t.currenty = 0;
                //oscSocket.send("/mbk/motors/speed",[t.message,0]);
            }
        }
    };

};
