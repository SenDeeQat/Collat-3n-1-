const output = document.getElementById('output');
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const logoImg = document.getElementById('logo-img');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    themeIcon.src = "img/sun.png";
    logoImg.src = "img/logo-dark.svg"; 
  } else {
    themeIcon.src = "img/moon.png";
    logoImg.src = "img/logo.svg";
  }
});

function collatz(n) {
  let seq = [n], steps = 0, divs = 0, muls = 0;
  while (n !== 1) {
    if (n % 2 === 0) { n = n / 2; divs++; } 
    else { n = 3*n+1; muls++; }
    seq.push(n); steps++;
  }
  return { seq, steps, divs, muls };
}

function computeSingle() {
  const n = parseInt(document.getElementById('singleInput').value);
  if (!n || n<=0) return alert("Введите натуральное число");
  const { seq, steps, divs, muls } = collatz(n);

  output.innerHTML = `
  <div class="results">
    <div class="block">
      <h2>Алгоритм</h2>
      <table>
        <tr><th>Шаг</th><th>Правило</th><th>Число</th></tr>
        ${seq.map((num,i)=>`
          <tr><td>${i}</td>
          <td>${i===0?"Старт":(seq[i-1]%2===0?"Чётное → /2":"Нечётное → *3+1")}</td>
          <td>${num}</td></tr>`).join('')}
      </table>
      <p>Всего шагов: ${steps} | Делений: ${divs} | Умножений: ${muls}</p>
    </div>
    <div class="block"><h2>График</h2><canvas id="chart"></canvas></div>
  </div>`;
  drawChart(seq);
}

function computeRange() {
  const start = parseInt(document.getElementById('rangeStart').value);
  const end = parseInt(document.getElementById('rangeEnd').value);
  if(!start || !end || start<=0 || end<=0 || end<start) return alert("Введите корректный диапазон");
  let rows="";
  for(let n=start;n<=end;n++){
    const {steps} = collatz(n);
    rows+=`<tr onclick="showSingle(${n})"><td>${n}</td><td>${steps}</td></tr>`;
  }
  output.innerHTML=`<div class="block" style="width:100%">
    <h2>Диапазон ${start}–${end}</h2>
    <table><tr><th>Число</th><th>Шагов до 1</th></tr>${rows}</table>
  </div>`;
}

function showSingle(n){
  document.getElementById('singleInput').value=n;
  computeSingle();
  output.innerHTML+=`<button class="back-btn" onclick="computeRange()">← Назад</button>`;
}

function drawChart(seq){
  const canvas=document.getElementById("chart");
  const ctx=canvas.getContext("2d");
  canvas.width=canvas.clientWidth;
  canvas.height=canvas.clientHeight;
  const maxVal=Math.max(...seq);
  const xStep=canvas.width/(seq.length-1);
  const yScale=canvas.height/maxVal;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.moveTo(0,canvas.height-seq[0]*yScale);
  seq.forEach((v,i)=>ctx.lineTo(i*xStep,canvas.height-v*yScale));
  ctx.strokeStyle="#007aff"; ctx.lineWidth=2; ctx.stroke();
}
