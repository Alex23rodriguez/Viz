/*
Visualization proyect

Proyect by Alex Rod.
2018/06/10
*/



var radius = 360

var radii = [] // x, x_off, y, y_off
var rad = [0,0,0,0]
var layers = 6
var nodes = 8
var nodeMult = 1
var shifts = 6
hues = []
sat = []
bright = []
wiggle = []
colors = []
nums = []

var btn, ups, downs;

roaming = []

//cons = 0
//rotation = [.01,0.02,.03,.04,-.05]
//rotation=[.0005,-.001,.002,-.01,.02]
rots = []

star = true
layerColors = true
inward = false
//layerModes= [l,floor((int(l)+int(l2))/2), round((int(l)+int(l2))/2), ceil((int(l)+int(l2))/2), l2]

//radiusMode = 1


var points = []
var rot = []

function budge(points){
    newP = points
    //print(newP.length)
    for(l in points){
        num = points[l].length
        for(p in points[l]){
            pt = newP[l][p]
            
            //num = nums[l]
            
            //r = [radius/layers*(layers-l), radius][radiusMode.value()]
            
            r = radius*pow((layers-l)/layers, radiusSpread.value())
            
            shift = TWO_PI/shifts/num*(l%shifts)
            pt.x_ori = cos(TWO_PI/num*p + rot[l]+shift)*cos(rad[0]*pow((l+1),0.8)+rad[1])*r
            pt.y_ori = sin(TWO_PI/num*p + rot[l]+shift)*cos(rad[2]*pow((l+1),0.8)+rad[3])*r
            
            pt.x = pt.x_ori
            pt.y = pt.y_ori
            
            var w = l*wiggle[0].value()+wiggle[1].value()
            
            pt.x += random(-w, w)
            pt.y += random(-w, w)
            
            //newP[p]
            //print(pt.x_ori)
            //break
        }
        
    }
    //print(newP)
    return newP
}

function roam(){
    for (r of roaming){
        //print(r[0].value())
        r[0].value( r[0].value() + random(-r[1], r[1]) );
        r[0].value( max(r[0].value(), r[2]) )
        r[0].value( min(r[0].value(), r[3]) )
        //print(r[0].value())
    }
}

function addRoam(a, b, c, d){
    if(c==undefined){
        c = int(a.elt.min);
        d = int(a.elt.max);
    }
    roaming.push([a, b, c, d]);
}

function drawPoints(){
    strokeWeight(strokeW.value())
    for(l1 in points){
        for(l_2 = l; l_2<layers;l_2++){
            if(inward){
                l=layers-1-l1
                l2=layers-1-l_2
            }
            else{
                l=l1
                l2=l_2
            }
            col = [l,floor((int(l)+int(l2))/2), ceil((int(l)+int(l2))/2), l2][layerMode.value()]
            //print(l+' '+l2+' '+col+' '+ (l+l2))
            for(p in points[l]){
                for(p2 in points[l2]){
                    if(layerColors){
                        stroke([hues[col].value(),sat[col].value(),bright[col].value()])  // /(layers-points[p2].layer)  ])
                    }
                    else{
                        stroke(colors[l2][p])
                    }
                    if(!star || l!=l2)
                    line(points[l][p].x, points[l][p].y, points[l2][p2].x, points[l2][p2].y)

                }  
                fill(75*l)
                //ellipse(points[l][p].x, points[p][l].y, 1, 1)
            }
        }
        
    }
}

function addPoint(i,j){
    points.push({
            layer: i,
            n : j,
            })
}


function fgen(i, add) {
    return function(){add ? points[i].push({}) : points[i].pop()}
}

