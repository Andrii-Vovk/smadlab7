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

function stergess() {
  const arr = read();
  let stergess = 1 + 3.322 * Math.log10(arr.length);
  return Math.trunc(stergess);
}

function getIntervals() {
  const intervalsArr = [];
  const arr = read();

  let xmax = Math.max(...arr);
  let xmin = Math.min(...arr);
  let l = (xmax - xmin) / stergess();
  let tmp = { start: 0, end: 0 };

  tmp.start = xmin;
  tmp.end = xmin + l;
  intervalsArr.push({ start: tmp.start, end: tmp.end });
  for (var i = 1; i < stergess(); i++) {
    tmp.start = tmp.end;
    tmp.end = tmp.end + l;
    intervalsArr.push({ start: tmp.start, end: tmp.end });
  }
  return intervalsArr;
}

console.table(getIntervals());

function getMiddles() {
  arr = getIntervals();
  let middles = [];

  for (var i = 0; i < arr.length; i++) {
    middles.push((arr[i].end + arr[i].start) / 2);
  }

  return middles;
}

console.table(getMiddles());

function helpcount(start, end) {
  let arr = read();
  let counter = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] >= start && arr[i] < end) {
      counter++;
    }
  }
  return counter;
}

function getFrequencies() {
  const intervals = getIntervals();
  let freqs = [];
  for (var i = 0; i < stergess(); i++) {
    freqs.push(helpcount(intervals[i].start, intervals[i].end));
  }
  return freqs;
}

console.table(getFrequencies());

function createIntervalTable() {
  let intervals = getIntervals();
  let middles = getMiddles();
  let freqs = getFrequencies();

  let interval_row = document.getElementById('interval_row');
  let middle_row = document.getElementById('middle_row');
  let freq_row = document.getElementById('frequency_row');

  for (var i = 0; i < intervals.length; i++) {
    addCell('interval_row');
    addCell('middle_row');
    addCell('frequency_row');
  }
  let datatable = document.getElementById('intervalDataTable');
  for (var i = 0; i < freqs.length; i++) {
    datatable.rows[0].cells[i + 1].innerHTML = (parseFloat(intervals[i].start).toFixed(3) + ' - ' + parseFloat(intervals[i].end).toFixed(3));
    datatable.rows[1].cells[i + 1].innerHTML = middles[i];
    datatable.rows[2].cells[i + 1].innerHTML = freqs[i];
  }
}

function average() {
  const middles = getMiddles();
  const freqs = getFrequencies();
  let avg = 0;

  for (var i = 0; i < middles.length; i++) {
    avg = avg + middles[i] * freqs[i];
  }
  avg = avg / (read().length);
  return avg;
}

function mode(arr) {
  let intervals = getIntervals();
  let freqs = getFrequencies();

  let id_modal = 0;

  for (var i = 0; i < freqs.length; i++) {
    if (freqs[i] === Math.max(...freqs)) {
      id_modal = i;
      break;
    }
  }

  let premodal = 0;
  if (id_modal > 0) {
    premodal = freqs[id_modal - 1];
  }
  let aftermodal = 0;
  if (id_modal < freqs.length - 1) {
    aftermodal = freqs[id_modal + 1];
  }

  let modeval = 0;
  modeval = intervals[id_modal].start + (((freqs[id_modal] - premodal) / (2 * freqs[id_modal] - premodal - aftermodal)) * (intervals[id_modal].end - intervals[id_modal].start))
  return modeval;
}

function getMedByInterval(id) {
  let intervals = getIntervals();
  let freqs = getFrequencies();

  let l = intervals[id].end - intervals[id].start;

  let cummulativeFreqs = 0;
  for (var i = 0; i < id; i++) {
    cummulativeFreqs = cummulativeFreqs + freqs[i];
  }

  let med = intervals[id].start + ((l / freqs[id]) * ((read().length / 2) - cummulativeFreqs))
  return med;
}

function median() {
  let freqs = getFrequencies();
  if (freqs.length % 2 !== 0) {
    return getMedByInterval(Math.trunc(freqs.length / 2));
  }
  else {
    return (getMedByInterval(Math.trunc(freqs.length / 2 - 1)) + getMedByInterval(Math.trunc(freqs.length / 2))) * 0.5;
  }
}

function maxmin() {
  return (Math.max(...read()) - Math.min(...read())).toFixed(2);
}

function dispersion() {
  let middles = getMiddles();
  let freqs = getFrequencies();

  let avg = average();
  let disp = 0;
  for (var i = 0; i < freqs.length; i++) {
    disp = disp + freqs[i] * Math.pow((middles[i] - avg), 2);
  }
  disp = disp / read().length;
  return disp;
}

function truedisp() {
  let newarr = read();
  let newdisp = (newarr.length / (newarr.length - 1)) * dispersion();
  return newdisp;
}

function variation() {
  return Math.sqrt(dispersion()) / average();
}

function startmoment() {
  let order = parseFloat(document.getElementById('startorder').value);
  let moment = 0;

  let middles = getMiddles();
  let freqs = getFrequencies();

  if (order === 0) return 1;
  if (order === 0) return average();

  for (var i = 0; i < arr.length; i++) {
    moment += freqs[i] * Math.pow(middles[i], order);
  }
  moment /= read().length;
  return moment;
}

function centralmoment(order = -1) {
  if (order === -1)
    trueorder = parseFloat(document.getElementById('centralmoment').innerHTML);
  else trueorder = order;

  let middles = getMiddles();
  let freqs = getFrequencies();

  let moment = 0;

  for (var i = 0; i < freqs.length; i++) {
    moment += freqs[i] * Math.pow((middles[i] - average()), trueorder);
  }
  moment = moment / read().length;
  return moment;
}

function assymetry() {
  return (centralmoment(3) / Math.pow(Math.sqrt(dispersion()), 3))
}

function excess() {
  return ((centralmoment(4) / Math.pow(Math.sqrt(dispersion()), 4)) - 3);
}

function setLabels() {
  createIntervalTable();
  document.getElementById('average').innerHTML = average();
  document.getElementById('mode').innerHTML = mode(arr);
  document.getElementById('median').innerHTML = median();
  document.getElementById('minmax').innerHTML = maxmin();
  document.getElementById('disp').innerHTML = dispersion();
  document.getElementById('AvgSquare').innerHTML = Math.sqrt(dispersion());
  document.getElementById('truedisp').innerHTML = truedisp();
  document.getElementById('trueAvgSquare').innerHTML = Math.sqrt(truedisp());
  document.getElementById('variation').innerHTML = variation();
  document.getElementById('startmoment').innerHTML = startmoment();
  document.getElementById('centralmoment').innerHTML = centralmoment();
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
