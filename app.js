const removecolbtn = document.getElementById('removecolbtn');
const removerowbtn = document.getElementById('removerowbtn');
const addcolbtn = document.getElementById('addcolbtn');
const addrowbtn = document.getElementById('addrowbtn');
const donebtn = document.getElementById('donebtn');

const table = document.getElementById('dataTable');

function addCell() {
  for (var i = 0; i < table.rows.length; i++) {
    table.rows[i].insertCell(-1);
  }
  table.rows[0].cells[table.rows[0].cells.length - 1].innerHTML = table.rows[0].cells.length - 1;
}

function deleteCell() {
  for (var i = 0; i < table.rows.length; i++) {
    table.rows[i].deleteCell(-1);
  }
}

function addRow() {
  // alert(table.rows.length);
  var newRow = table.insertRow(-1);
  for (var i = 0; i < table.rows[0].cells.length; i++) {
    newRow.insertCell(-1);
  }
  table.rows[table.rows.length - 1].cells[0].innerHTML = table.rows.length - 1;
}

function deleteRow() {
  table.deleteRow(table.rows.length - 1);
}

function read() {
  let data = [];
  let tmparr = [];
  for (var i = 1; i < table.rows.length; i++) {
    for (var j = 1; j < table.rows[i].cells.length; j++) {
      tmparr.push(parseFloat(table.rows[i].cells[j].innerHTML));
    }
    data.push(tmparr);
    tmparr = [];
  }
  return data;
}

console.table(read());

function averagerow(id) {
  let arr = read();
  let avg = 0;
  for (var i = 0; i < arr[id].length; i++) {
    avg += arr[id][i];
  }
  avg = avg / arr[id].length;
  return avg;
}

function averagecol(id) {
  let arr = read();
  let avg = 0;
  for (var i = 0; i < arr.length; i++) {
    avg += arr[i][id];
  }
  avg = avg / arr.length;
  return avg;
}

function averagetotal() {
  let arr = read();
  let avg = 0;
  for (var i = 0; i < arr.length; i++) {
    avg += averagerow(i);
  }
  avg = avg / arr.length;
  return avg;
}


function Q() {
  return Q1() + Q2() + Q3();
}

function Q1() {
  let arr = read();;
  let add2 = 0;


  for (var i = 0; i < arr.length; i++) {
    add2 += (averagerow(i) - averagetotal()) ** 2;
  }

  return add2 * arr[0].length;
}

function Q2() {
  let arr = read();
  let add1 = 0;

  for (var i = 0; i < arr[0].length; i++) {
    add1 += (averagecol(i) - averagetotal()) ** 2;
  }

  return arr.length * add1;
}

function Q3() {
  let arr = read();
  let add3 = 0;

  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      add3 += (arr[i][j] - averagerow(i) - averagecol(j) + averagetotal()) ** 2
    }
  }
  return add3;
}

function S2() {
  let arr = read();
  return (Q() / (arr.length * arr[0].length - 1));
}

function S21() {
  let arr = read();
  return (Q1() / (arr.length - 1));
}

function S22() {
  let arr = read();
  return (Q2() / (arr[0].length - 1));
}

function S23() {
  let arr = read();
  return Q3() / ((arr.length - 1) * (arr[0].length - 1));
}

function fidgerFact1() {
  return S21() / S23();
}

function fidgerFact2() {
  return S22() / S23();
}

function fidgerTheoreticalFact1() {
  let arr = read();
  return jStat.centralF.inv(1 - parseFloat(document.getElementById('alpha').value), (arr.length - 1), ((arr.length - 1) * (arr[0].length - 1)));
}

function fidgerTheoreticalFact2() {
  let arr = read();
  return jStat.centralF.inv(1 - parseFloat(document.getElementById('alpha').value), (arr[0].length - 1), ((arr.length - 1) * (arr[0].length - 1)));
}

function setLabels() {
  document.getElementById('avgtotalspan').innerHTML = averagetotal();
  document.getElementById('Qspan').innerHTML = Q();
  document.getElementById('Q1span').innerHTML = Q1();
  document.getElementById('Q2span').innerHTML = Q2();
  document.getElementById('Q3span').innerHTML = Q3();
  document.getElementById('S2span').innerHTML = S2();
  document.getElementById('S21span').innerHTML = S21();
  document.getElementById('S22span').innerHTML = S22();
  document.getElementById('S23span').innerHTML = S23();
  document.getElementById('Fidgerspan1').innerHTML = fidgerFact1();
  document.getElementById('FidgerTspan1').innerHTML = fidgerTheoreticalFact1();
  document.getElementById('Fidgerspan2').innerHTML = fidgerFact2();
  document.getElementById('FidgerTspan2').innerHTML = fidgerTheoreticalFact2();
  if (fidgerFact1() < fidgerTheoreticalFact1()) {
    document.getElementById('conclusion1').innerHTML = "F* < F, фактор #1 не впливає на результати вимірювань і ним можна знехтувати."
  }
  else {
    document.getElementById('conclusion1').innerHTML = "F* > F, фактор #1 фактор впливає на результати вимірювань і ним можна знехтувати."
  }

  if (fidgerFact2() < fidgerTheoreticalFact2()) {
    document.getElementById('conclusion2').innerHTML = "F* < F, фактор #2 не впливає на результати вимірювань і ним можна знехтувати."
  }
  else {
    document.getElementById('conclusion2').innerHTML = "F* > F, фактор #2 фактор впливає на результати вимірювань і ним можна знехтувати."
  }
}


function main() {
  addcolbtn.addEventListener('click', () => addCell());
  addrowbtn.addEventListener('click', () => addRow());
  removecolbtn.addEventListener('click', () => deleteCell());
  removerowbtn.addEventListener('click', () => deleteRow());
  donebtn.addEventListener('click', () => setLabels());
}

main();

