const removecolbtn = document.getElementById('removecolbtn');
const addcolbtn = document.getElementById('addcolbtn');;
const donebtn = document.getElementById('donebtn');
const table = document.getElementById('dataTable');

const simpleAdder = (accumulator, currentValue) => accumulator + currentValue;
const powerAdder = (accumulator, currentValue) => accumulator + (currentValue ** 2);

function addCell() {
  for (var i = 0; i < table.rows.length; i++) {
    table.rows[i].insertCell(-1);
  }
}

function deleteCell() {
  for (var i = 0; i < table.rows.length; i++) {
    table.rows[i].deleteCell(-1);
  }
}

function read(rowid) {
  let arr = [];
  let row = table.rows[rowid];
  for (var j = 1, col; col = row.cells[j]; j++) {
    arr.push(parseFloat(row.cells[j].innerHTML))
  }
  return arr;
}

function calculateDelta(arr) {
  return arr.length * arr.reduce(powerAdder) - (arr.reduce(simpleAdder)) ** 2;
}

function multSum(x, y) {
  let result = 0;
  for (var i = 0; i < x.length; i++) {
    result += x[i] * y[i];
  }
  return result;
}

function calculateDeltaAlpha(x, y) {
  return x.reduce(powerAdder) * y.reduce(simpleAdder) - x.reduce(simpleAdder) * multSum(x, y);
}

function calculateDeltaBeta(x, y) {
  return x.length * multSum(x, y) - x.reduce(simpleAdder) * y.reduce(simpleAdder);
}

function getAlpha(x, y) {
  return calculateDeltaAlpha(x, y) / calculateDelta(x);
}

function getBeta(x, y) {
  return calculateDeltaBeta(x, y) / calculateDelta(x);
}

