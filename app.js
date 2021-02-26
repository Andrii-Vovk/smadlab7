const removebtn = document.getElementById('removebtn');
const addbtn = document.getElementById('addbtn');
const donebtn = document.getElementById('donebtn')
function addCell(RowID) {
  let newRow = document.getElementById(RowID);
  newRow.insertCell(-1);
}

function deleteCell(RowID) {
  let newRow = document.getElementById(RowID);
  newRow.deleteCell(-1);
}

function read() {
  let table = document.getElementById('dataTable');
  let arr = [];
  let row = table.rows[0];
  for (var j = 1, col; col = row.cells[j]; j++) {
    arr.push(parseFloat(row.cells[j].innerHTML))
  }
  return arr;
}

function average(arr) {
  let sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  console.log(sum);
  sum = parseFloat((sum / arr.length).toFixed(5));
  //  sum = sum / arr.length;
  return sum;
}

function mode(arr) {
  let N = arr.length;
  let max = arr[0], cmax = 0, rmax = 0;
  for (var i = 0; i < N; i++) {
    if (cmax > rmax) {
      rmax = cmax;
      max = arr[i - 1];
    }
    cmax = 0;
    for (var j = i; j < N; j++)
      if (arr[j] == arr[i])
        cmax++;
  }
  console.log(max);
  return max;
}

function median() {
  let array = read();
  array = array.sort(function (a, b) {
    return a - b;
  });
  let med = 0;
  if (array.length % 2 === 0) {
    med = (array[array.length / 2] + array[array.length / 2 - 1]) / 2;
  }
  else {
    med = array[Math.floor(array.length / 2)];
  }
  return med;
}

function maxmin() {
  let newarr = read();
  return (Math.max(...newarr) - Math.min(...newarr)).toFixed(2);
}

function dispersion() {
  let newarr = read();
  let dispersion = 0;
  let sum = 0;
  let avg = average(newarr);
  console.log(avg);
  for (var i = 0; i < newarr.length; i++) {
    sum = sum + Math.pow(newarr[i] - avg, 2);
  }
  sum = sum / newarr.length;
  return parseFloat(sum.toFixed(7));
}

function truedisp() {
  let newarr = read();
  let newdisp = (newarr.length / (newarr.length - 1)) * dispersion();
  return newdisp;
}

function variation() {
  let newarr = read();
  return Math.sqrt(dispersion()) / average(newarr);
}

function startmoment() {
  let order = parseFloat(document.getElementById('startorder').value);
  let arr = read();
  let moment = 0;
  for (var i = 0; i < arr.length; i++) {
    moment += Math.pow(arr[i], order);
  }
  moment = moment / arr.length;
  return moment;
}

function centralmoment(ord) {
  let order = ord;
  if (order == 1) return 0;
  let arr = read();
  let moment = 0;
  let avg = average(arr);
  for (var i = 0; i < arr.length; i++) {
    moment += Math.pow(arr[i] - avg, order);
  }
  moment = moment / arr.length;
  return moment;
}

function assymetry() {
  return (centralmoment(3) / Math.pow(Math.sqrt(dispersion()), 3))
}

function excess() {
  return ((centralmoment(4) / Math.pow(Math.sqrt(dispersion()), 4)) - 3);
}

function setLabels() {
  let arr = read();
  document.getElementById('average').innerHTML = average(arr);
  document.getElementById('mode').innerHTML = mode(arr);
  document.getElementById('median').innerHTML = median();
  document.getElementById('minmax').innerHTML = maxmin();
  document.getElementById('disp').innerHTML = dispersion();
  document.getElementById('AvgSquare').innerHTML = Math.sqrt(dispersion());
  document.getElementById('truedisp').innerHTML = truedisp();
  document.getElementById('trueAvgSquare').innerHTML = Math.sqrt(truedisp());
  document.getElementById('variation').innerHTML = variation();
  document.getElementById('startmoment').innerHTML = startmoment();
  document.getElementById('centralmoment').innerHTML = centralmoment(parseFloat(document.getElementById('centralorder').value));
  document.getElementById('Assymetry').innerHTML = assymetry();
  document.getElementById('Excess').innerHTML = excess();

  drawPoligon();
  drawPolRelative();
  drawCum();
  drawCumRelative();
  drawEmpiric();
}


function main() {
  addbtn.addEventListener('click', () => addCell('zero'));
  removebtn.addEventListener('click', () => deleteCell('zero'));
  donebtn.addEventListener('click', () => setLabels());
  startmoment();
}

main();

function getCountsArray() {
  var a = [], b = [], prev;
  let arr = read();
  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  const data = [];
  for (var i = 0; i < a.length; i++) {
    data.push([a[i], b[i]]);
  }
  return data;
}

