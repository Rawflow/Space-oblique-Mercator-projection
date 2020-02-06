window.onload = () => {

  let main = (() => {

    let points1 = createPoints()[0];
    let points2 = createPoints()[1];
    console.log(points1,points2);0
    let c = document.getElementById('myCanvas');
    let context = c.getContext('2d');
    context.clearRect(0, 0, c.width, c.height);
    context.beginPath();
    context.setLineDash([]);
    context.transform(1, 0, 0, -1, 0, c.height);
    context.lineWidth=0.5;
    context.strokeStyle='#000000';
    
    let scale = 70000;
    for(let i = 0; i < points1.length; i++){
      context.moveTo(points1[i][0].x/scale + 100, points1[i][0].y/scale+ 300);

      for(let j = 0; j < points1[i].length; j++){
        context.lineTo(points1[i][j].x/scale + 100, points1[i][j].y/scale+ 300);
      }   
    }

    for(let i = 0; i < points2.length; i++){
      context.moveTo(points2[i][0].x/scale + 100, points2[i][0].y/scale+ 300);

      for(let j = 0; j < points2[i].length; j++){
        context.lineTo(points2[i][j].x/scale + 100, points2[i][j].y/scale+ 300);
      }   
    }
    context.stroke();

    let sanMarino =  {
      x : 43,
      y : 12
    };
    let Lisbon = {
      x : 38,
      y : -9
    };
    let Abuja = {
      x : 9,
      y : 29
    };

    drawSlerp(sanMarino,Lisbon);
    drawSlerp(sanMarino,Abuja);

  })() ;

}

function drawSlerp(city1, city2){
  let c = document.getElementById('myCanvas');
  let context = c.getContext('2d');
  context.beginPath();
  context.setLineDash([]);
  context.lineWidth=2;
  context.strokeStyle='#449900';
  let scale = 70000;
  let p = slerp(city1, city2);
  let points = [];
  for(let i = 0; i < p.length; i++){
    points.push(calculateXY(p[i].x, p[i].y));
  }
  console.log(points);

  context.moveTo(points[0].x/scale + 100, points[0].y/scale+ 300);
  for(let i= 0; i < 360; i += 20) {
    angle = i;
    let xn = 3 * Math.cos(angle * Math.PI/180);
    let yn = 3 * Math.sin(angle * Math.PI/180);
    context.lineTo((points[0].x/scale + 100) + xn, (points[0].y/scale+ 300) + yn);
  }
  context.moveTo(points[points.length-1].x/scale + 100, points[points.length-1].y/scale+ 300);
  for(let i= 0; i < 360; i += 20) {
    angle = i;
    let xn = 3 * Math.cos(angle * Math.PI/180);
    let yn = 3 * Math.sin(angle * Math.PI/180);
    context.lineTo((points[points.length-1].x/scale + 100) + xn, (points[points.length-1].y/scale+ 300) + yn);
  }
  context.moveTo(points[0].x/scale + 100, points[0].y/scale+ 300);
  for(let i = 1; i < points.length; i++){
      context.lineTo(points[i].x/scale + 100, points[i].y/scale+ 300);
  }
  context.stroke();
}

function createPoints(){
  let masPoints1 = [];
  let masPoints2 = [];
  for(let i = -90; i < 0; i += 10){
    let masTemp = [];
    for(let j = -180; j < 180; j += 2.5){
      masTemp.push(calculateXY(i,j));
    }
    masPoints1.push(masTemp);
  }
  for(let i = -180; i < 180; i += 10){
    let masTemp = [];
    for(let j = -90; j < 0; j += 2.5){
      masTemp.push(calculateXY(j,i));
    }
    masPoints1.push(masTemp);
  }


  for(let i = 0; i < 90; i += 10){
    let masTemp = [];
    for(let j = -180; j < 180; j += 1){
      masTemp.push(calculateXY(i,j));
    }
    masPoints2.push(masTemp);
  }
  for(let i = -180; i < 180; i += 10){
    let masTemp = [];
    for(let j = 2.5; j < 90; j += 1){
      masTemp.push(calculateXY(j,i));
    }
    masPoints2.push(masTemp);
  }
  return [masPoints1,masPoints2];
}

