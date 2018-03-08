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
    var brick;
    var light;
    var R;
    var accel;
    var smoothedAccel = {x:0, y:0};
    var cube;

    var misBKIT_url; //if undefined then prompt for MisBKit's IP
    //var misBKIT_url = "ws://10.0.0.12:8080"; //MisBKit server URL : replace it if needed
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

        accel = new Mobilizing.input.Motion();
        accel = M.addComponent(accel);
        accel.setup();//set it up
        accel.on();//active it

        accel.events.on("accelerationIncludingGravity", this.accelEvent.bind(this));

        brick = new Mobilizing.Mesh({primitive:"box", width: 2, height: 2, depth: .5});
        R.addToCurrentScene(brick);

        //connect to the MisBKit server
        oscSocket = new OSCsocket(this,misBKIT_url);

    };

    this.accelEvent = function(acc){

        //console.log(acc);
        
        smoothedAccel.x = Mobilizing.math.lerp(smoothedAccel.x, acc.x, .1);
        smoothedAccel.y = Mobilizing.math.lerp(smoothedAccel.y, acc.y, .1);

        var x = Mobilizing.math.map(smoothedAccel.x, -10,10, 180, -180);
        var y = Mobilizing.math.map(smoothedAccel.y, -10,10, 180, -180);

        brick.transform.setLocalRotationY(x);
        brick.transform.setLocalRotationX(y);

        var dx = smoothedAccel.x * 20;
        var dy = smoothedAccel.y * 20;

        var left = dy - dx;
        var right = dy + dx;

        oscSocket.send("/mbk/motors/speed",[0,left]);
        oscSocket.send("/mbk/motors/speed",[1,right]);
    }

    this.update = function()
    {
       
    };

};
