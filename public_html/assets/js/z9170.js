Math.degrees = function(radians)
{
  return ((2*Math.PI + radians)%(2*Math.PI))*360/(2*Math.PI);
}

Math.radians = function(degrees)
{
  return ((360 + degrees)%360)*2*Math.PI/360;
}

min = function(a)
{
  var themin = false;
  for(var i = 0; i < a.length; i++) {
    if(themin === false || a[i] < themin) {
      themin = a[i];
    }
  }
  return themin;
}

function getangles(data) {
  var a=data[2];
  var b=data[0];
  var c=data[4];
  var d=data[3];
  var e=data[1];
  var f=data[5];
  var angles=[];

  angles.push(Math.degrees(Math.acos((a*a+b*b-c*c)/(2*a*b))));             //angle AB.
  angles.push(Math.degrees(Math.acos((b*b+d*d-f*f)/(2*b*d))));             //angle BD.
  angles.push(Math.degrees(Math.acos((e*e+d*d-c*c)/(2*e*d))));             //angle ED.
  angles.push(Math.degrees(Math.acos((e*e+a*a-f*f)/(2*e*a))));             //angle AE.
  angles.push(Math.degrees(Math.acos((e*e+c*c-d*d)/(2*e*c))));             //angle EC.
  angles.push(angles[4]+Math.degrees(Math.acos((a*a+c*c-b*b)/(2*a*c))));   //angle AC.
  return angles;
}

function getpoints(data, anglelist) {
  //uses side lengths and the angles to get a list of four points. CCW from lower left.
  var a=data[2];
  var b=data[0];
  var c=data[4];
  var d=data[3];
  var e=data[1];
  var f=data[5];
  var radians=[];
  for(var i = 0; i < anglelist.length; i++) {
    var angle=anglelist[i];
    radians.push(Math.radians(angle));
  }
  var points = [];
  points.push([0,0]);
  points.push([e,0]);
  points.push([c*Math.cos(radians[4]),c*Math.sin(radians[4])]);
  points.push([a*Math.cos(radians[5]),a*Math.sin(radians[5])]);
  return points;
}

function distance(point1, point2) {
  //Simple distance function to make finding post-cut edges lengths easier. 
  var dx=point2[0]-point1[0];
  var dy=point2[1]-point1[1];
  var dist=dx*dx+dy*dy;
  return Math.sqrt(dist);
}

function errorf(data, pointslist) {
  var f=data[5];
  var p1=pointslist[1];
  var p2=pointslist[3];
  var error=Math.abs(distance(p1,p2)-f);
  return error;
}

function fuzzyPointGen(data) {
  //Builds a massive list of side length combos in an attempt to eliminate laser error.
  var a=data[2];
  var b=data[0];
  var c=data[4];
  var d=data[3];
  var e=data[1];
  var f=data[5];
  var allpoints=[];
  var allerror=[];
  var alltemp=[];
  worst = 1000;
  worstf = 0;
  worstPoints = [1000,0];
  for(var ia=0; ia < 10; ia++) {
    var atemp=a-.0625+.0125*ia;
    for(var ib = 0; ib < 10; ib++) {
      var btemp=b-.0625+.0125*ib;
      for(var ic = 0; ic < 10; ic++) {
        var ctemp=c-.0625+.0125*ic;
        for(var id = 0; id < 10; id++) {
          var dtemp=d-.0625+.0125*id;
          for(var ie = 0; ie < 10; ie++) {
            var etemp=e-.0625+.0125*ie;
            var tempdata=[btemp,etemp,atemp,dtemp,ctemp,f];
            var tempangles=getangles(tempdata);
            var temppoints=getpoints(tempdata,tempangles);
            allpoints.push(temppoints);
            allerror.push(errorf(tempdata,temppoints));
            var err = errorf(tempdata,temppoints);
            var fp = distance(temppoints[1],temppoints[3]);
            if(err < worst) {
              worst = err;
              worstf = fp;
            }
            if(fp < worstPoints[0]) {
              worstPoints[0] = fp;
            }
            if(fp > worstPoints[1]) {
              worstPoints[1] = fp;
            }
          }
        }
      }
    }
  }
  return [allpoints, allerror];
}
     
function validCheck(dimensions) {
  var dimlist=dimensions.split(",");
  for(var i=0; i< dimlist.length; i++) {
    dimlist[i]=parseFloat(dimlist[i]);
  }
  var fuzzy = fuzzyPointGen(dimlist)
  var allpoints = fuzzy[0];
  var allerror = fuzzy[1];
  if(min(allerror) <= 0.125) {
    return 1;
  } else {
    return 0;
  }
}