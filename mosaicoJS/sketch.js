var start = 5;
var arit_growth = 5;
var geo_growth = 1;
var layers = 20;
var v_wiggle = [.3, .6]    // [min, max] how pointy or boxy any given layer can be
var color_loops = 1;                 // number of times each color will appear in a single cycle
var color_shift = 0                // [0, 1] how far along the hue spectrum a given color can vary

var hue_start = 0                // [0, 1] where in the hue spectrum the colors will start
var sat = [.2, 1]                  // [min, max]
var bright = [0.6, .9]                // [min, max]  
var vertical_hue_shift = 1       // number of loops in a given direction
var vertical_sat_shift = [.6, 1]     // [init_val, end_val]
var vertical_bright_shift = [1, .2]  // [init_val, end_val]

var grayscale = 0;
var color_spectrum = [0, 1];

var canvas_size = 750;
////////////////////////////////////

var delta_r;
var init_r// = 30;

var shifts;
var base_radii;
var top_radii;


function x(r, shift){ // polar to cartesian x
    return r*cos(shift);
}

function y(r, shift){ // polar to cartesian y
    return r*sin(shift);
}

function angle(i, t, sh){
    return (2*PI * i/t + sh)%(2*PI);
}

function nod(l){
    return start + l*arit_growth;
}

function starting_nodes(nodes, shift, other_nodes, other_shift){
    var l = [];
    for(i=0; i<nodes; i++){
        l.push(ceil((angle(i, nodes, shift) - other_shift)/angle(1, other_nodes, 0))%other_nodes)
    }
    return l;
}

function diff(l, n){
    var d = []
    for(i=0; i<l.length-1; i++){
        d.push((l[i+1]-l[i]+n)%n);
    }
    d.push((l[0]-l[l.length-1]+n)%n);
    
    return d
}

function get_shapes(l){
    if(l==0){
        b = []
        for(i=0; i<nod(l); i++){
            b.push(0);
        }
        db = b;
    }else{
        b = starting_nodes(nod(l), shifts[l], nod(l-1), shifts[l-1]);
        db = diff(b, nod(l-1));
    }
    
    t = starting_nodes(nod(l), shifts[l], nod(l+1), shifts[l+1]);
    dt = diff(t, nod(l+1));

    r = []
    for(i=0; i<nod(l); i++){
        r.push([]);
        r[i].push(db[i]);
        r[i].push(b[i]);
        r[i].push(dt[i]);
        r[i].push(t[i]);
    }
    return r;
}

function re(){
    setup();
    redraw();
}

function filler(i, l){
    if(random()<grayscale){
        fill(((angle(i, nod(l), shifts[l])/2/PI + random(color_shift) + base_radii[l]/layers*vertical_hue_shift + abs(vertical_hue_shift))*color_loops + hue_start)%(color_spectrum[1]-color_spectrum[0])+color_spectrum[0]);
    }else{
        fill(
                (((angle(i, nod(l), shifts[l])/2/PI + random(color_shift) + base_radii[l]/layers*vertical_hue_shift + abs(vertical_hue_shift))*color_loops + hue_start)%(color_spectrum[1]-color_spectrum[0])+color_spectrum[0]), 
                random(sat[0], sat[1])*((1-l/layers)*vertical_sat_shift[0] + (l/layers)*vertical_sat_shift[1]), 
                random(bright[0], bright[1])*((1-l/layers)*vertical_bright_shift[0] + (l/layers)*vertical_bright_shift[1])
            );
    }
}
    
