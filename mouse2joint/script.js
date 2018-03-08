/**
*  controle du moteur 0
* par un 'drag' de la souris en largeur 
*
* Le moteur 0 doit être en mode joint
*/

//TODO fonctions MisBKIT.motorAngle(index,angle) ... etc


function script()
{
    var M;
    var camera;
    var cube;
    var light;

    var R; //renderer
    var mouse;
    var touch;

    var misBKIT_url; //if undefined then prompt for MisBKit's IP
    //var misBKIT_url = "ws://10.0.0.11:8080";
    var oscSocket;
    
    this.preLoad = function(loader)
    {
        M = this.getContext();        
    };

    // reception des messages OSC : { address, args[] }
    this.oscMsg = function(msg){
        var addr = msg.address;
        //var val  = msg.args[0];
        console.log("oscMsg:",addr,msg.args);
        if(addr.startsWith("/mbk/sensor")){
            // arg[0] = sensor name
            // arg[1] = normalized value [0.0,1.0]
        }
        if(addr.startsWith("/mbk/temperature")){
            // arg[0] = index motor
            // arg[1] = temperature °C
        }
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

        cube = new Mobilizing.Mesh({primitive:"cube", size:1});
        cube.transform.setLocalPosition(0,0,0);
        R.addToCurrentScene(cube);

        mouse = new Mobilizing.input.Mouse({target: R.canvas});
        mouse.setup();
        mouse.on();
        M.addComponent(mouse);

        touch = M.addComponent(new Mobilizing.input.Touch({"target": R.canvas}));
        touch.setup();
        touch.on();



        oscSocket = new OSCsocket(this,misBKIT_url);
   };

    this.update = function()
    {
        if( mouse.isPressed() ){
            var x = mouse.getX();
            var n = x / R.getCanvasSize().width;         //peut être 'resizé'
            var a = n*300;   //AX12: [-150°,150°]
            console.log("cmd",n,a);

            /* 'angle' 'pos' 'joint' equivalents en degrés */
            //oscSocket.send("/mbk/motors/angle/0",[a]); //valide            
            //oscSocket.send("/mbk/motors/angle",[0,a]); //valide
            
            /* 'speed' ou 'wheel' vitesse [-100,100] */
            //oscSocket.send("/mbk/motors/angle",[0,a]);

            /* 'posN' position normalisée entre min et max [-1,1] */
            //oscSocket.send("/mbk/motors/posN",[0,n]);

            /* 'speedN' vitesse normalisée entre min et max [-1,1] */
            oscSocket.send("/mbk/motors/speedN",[0,n]);
            
            /* 'jointmode' */
            //oscSocket.send("/mbk/motors/jointmode",[0]);
            
            /* 'wheelmode' */
            //oscSocket.send("/mbk/motors/wheelmode",[0]);
              
            var angles = cube.transform.getLocalRotation();
            angles.y = a;
            cube.transform.setLocalRotation(angles);            
        }

        /*
        //if(touch.isPressed()){
            var y = touch.getX(0);
            var s = R.getCanvasSize();         //peut être 'resizé'
            var a =(y/s.heigth - 0.5)*300;
            var angles = cube.transform.getLocalRotation();
            angles.y = a;
            cube.transform.setLocalRotation(angles);                        
        //}
        */        

    };

};
