/**
*  controle du moteur 0
* par un 'drag' de la souris en largeur 
*
* Le moteur 0 doit être en mode joint
*/

//TODO fonctions MisBKIT.motorAngle(index,angle) ... etc

function script()
{
    var misBKIT_url; //if undefined then prompt for MisBKit's IP
    //var misBKIT_url     = "ws://10.0.0.12:8080"; //MisBKit server URL : replace it if needed
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

        accel = new Mobilizing.input.Motion();
        accel = EasyContext._context.addComponent(accel);
        accel.setup();//set it up
        accel.on();//active it

        accel.events.on("accelerationIncludingGravity", this.accelEvent.bind(this));
        //connect to the MisBKit server
        oscSocket = new OSCsocket(this,misBKIT_url);
        
   };
   
   this.accelEvent = function(acc){
    
            //console.log(acc);
            
            
            var x = Mobilizing.math.map(acc.x, -10,10, 1, -1);
            var y = Mobilizing.math.map(acc.y, -10,10, 1, -1);
            
            
            oscSocket.send("/mbk/motors/posN",[0,x]);
            oscSocket.send("/mbk/motors/posN",[1,y]);
            
        };

    this.update = function()
    {
        
    };

};