function setup() {
    print(radius)
    colorMode(HSB, 360,100,100);
    //createCanvas(2400,1028)
    createCanvas(1400,740)
    background(0)
    
    for(i = 0; i < layers; i++){
        
        downs = createButton('-')
        downs.position(40,30*i+50)
        downs.mousePressed(fgen(i,false))
        
        ups = createButton('+')
        ups.position(60,30*i+50)
        ups.mousePressed(fgen(i, true))
        
        rots.push(createSlider(-.05, .05, 0, .0005));
        rots[i].position(130,30*i+50)
        rot.push(0)
        
        hues.push(createSlider(0,360, random(360),1))
        hues[i].position(20, 30*i+250)
        
        sat.push(createSlider(0,100,100,1))
        sat[i].position(160, 30*i+250)
        
        bright.push(createSlider(0,100,50+(50/layers*i),.1))
        bright[i].position(300, 30*i+250)
    }
    ups = []
  
    wiggle.push(createSlider(0,4,0,.1))
    wiggle.push(createSlider(0,4,0,0.01))
    wiggle[0].position(300, 490)
    wiggle[1].position(300, 520)
      
    radii.push(createSlider(-.005,.005,0,.00005)) // oscilation in radius x
    radii.push(createSlider(-.05,.05,0,.0005)) // offset per layer x
    radii.push(createSlider(-.005,.005,0,.00005)) // oscilation in radius y
    radii.push(createSlider(-.05,.05,0,.0005)) // offset per layer y
    radii[0].position(20, 490)
    radii[1].position(20, 520)
    radii[2].position(160, 490)
    radii[3].position(160, 520)
    
    radiusSpread = createSlider(0,3,1,0.02)//layerModes.lenght-1,0,1)
    radiusSpread.position(300, 100)
    
    layerMode = createSlider(0,3,0,1)//layerModes.lenght-1,0,1)
    layerMode.position(300, 150)
    
    strokeW = createSlider(0.05,2,0.7, 0.05)//layerModes.lenght-1,0,1)
    strokeW.position(300, 50)
    
    fade = createSlider(0,0.5, 0.5, 0.0005);//layerModes.lenght-1,0,1)
    fade.position(300, 200);
      
    //reset oscilation
    btn = createButton('Freeze');
    btn.position(40,550);
    btn.mousePressed(
        function(){
            radii[0].value(0);
            radii[1].value(0);
        }
    );
    
    btn = createButton('Reset');
    btn.position(90,550);
    btn.mousePressed(
        function(){
            rad[0] = 0;
            rad[1] = 0;
        }
    );
    
    btn = createButton('Freeze');
    btn.position(175,550);
    btn.mousePressed(
        function(){
            radii[2].value(0);
            radii[3].value(0);
        }
    );
    
    btn = createButton('Reset');
    btn.position(225,550);
    btn.mousePressed(
        function(){
            rad[2] = 0;
            rad[3] = 0;
        }
    );
    
    // randomize color
    btn = createButton('Randomize');
    btn.position(50, 423);
    btn.mousePressed(
        function(){
            for(s of hues){
                s.value(random(360));
            }
        }
    );
    btn = createButton('Randomize');
    btn.position(190, 423);
    btn.mousePressed(
        function(){
            for(s of sat){
                s.value(random(100));
            }
        }
    );
    btn = createButton('Randomize');
    btn.position(330, 423);
    btn.mousePressed(
        function(){
            for(s of bright){
                s.value(random(100));
            }
        }
    );
      
    
      //print(rotation)
    for(i = 0; i < layers; i++){
        //num = nums[i]
        num = int(nodes*pow(nodeMult,(layers-i-1))) //number of nodes in this layer
        //nums.push(num)
        //print(num)
        //if(layerColors){
        //    colors.push([random(255),random(255),random(255)]);
        //}
        
        shift = TWO_PI/shifts/num*(i%shifts)
        
        if(!layerColors){
                colors.push([]);
            }
        points.push([]);
        for(j = 0; j < num; j++){
            points[i].push({})
            if(!layerColors){
                colors[i].push([random(255),random(255),random(255)]);
            }
        }
    }
}

function draw() {
    //push()
    
    //pop()
    //print("hi")
    
    push()
    
    translate(width*2/3, height/2)
    fill(255)
    background(0, fade.value())
    //print(points)
    //print(budge(points))
    points = budge(points)
    drawPoints()
    
    roam()
    //rad+=.01
    //print(cos(r))
    for(i = 0; i < layers; i++){
        rot[i]+=rots[i].value()
    }
    rad[0]+=radii[0].value()
    rad[1]+=radii[1].value()
    rad[2]+=radii[2].value()
    rad[3]+=radii[3].value()
    
    pop()
    
    fill(20)
    rect(10,20,440,560)
    fill(255)
    
    textSize(12)
    text('Nodes per layer', 15, 40)
    text('Rotation', 175, 40)
    text('Width', 350, 40)
    text('Spread', 350, 90)    
    text('Color Mode', 335, 140) 
    text('Fade', 350, 190) 
    text('Color per layer (Hue / Saturation / Brightness)', 100, 242) 
    text('X Oscilation', 55, 480)
    text('Y Oscilation', 195, 480)
    text('Jiggle', 350, 40)
    stroke(255)
    line(10,223,450,223)
    line(10,450,450,450)
    
    for(i = 0; i < layers; i++){
        text(points[i].length,20,30*i+60)
    }

}



