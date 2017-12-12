/**
*  controle du moteur 0
* par un 'drag' de la souris en largeur 
*
* Le moteur 0 doit être en mode joint
*/

//TODO fonctions MisBKIT.motorAngle(index,angle) ... etc

function script()
{
    var M; //Mobilizing context
    var camera; //3d camera
    var cube; //a simple cube
    var light; //scene light
    var R; //renderer
    var mouse; //mouse component
    var touch; //touch component
    var misBKIT_url = "ws://10.0.0.11:8080"; //MisBKit server URL : replace it if needed
    var oscSocket; //OSC Socket
    
    this.preLoad = function(loader)
    {
        M = this.getContext();        
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
        R  =  M.addComponent(new Mobilizing.Renderer3D());
        camera = new Mobilizing.Camera();
        camera.transform.setLocalPosition(0,0,10);
        R.addCamera(camera);

        light = new Mobilizing.Light();
        light.transform.setLocalPosition(0,10,10);
        R.addToCurrentScene(light);
        light.setDistance(200);

        mouse = new Mobilizing.input.Mouse({target: R.canvas});
        mouse.setup();
        mouse.on();
        M.addComponent(mouse);

        touch = M.addComponent(new Mobilizing.input.Touch({"target": R.canvas}));
        touch.setup();
        touch.on();

        pointer = new Mobilizing.Pointer();
        M.addComponent(pointer);
        pointer.add(touch);
        pointer.add(mouse);
        pointer.setup();
        pointer.on();

        //connect to the MisBKit server
        oscSocket = new OSCsocket(this,misBKIT_url);

        

   };
   this.centerx = 0;
   this.centery = 0;
   this.pressed = false;
    this.update = function()
    {
        if(pointer.getState())
        {
            var x = pointer.getX();
            var y = pointer.getY();
            var nx = x / R.getCanvasSize().width;         
            var ny = y / R.getCanvasSize().height;
            if (this.pressed)
            {
                
                
                var dx = nx-this.centerx;
                var dy = (ny-this.centery)*-1;
                //commande différentielle des 2 moteurs du roomba
                var left = dy-dx;
                var right = dy+dx;
    
                oscSocket.send("/mbk/motors/speed",[0,left*600]);
                oscSocket.send("/mbk/motors/speed",[1,right*600]);
                console.log(""+left+ " " + right);
            }
            else
            {
                this.pressed = true;
                this.centerx = nx;
                this.centery = ny;
            }
            
            R.setClearColor(Mobilizing.Color.red);       
        }      
        else
        {
            this.pressed = false;
            R.setClearColor(Mobilizing.Color.black);  
            console.log("untouch");
            oscSocket.send("/mbk/motors/speed",[0,0]);
            oscSocket.send("/mbk/motors/speed",[1,0]);
        }
    };

};
