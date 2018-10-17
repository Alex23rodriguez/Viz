tr = [0 , 0, 400];
tr_sp = [0, 0, 0];

rot = [0, 0, 0];
rot_sp = [0, 0, 0];

scal = [100, 100, 100];
scal_sp = [0, 0, 0];


var speed = 1;
var variation = 0.6

function pr(m, t){
    var s = '';
    if(typeof(m[0])=='number'){
        for(var i of m){
            s+=i;
            s+='\n';
        }
        print(s);
        return;
    }
    if(!t){
        t = 5;
    }
    for(var i=0; i<m.length; i++){
        for(var j=0; j<m[0].length; j++){
            var c = str(m[i][j]);
            s += c;
            for(var k=0; k<t-c.length; k++){
                s += ' ';
            }
        }
        s += '\n';
    }
    print(s);
}

function keyPressed(){
    var t = speed// + random(-variation, variation)
    if(key=='A'){
        tr_sp[0] -= t;
    }else if(key == 'S'){
        tr_sp[0] += t;
    }else if(key == 'R'){
        tr_sp[1] += t;
    }else if(key == 'W'){
        tr_sp[1] -= t;
    }else if(key == 'F'){
        tr_sp[2] += t;
    }else if(key == 'Q'){
        tr_sp[2] -= t;
    }
    t = 0.01;
    if(key=='E'){
        rot_sp[0] += t;
    }else if(key == 'U'){
        rot_sp[0] -= t;
    }else if(key == 'N'){
        rot_sp[1] += t;
    }else if(key == 'I'){
        rot_sp[1] -= t;
    }else if(key == 'Y'){
        rot_sp[2] += t;
    }else if(key == 'L'){
        rot_sp[2] -= t;
    }
    t = .5;
    if(key=="½"){
        scal_sp[0] -= t;
        scal_sp[1] -= t;
        scal_sp[2] -= t;
    }else if(key == "»"){
        scal_sp[0] += t;
        scal_sp[1] += t;
        scal_sp[2] += t;
    }
    
}

function rand_mat(n, m, cap){
    if(!cap){
        cap = 10;
    }
    var r = [];
    for(var i=0; i<n; i++){
        r.push([]);
        for(var j=0; j<m; j++){
            r[i].push(int(random(1)*cap));
        }
    }
    return r;
}

function dot(v1, v2){
    var r = 0;
    for(var i=0; i<v1.length; i++){
        r += v1[i]*v2[i];
    }
    return r;
}

function T(m){
    var r = [];
    for(var j=0; j<m[0].length; j++){
        r.push([]);
        for(var i=0; i<m.length; i++){
            r[j].push(m[i][j]);
        }
    }
    return r;
}

function mv_mult(m, v){
    var r = [];
    for(var i=0; i<m.length; i++){
        r.push(dot(m[i], v));
    }
    return r;
}

function mm_mult(m1, m2){
    var r = [];
    m2 = T(m2);
    for(var i=0; i<m1.length; i++){
        r.push([]);
        for(var j=0; j<m2.length; j++){
            r[i].push(dot(m1[i], m2[j]));
        }
    }
    return r;
}

function iden(n){
    var r = [];
    for(var i=0; i<n; i++){
        r.push([]);
        for(var j=0; j<n; j++){
            r[i].push(i==j ? 1 : 0);
        }
    }
    return r;
}

function scl(m, sx, sy, sz){
    if(sy==undefined){
        sy = sx;
        sz = sx;
    }
    return mm_mult([[sx, 0, 0, 0],
                    [ 0,sy, 0, 0],
                    [ 0, 0,sz, 0],
                    [ 0, 0, 0, 1]], m);
}

function trns(m, dx, dy, dz){
    return mm_mult([[ 1, 0, 0, dx],
                    [ 0, 1, 0, dy],
                    [ 0, 0, 1, dz],
                    [ 0, 0, 0, 1]], m);
}