function plot(x, y, f1, f2, alpha, beta, alpha2, beta2) {
  var layout = {
    title: {
      text: 'Метод наймешних квадратів',
      font: {
        family: 'Helvetica Neue',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    }
  };

  var trace1 = {
    x: x,
    y: y,
    mode: 'markers',
    type: 'scatter',
    name: 'Вхідні дані'
  };

  var trace2 = {
    x: [0, 2],
    y: [alpha, beta * 2 + alpha],
    mode: 'lines',
    type: 'scatter',
    name: "y=" + f1
  };

  var trace3 = {
    x: [alpha2, beta2 * 2 + alpha2],
    y: [0, 2],
    mode: 'lines',
    type: 'scatter',
    name: "x=" + f2
  };

  var data = [trace1, trace2, trace3];
  Plotly.newPlot('plot1', data, layout);
}

function averageSquare(x) {
  return Math.sqrt(x.reduce(powerAdder) / x.length - (x.reduce(simpleAdder) / x.length) ** 2);
}

function Covariance(x, y) {
  let res = 0;
  for (let i = 0; i < x.length; i++) {
    res += ((x[i] - x.reduce(simpleAdder) / x.length) * (y[i] - y.reduce(simpleAdder) / y.length));
  }
  return res / x.length;
}

function rxy(x, y){
  return Covariance(x, y)/(averageSquare(x)*averageSquare(y));
 } 

function plot2(x, y, f1, f2, rxiy, ryix, avgx, avgy) {
  var layout = {
    title: {
      text: 'Із використанням статистичного коефіцієнта <br>кореляції',
      font: {
        family: 'Helvetica Neue',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    }
  };

  var trace1 = {
    x: x,
    y: y,
    mode: 'markers',
    type: 'scatter',
    name: 'Вхідні дані'
  };

  var trace2 = {
    x: [0, 2],
    y: [avgy + ryix * (0 - avgx), avgy + ryix * (2 - avgx)],
    mode: 'lines',
    type: 'scatter',
    name: "y=" + f1
  };
  var trace3 = {
    x: [avgx + rxiy * (0 - avgy), avgx + rxiy * (2 - avgy)],
    y: [0, 2],
    mode: 'lines',
    type: 'scatter',
    name: "x=" + f2
  };

  var data = [trace1, trace2, trace3];

  Plotly.newPlot('plot2', data, layout);
}

function createPlot1() {
  var x = read(0);
  var y = read(1);

  document.getElementById("delta").innerHTML = calculateDelta(x).toFixed(5);
  document.getElementById("deltaTick").innerHTML = calculateDelta(y).toFixed(5);
  document.getElementById("deltaAlpha").innerHTML = calculateDeltaAlpha(x, y).toFixed(5);
  document.getElementById("deltaBeta").innerHTML = calculateDeltaBeta(x, y).toFixed(5);
  document.getElementById("deltaAlphaTick").innerHTML = calculateDeltaAlpha(y, x).toFixed(5);
  document.getElementById("deltaBetaTick").innerHTML = calculateDeltaBeta(y, x).toFixed(5);
  document.getElementById("alpha").innerHTML = getAlpha(x, y).toFixed(5);
  document.getElementById("beta").innerHTML = getBeta(x, y).toFixed(5);
  document.getElementById("alphaTick").innerHTML = getAlpha(y, x).toFixed(5);
  document.getElementById("betaTick").innerHTML = getBeta(y, x).toFixed(5);
  document.getElementById("eq1").innerHTML = "" + getAlpha(x, y).toFixed(3) + (getBeta(x, y) < 0 ? "" : "+") + getBeta(x, y).toFixed(3) + "x<sup>*</sup>";
  document.getElementById("eq2").innerHTML = "" + getAlpha(y, x).toFixed(3) + (getBeta(y, x) < 0 ? "" : "+") + getBeta(y, x).toFixed(3) + "y<sup>*</sup>";

  let yNaX = getAlpha(x, y).toFixed(3) + (getBeta(x, y) < 0 ? "" : "+") + getBeta(x, y).toFixed(3) + "x<sup>*</sup>";
  let xNaY = getAlpha(y, x).toFixed(3) + (getBeta(y, x) < 0 ? "" : "+") + getBeta(y, x).toFixed(3) + "y<sup>*</sup>";
  plot(x, y, yNaX, xNaY, getAlpha(x, y), getBeta(x, y), getAlpha(y, x), getBeta(y, x));

}

function createPlot2() {
  var x = read(0);
  var y = read(1);

  const avgy = y.reduce(simpleAdder) / y.length;
  const avgx = x.reduce(simpleAdder) / x.length;
  const rxiy = rxy(x, y) * (averageSquare(x) / averageSquare(y));
  const ryix = rxy(x, y) * (averageSquare(y) / averageSquare(x));
  document.getElementById("rxy").innerHTML = rxy(x, y);
  document.getElementById("xaverage").innerHTML = avgx.toFixed(5);
  document.getElementById("yaverage").innerHTML = avgy.toFixed(5);
  document.getElementById("s0x").innerHTML = averageSquare(x).toFixed(5);
  document.getElementById("s0y").innerHTML = averageSquare(y).toFixed(5);
  document.getElementById("rxIy").innerHTML = rxiy.toFixed(5);
  document.getElementById("ryIx").innerHTML = ryix.toFixed(5);
  document.getElementById("seq1").innerHTML = "-" + avgx.toFixed(3) + " = " + rxiy.toFixed(3) + "(y * -" + avgy.toFixed(2) + ")";
  document.getElementById("seq2").innerHTML = "-" + avgy.toFixed(3) + " = " + ryix.toFixed(3) + "(x * -" + avgx.toFixed(2) + ")";
  const sxnay = avgx.toFixed(3) + "+" + rxiy.toFixed(3) + "(y<sup>*</sup>-" + avgy.toFixed(2) + ") ";
  const synax = avgy.toFixed(3) + "+" + ryix.toFixed(3) + "(x<sup>*</sup>-" + avgx.toFixed(2) + ") ";

  plot2(x, y, synax, sxnay, rxiy, ryix, avgx, avgy);
}

function setLabels() {
  createPlot1();
  createPlot2();
}


function main() {
  addcolbtn.addEventListener('click', () => addCell());
  removecolbtn.addEventListener('click', () => deleteCell());
  donebtn.addEventListener('click', () => setLabels());
}

main();

