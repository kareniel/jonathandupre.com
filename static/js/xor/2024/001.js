const ok = document.getElementById('ok');
const input = document.getElementById('in');
const output = document.getElementById('out');

output.innerText = '\n'

ok.addEventListener('click', () => {
  output.innerText = `Hi, my name is "${input.value}".`
})

console.log('hi mom!')