function xrot(m, t){
    return mm_mult([[      1,      0,      0, 0],
                    [      0, cos(t),-sin(t), 0],
                    [      0, sin(t), cos(t), 0],
                    [      0,      0,      0, 1]], m)
}

function yrot(m, t){
    return mm_mult([[ cos(t),      0, sin(t), 0],
                    [      0,      1,      0, 0],
                    [-sin(t),      0, cos(t), 0],
                    [      0,      0,      0, 1]], m)
}

function zrot(m, t){
    return mm_mult([[ cos(t),-sin(t),      0, 0],
                    [ sin(t), cos(t),      0, 0],
                    [      0,      0,      1, 0],
                    [      0,      0,      0, 1]], m)
}

/*
function scl(m, s){
    var r = []
    if(typeof(m[0])=='number'){
        for(var i=0; i<m.length; i++){
            r[i] = m[i]*s;
        }
        return r;
    }
    for(var i=0; i<m.length; i++){
        r.push([])
        for(var j=0; j<m[0].length; j++){
            r[i][j] = m[i][j]*s
        }
    }
    return r;
}
*/

function proyect(m, z_plane) {
    if(!z_plane){z_plane = width*.70}
    var r = [];
    for(v of m){
        r.push(mv_mult(scl(iden(4), 1/v[2]*z_plane), v));
    }
    return r;
    //return scl(v, 1/v[2]*z_plane);
}

function d(v1, v2){
    var r = 0;
    for(var i=0; i<v1.length; i++){
        r += sq(v1[i]-v2[i]);
    }
    return sqrt(r);
    
}

function setup() {
    createCanvas(750, 750);
    strokeWeight(3);
    
    cube = [
        [-1,-1,-1, 1], [ 1,-1,-1, 1], [ 1, 1,-1, 1], [-1, 1,-1, 1],
        [-1,-1, 1, 1], [ 1,-1, 1, 1], [ 1, 1, 1, 1], [-1, 1, 1, 1],
    ];
    
    conn = [];
    for(var i=0; i<3; i++){
        conn.push([i, i+1]);
        conn.push([i+4, i+5]);
        conn.push([i, i+4]);
    }
    conn.push([0, 3]);
    conn.push([4, 7]);
    conn.push([3, 7]);
    
    //rot[0] = HALF_PI;

}

function draw() {
    background(255)
    push()
    translate(375, 375)
    
    cp = T(cube);
    tfmat = trns(zrot(yrot(xrot(scl(cp, scal[0], scal[1], scal[2]), rot[0]), rot[1]), rot[2]), tr[0], tr[1], tr[2]);
    
    /*
    for(i of cube){
        var j = scl(i, 100);
        j[2] += 400 + tr[2]
        j[1] += tr[1];
        j[0] += tr[0];
        //strokeWeight(1/j[2]*1000)
        j = proyect(j, 500);
        cp.push(j);
    }
    */
    cp = T(tfmat)
    
    cp = proyect(cp)
    for(c of conn){
        line(cp[c[0]][0], cp[c[0]][1], cp[c[1]][0], cp[c[1]][1]);
        //print(d(cp[c[0]], cp[c[1]]));
    }
    //text(str(round(cp[1][0]))+' ' + str(round(cp[1][1]))+' ' +str(round(cp[1][2])), cp[1][0]+10, cp[1][1])
    //text(str(round(cp[5][0]))+' ' + str(round(cp[5][1]))+' ' +str(round(cp[5][2])), cp[5][0]+10, cp[5][1])
    pop()
    
    tr[0] += tr_sp[0];
    tr[1] += tr_sp[1];
    tr[2] += tr_sp[2];
    
    rot[0] += rot_sp[0];
    rot[1] += rot_sp[1];
    rot[2] += rot_sp[2];
    
    scal[0] += scal_sp[0];
    scal[1] += scal_sp[1];
    scal[2] += scal_sp[2];

}