function draw_shapes(shapes, l){
    for(i=0; i<nod(l); i++){
        filler(i, l);
        beginShape();
        vertex(x(top_radii[l], angle(i, nod(l), shifts[l])), y(top_radii[l], angle(i, nod(l), shifts[l])));
        vertex(x(base_radii[l], angle(i, nod(l), shifts[l])), y(base_radii[l], angle(i, nod(l), shifts[l])));
        for(j=0; j<shapes[i][0]; j++){
            vertex(x(top_radii[l-1], angle(shapes[i][1]+j, nod(l-1), shifts[l-1])), y(top_radii[l-1], angle(shapes[i][1]+j, nod(l-1), shifts[l-1])));
        }
        vertex(x(base_radii[l], angle(i+1, nod(l), shifts[l])), y(base_radii[l], angle(i+1, nod(l), shifts[l])));
        vertex(x(top_radii[l], angle(i+1, nod(l), shifts[l])), y(top_radii[l], angle(i+1, nod(l), shifts[l])));
        for(j=shapes[i][2]-1; j>=0; j--){
            vertex(x(base_radii[l+1], angle(shapes[i][3]+j, nod(l+1), shifts[l+1])), y(base_radii[l+1], angle(shapes[i][3]+j, nod(l+1), shifts[l+1])));
        }
        endShape(CLOSE);
    }
}

function setup() {
    createCanvas(canvas_size, canvas_size);
    colorMode(HSB, 1, 1, 1);
    
    shifts = [];
    base_radii = [];
    top_radii = [];
    if(!init_r){
        init_r=width/4/(layers);
    }
    if(!delta_r){
        delta_r = (width/2-init_r)/(layers-1);
    }
    
    for(i=0; i<layers;i++){
        // make sure every shape will be convex
        var nodes = nod(i);
        shifts.push(random(2*PI/nodes));
        
        var r = delta_r*i + init_r;
        var len_side = sqrt(sq(1-cos(2*PI/nod(i+1))) + sq(sin(2*PI/nod(i+1))));
        var R = sqrt(1 - sq(len_side/2))*(delta_r*(i+1)+init_r) - r;
        R = random(r + R*v_wiggle[0], r+R*v_wiggle[1]);
        
        base_radii.push(r);        
        top_radii.push(R);
    }
    
    /*
    for(i=0; i<layers; i++){
        circles.push([]);
        circles[i].push([]);
        circles[i].push([]);
        var nodes = start + add*i;
        
        var r = h*i + init_r;
        
        var len_side = sqrt(sq(1-cos(2*PI/(nodes+add))) + sq(sin(2*PI/(nodes+add))));

        var sh = random(2*PI);
        //sh = 0;
        var R = sqrt(1 - sq(len_side/2))*(h*(i+1)+init_r) - r;
        
        R = random(r + R*v_wiggle, r+R)
        
        for(j=0; j<nodes; j++){
            circles[i][0].push(xy(r, j, nodes, sh));
            circles[i][1].push(xy(R, j, nodes, sh));
        }
    }
    */
    
    //print(top_radii)
    
    noLoop();
}

function draw() {
    background(0);
    push();
    translate(width/2, height/2);
    strokeWeight(1);
    stroke(0);
    
    // draw first layer and center
    
    filler(0, 0);
    beginShape();
    for(i=0; i<nod(0); i++){
        vertex(x(base_radii[0], angle(i, nod(0), shifts[0])), y(base_radii[0], angle(i, nod(0), shifts[0])));
    }
    endShape(CLOSE);
    
    s = get_shapes(0);
    for(i=0; i<nod(0); i++){
        filler(i, 0);
        beginShape();
        vertex(x(top_radii[0], angle(i, nod(0), shifts[0])), y(top_radii[0], angle(i, nod(0), shifts[0])));
        vertex(x(base_radii[0], angle(i, nod(0), shifts[0])), y(base_radii[0], angle(i, nod(0), shifts[0])));
        vertex(x(base_radii[0], angle(i+1, nod(0), shifts[0])), y(base_radii[0], angle(i+1, nod(0), shifts[0])));
        vertex(x(top_radii[0], angle(i+1, nod(0), shifts[0])), y(top_radii[0], angle(i+1, nod(0), shifts[0])));
        for(j=s[i][2]-1; j>=0; j--){
            vertex(x(base_radii[1], angle(s[i][3]+j, nod(1), shifts[1])), y(base_radii[1], angle(s[i][3]+j, nod(1), shifts[1])));
        }
        endShape(CLOSE);
    }
    
    for(k=1; k<layers-1; k++){
        s = get_shapes(k);
        draw_shapes(s, k);
    }
    pop();
}