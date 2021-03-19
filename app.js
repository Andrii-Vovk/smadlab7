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
  table.rows[table.rows.length - 1].cells[0] = table.rows.length - 1;
}

function deleteRow() {
  table.deleteRow(table.rows.length - 1);
}

function read() {
  let data = [];
  let tmparr = [];
  for (var i = 0; i < table.rows.length; i++) {
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

function averagetotal() {
  let arr = read();
  let avg = 0;
  for (var i = 0; i < arr.length; i++) {
    avg += averagerow(i);
  }
  avg = avg / arr.length;
  return avg;
}

for(var i = 0; i < 4; i++) {
  console.log(averagerow(i));
}


function Q() {
  let arr = read();
  let add1 = 0;
  let add2 = 0;

  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      add1 += (arr[i][j] - averagerow(i))**2;
    }
  }

  for (var i = 0; i < arr.length; i++) {
    add2 += Math.pow(averagerow(i) - averagetotal(), 2)
  }

  return add1 + (add2*arr[0].length);
}

function Q1() {
  let arr = read();;
  let add2 = 0;


  for (var i = 0; i < arr.length; i++) {
    add2 += (averagerow(i) - averagetotal())**2;
  }

  return add2 * arr[0].length;
}

function Q2() {
  let arr = read();
  let add1 = 0;

  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
    //  console.log(arr[i][j] + '-' + averagerow(i)
      add1 += (arr[i][j] - averagerow(i))**2;
    }
  }
  return add1;
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
  return (Q2() / (arr.length * (arr[0].length - 1)));
 }

 function fidger() {
   return S21() / S22();
 }

 function fidgerTheoretical() {
   return jStat.centralF.inv(1 - parseFloat(document.getElementById('alpha').value), 3, 28);
 }

fidgerTheoretical();
function setLabels() {
  document.getElementById('avgtotalspan').innerHTML = averagetotal();
  document.getElementById('Qspan').innerHTML = Q();
  document.getElementById('Q1span').innerHTML = Q1();
  document.getElementById('Q2span').innerHTML = Q2();
  document.getElementById('S2span').innerHTML = S2();
  document.getElementById('S21span').innerHTML = S21();
  document.getElementById('S22span').innerHTML = S22();
  document.getElementById('Fidgerspan').innerHTML = fidger();
  document.getElementById('FidgerTspan').innerHTML = fidgerTheoretical();
  if(fidger() < fidgerTheoretical()) {
    document.getElementById('conclusion').innerHTML = "F* < F, досліджуваний фактор не впливає на результати вимірювань і ним можна знехтувати."
  }
  else {
    document.getElementById('conclusion').innerHTML = "F* > F, досліджуваний фактор впливає на результати вимірювань і ним можна знехтувати."
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

