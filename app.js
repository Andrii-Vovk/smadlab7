

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
  //console.log(sum);
  sum = parseFloat((sum / arr.length).toFixed(5));
  //  sum = sum / arr.length;
  return sum;
}

function dispersion() {
  let newarr = read();
  let dispersion = 0;
  let sum = 0;
  let avg = average(newarr);
 //console.log(avg);
  for (var i = 0; i < newarr.length; i++) {
    sum = sum + Math.pow(newarr[i] - avg, 2);
  }
  sum = sum / newarr.length;
  return parseFloat(sum.toFixed(7));
}

function AvgSquare() {
  return Math.sqrt(dispersion());
}

function truedisp() {
  let newarr = read();
  let newdisp = (newarr.length / (newarr.length - 1)) * dispersion();
  return newdisp;
}

function trueAvgSquare() {
  return Math.sqrt(truedisp());
}

function setLabels() {
  document.getElementById('average').innerHTML = average(read());
  document.getElementById('disp').innerHTML = dispersion();
  document.getElementById('AvgSquare').innerHTML = AvgSquare();

  expectationDisp();
  expectation();
  avgSqureInterval()
}


function main() {
  addbtn.addEventListener('click', () => addCell('zero'));
  removebtn.addEventListener('click', () => deleteCell('zero'));
  donebtn.addEventListener('click', () => setLabels());
}

main();

function convertTyLaplace(significance) {
  let laplaceFunction = new Map();
  laplaceFunction.set(0.95, 1.95);
  laplaceFunction.set(0.99, 2.58);
  laplaceFunction.set(0.999, 3.38);

  return laplaceFunction.get(significance);
}

function convertTyStudent(significance) {
  let studentFunction = new Map();
  studentFunction.set(0.95, 2.02);
  studentFunction.set(0.99, 2.70);
  studentFunction.set(0.999, 3.55);

  return studentFunction.get(significance);
}

function convertTyQ(significance) {
  let q = new Map();
  q.set(0.95, 0.22);
  q.set(0.99, 0.32);
  q.set(0.999, 0.46);

  return q.get(significance);
}

function expectationDisp() {
  var laplace = 1-parseFloat(document.getElementById('significance').value);
  laplace = convertTyLaplace(laplace);

  let arg = (AvgSquare()/Math.sqrt(read().length))*laplace;
  let left = average(read()) - arg;
  let right = average(read()) + arg;

  //console.log(left + '< m <' + right);

  document.getElementById('expectdisp').innerHTML = left + ' < m < ' + right;
}

function expectation() {
  var student = 1-parseFloat(document.getElementById('significance').value);
  student = convertTyStudent(student);

  let arg = (AvgSquare()/Math.sqrt(read().length))*student;
  let left = average(read()) - arg;
  let right = average(read()) + arg;

  //console.log(left + '< m <' + right);

  document.getElementById('expect').innerHTML = left + ' < m < ' + right;
}

function avgSqureInterval() {
  var q = 1-parseFloat(document.getElementById('significance').value);
  q = convertTyQ(q);
  /* console.log(q)
  console.log(1-q) */
  var left = trueAvgSquare() * (1-q);
  var right = trueAvgSquare() * (1+q);

  document.getElementById('AvgSquareInterval').innerHTML = left + ' < σ < ' + right;

}