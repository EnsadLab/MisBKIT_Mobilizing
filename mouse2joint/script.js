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

    var misBKIT_url = "ws://127.0.0.1:8080";
    var oscSocket;
    
    this.preLoad = function(loader)
    {
        M = this.getContext();        
    };

    // reception des messages OSC : { address, args[] }
    this.oscMsg = function(msg){
        var addr = msg.address;
        var val  = msg.args[0];
        console.log("oscMsg:",addr,val);
    }

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

        oscSocket = new OSCsocket(this,"ws://127.0.0.1:8080");
   };

    this.update = function()
    {
        if( mouse.isPressed() ){
            var x = mouse.getX();
            var s = R.getCanvasSize();         //peut être 'resizé'
            var a = ( x/s.width - 0.5 )*300;   //AX12: [-150°,150°]
            console.log("angle",a);

            oscSocket.sendValue("/mbk/motors/goal/0",a);

            //var v = ( x/s.width - 0.5 )*200; //speed [-100,100]
            //oscSocket.sendValue("/mbk/motors/goal/0",a);
            
            var angles = cube.transform.getLocalRotation();
            angles.y = a;
            cube.transform.setLocalRotation(angles);            
        }

    };

};