function calculateXY(phi,lambda){
  let R = 6370997;  //radius of sphere
  let i = 99.092;   //angle
  let P2 = 18;  //time
  let P1 = 251;  //time
  let path = 15;  //path number of Landsat
  let deltaLambda = 9;  
  let sumFLambda = 0;  
  let sumA2 = 0;
  let sumA4 = 0;
  let sumC1 = 0;
  let sumC3 = 0;
  let multiplier = 1;
  let H = 1 - (P2/P1) *  Math.cos(i * Math.PI / 180);  //const
  //console.log(H);
  
  for(let lamb = 0; lamb <= 90; lamb += deltaLambda){
    if(lamb === 90)
      multiplier = 1;
    let S = (P2/P1) * Math.sin(i * Math.PI / 180) * Math.cos(lamb * Math.PI / 180);
    let FLambda = (H - S*S) / Math.pow((1 + S*S), 0.5);
    let FA2 = (H - S*S) / Math.pow((1 + S*S), 0.5) * Math.cos(2 * lamb * Math.PI / 180);
    let FA4 = (H - S*S) / Math.pow((1 + S*S), 0.5) * Math.cos(4 * lamb * Math.PI / 180);
    let FC1 = S / Math.pow((1 + S*S), 0.5) * Math.cos(lamb * Math.PI / 180);
    let FC3 = S / Math.pow((1 + S*S), 0.5) * Math.cos(3 * lamb * Math.PI / 180);
    sumFLambda += FLambda * multiplier;
    sumA2 += FA2 * multiplier;
    sumA4 += FA4 * multiplier;
    sumC1 += FC1 * multiplier;
    sumC3 += FC3 * multiplier;
    switch (multiplier) {
      case 1:
        multiplier = 4;
        break;
      case 2:
        multiplier = 4;
        break;
      case 4:
        multiplier = 2;
        break;
    }

  }

  let B = (2 / 180) * (9 / 3) * sumFLambda * Math.PI / 180;  // the very important coefs
  let A2 = (4 / (180 * 2)) * (9/3) * sumA2;
  let A4 = (4 / (180 * 4)) * (9/3) * sumA4;
  let C1 = (4 * (H + 1) / 180) * (9/3) * sumC1;
  let C3 = (4 * (H + 1) / (180 * 3)) * (9/3) * sumC3;
  
  
  let plusMinus;
  let plusMinus2
  let N = 0;    //(???)number of orbits completed at the last ascending node before the satellite passes the nearest pole
  let lambdaDef;
  let lambdaT;

  (phi > 0) ? plusMinus = -1 : plusMinus = 1;
  lambda0 = Math.round((128.87 - (360/251) * path)*100)/100;
  lambdaP = 90 * (4 * N + 2 + plusMinus);
  lambdaTP = lambda - lambda0 + (P2/P1) * lambdaP;
  let cosLamb = Math.cos(lambdaTP * Math.PI / 180);
  if(cosLamb === 0 ){   // if cos(lambda`tp)
    lambdaDef = lambdaTP;
  }else {
    let temp;
    (cosLamb < 0) ? plusMinus2 = -1 : plusMinus2 = 1;
    lambdaDef = Math.atan( Math.cos(i * Math.PI / 180) * Math.tan(lambdaTP * Math.PI / 180) + Math.sin(i * Math.PI / 180) * Math.tan(phi * Math.PI / 180) / Math.cos(lambdaTP * Math.PI / 180)) * 180 / Math.PI;
    lambdaDef = lambdaDef + lambdaP - 90 * Math.sin(lambdaP * Math.PI / 180) * plusMinus2;    //quadrant correction
    do{   
      temp = lambdaDef;
      lambdaT = lambda - lambda0 + (P2/P1) * lambdaDef;
      lambdaDef = Math.atan( Math.cos(i * Math.PI / 180) * Math.tan(lambdaT * Math.PI / 180) + Math.sin(i * Math.PI / 180) * Math.tan(phi * Math.PI / 180) / Math.cos(lambdaT * Math.PI / 180)) * 180 / Math.PI;
      lambdaDef = lambdaDef + lambdaP - 90 * Math.sin(lambdaP * Math.PI / 180) * plusMinus2;    //quadrant correction  
    }while( Math.abs(temp - lambdaDef) > 0.0000001)
  }

  let phiDef = Math.asin( Math.cos(i * Math.PI / 180) * Math.sin(phi * Math.PI / 180) - Math.sin(i * Math.PI / 180) * Math.cos(phi * Math.PI / 180) * Math.sin(lambdaT * Math.PI / 180)) * 180 / Math.PI;
  let newS = (P2/P1) * Math.sin(i * Math.PI / 180) * Math.cos(lambdaDef * Math.PI / 180);
  let x = R * (B*lambdaDef + A2*Math.sin(2*lambdaDef * Math.PI / 180) + A4*Math.sin(4*lambdaDef * Math.PI / 180) - (newS/Math.pow((1 + newS*newS), 0.5)*Math.log(Math.tan((45 + phiDef/2)* Math.PI / 180))));
  let y = R * (C1*Math.sin(lambdaDef * Math.PI / 180) + C3*Math.sin(3*lambdaDef * Math.PI / 180) + (1/Math.pow((1 + newS*newS), 0.5)*Math.log(Math.tan((45 + phiDef/2) * Math.PI / 180))));
  return({
    x : x,
    y : y
  });
}

function slerp(p0,p1){
  let points = [];
  let omega = Math.acos((p0.x * p1.x + p0.y*p1.y) / (Math.sqrt(p0.x*p0.x + p0.y*p0.y) * Math.sqrt(p1.x*p1.x + p1.y*p1.y)));
  let k = 50;
  for(let i = 0; i < k; i++){
    let t = i/k;
    let x = Math.sin((1 - t) * omega) / Math.sin(omega)*p0.x + Math.sin(t * omega) / Math.sin(omega) * p1.x;
    let y = Math.sin((1 - t) * omega) / Math.sin(omega)*p0.y + Math.sin(t * omega) / Math.sin(omega) * p1.y;
    points.push({
      x : x,
      y : y
    });
  }
  return points;
}