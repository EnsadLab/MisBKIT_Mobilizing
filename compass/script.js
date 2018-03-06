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

    var touch;
    var mouse;
    var pointer;

    var canvasSize;

    var misBKIT_url = "ws://10.0.0.12:8080"; //MisBKit server URL : replace it if needed
    var oscSocket; //OSC Socket
    var orientation;
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

        /*if(addr.startsWith("/mbk/sensor")){
            // arg[0] = sensor name
            // arg[1] = normalized value [0.0,1.0]
        }
        if(addr.startsWith("/mbk/temperature")){
            // arg[0] = index motor
            // arg[1] = temperature °C
        }
        if (addr.startsWith("/mbk/sensor"))
        {
            //create a color from red to blue
            var r = val2;
            var b = 1-val2;
            var g = 0;
            R.setClearColor(new Mobilizing.Color(r,g,b));
        }*/
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

        touch = new Mobilizing.input.Touch({"target": R.canvas});
        M.addComponent(touch);
        touch.setup();//set it up
        touch.on();//active it

        mouse = new Mobilizing.input.Mouse({"target": R.canvas});
        M.addComponent(mouse);
        mouse.setup();//set it up
        mouse.on();//active it

        pointer = new Mobilizing.Pointer();
        M.addComponent(pointer);
        pointer.add(touch);
        pointer.add(mouse);
        pointer.setup();
        pointer.on();

        orientation = new Mobilizing.input.Orientation();
        M.addComponent(orientation);
        orientation.setup();
        orientation.on();

        canvasSize = R.getCanvasSize();

        //create your scene here :
        cube = new Mobilizing.Mesh({primitive:"cube", size:1});
        cube.transform.setLocalPosition(0,0,0);
        R.addToCurrentScene(cube);

        //connect to the MisBKit server
        oscSocket = new OSCsocket(this,misBKIT_url);

    };

    this.update = function()
    {

        var compass = orientation.compass.heading;

        if(pointer.getState())
        {

            //console.log("Mobilizing.math.RadToDeg="+Mobilizing.math.radTodeg);
            /*var compass_deg = compass*180/Math.PI;
            var compass_deg = compass;
            if (compass_deg >180)
            compass_deg -= 360;
            var pos = (compass_deg);*/

            var mappedCompass = Mobilizing.math.map(compass, 0,360, -1,1);
            console.log("compass = " + mappedCompass);

            oscSocket.send("/mbk/motors/posN",[0,mappedCompass]);
        }       
    };

};