function getCountsArrayRelative() {
  var a = [], b = [], prev;
  let arr = read();
  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  const data = [];
  let sum = 0;
  for (var i = 0; i < b.length; i++) {
    sum = sum + b[i];
  }

  for (var i = 0; i < b.length; i++) {
    b[i] = b[i] / sum;
  }

  for (var i = 0; i < b.length; i++) {
    data.push([a[i], b[i]]);
  }
  return data;
}

function getCountsArrayCumulative() {
  var a = [], b = [], prev;
  let arr = read();
  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  for (var i = 1; i < b.length; i++) {
    b[i] = b[i] + b[i - 1];
  }

  const data = [];
  for (var i = 0; i < a.length; i++) {
    data.push([a[i], b[i]]);
  }
  return data;
}

function getCountsArrayCumRelative() {
  var a = [], b = [], prev;
  let arr = read();
  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  const data = [];
  let sum = 0;
  for (var i = 0; i < b.length; i++) {
    sum = sum + b[i];
  }

  for (var i = 0; i < b.length; i++) {
    b[i] = b[i] / sum;
  }

  for (var i = 1; i < b.length; i++) {
    b[i] = b[i] + b[i - 1];
  }

  for (var i = 0; i < b.length; i++) {
    data.push([a[i], b[i]]);
  }
  return data;
}

function getCountsEmpiric() {
  var a = [], b = [], prev;
  let arr = read();
  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  for (var i = 1; i < b.length; i++) {
    b[i] = b[i] + b[i - 1];
  }

  let Narr = read();
  let N = Narr.length;

  for (var i = 1; i < b.length; i++) {
    b[i] = (b[i] / N);
  }
  b[0] = 0;
  const data = [];
  for (var i = 0; i < a.length; i++) {
    data.push([a[i], b[i]]);
  }
  return data;
}

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawPoligon);
google.charts.setOnLoadCallback(drawPolRelative);
google.charts.setOnLoadCallback(drawCum);
google.charts.setOnLoadCallback(drawCumRelative);
google.charts.setOnLoadCallback(drawEmpiric);

function drawPoligon() {
  const prepdata = [];
  const newarr = getCountsArray();
  prepdata.push(['Element', 'Значення']);
  prepdata.push(...newarr);
  var data = google.visualization.arrayToDataTable(prepdata);  //get new data

  var options = {
    title: 'Полігон частот',
    curveType: 'line',
    legend: { position: 'right' },
    pointSize: 4,
    vAxis: {
      viewWindow: {
        min: 0
      }
    }
  };
  var chart = new google.visualization.LineChart(document.getElementById('Poligon'));

  chart.draw(data, options);
}

function drawPolRelative() {
  const prepdata = [];
  const newarr = getCountsArrayRelative();
  prepdata.push(['Element', 'Значення']);
  prepdata.push(...newarr);
  var data = google.visualization.arrayToDataTable(prepdata);  //get new data

  var options = {
    title: 'Полігон відносних частот',
    curveType: 'line',
    pointSize: 4,
    vAxis: {
      viewWindow: {
        min: 0
      }
    }
  };
  var chart = new google.visualization.LineChart(document.getElementById('Poligon_relative'));

  chart.draw(data, options);
}

function drawCum() {
  const prepdata = [];
  const newarr = getCountsArrayCumulative();
  prepdata.push(['Element', 'Значення']);
  prepdata.push(...newarr);
  var data = google.visualization.arrayToDataTable(prepdata);  //get new data

  var options = {
    title: 'Кумулятивна крива(нагромаджені частоти)',
    curveType: 'line',
    pointSize: 4,
    vAxis: {
      viewWindow: {
        min: 0
      }
    }
  };
  var chart = new google.visualization.LineChart(document.getElementById('Cumulative_basic'));

  chart.draw(data, options);
}

function drawCumRelative() {
  const prepdata = [];
  const newarr = getCountsArrayCumRelative();
  prepdata.push(['Element', 'Значення']);
  prepdata.push(...newarr);
  var data = google.visualization.arrayToDataTable(prepdata);  //get new data

  var options = {
    title: 'Кумулятивна крива(нагромаджені відносні частоти)',
    curveType: 'line',
    pointSize: 4,
    vAxis: {
      viewWindow: {
        min: 0
      }
    }
  };
  var chart = new google.visualization.LineChart(document.getElementById('Cumulative_relative'));

  chart.draw(data, options);
}

function drawEmpiric() {
  const prepdata = [];
  const newarr = getCountsEmpiric();
  prepdata.push(['Element', 'Значення']);
  prepdata.push(...newarr);
  var data = google.visualization.arrayToDataTable(prepdata);  //get new data

  var options = {
    title: 'Емпірична функція',
    curveType: 'line',
    pointSize: 4,
    vAxis: {
      viewWindow: {
        min: 0
      }
    }
  };
  var chart = new google.visualization.SteppedAreaChart(document.getElementById('Empiric'));

  chart.draw(data, options);
}

