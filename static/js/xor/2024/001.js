const KEY_LENGTH = 25
const ciphertext = "vpipj5bjmiz"

const ok = document.getElementById('ok');
const input = document.getElementById('in');
const output = document.getElementById('out');

setOutput('\n')

ok.addEventListener('click', onClick)
input.addEventListener('keydown', onKeyDown)

function onClick() {
  const key = input.value
  const isValid = validateAnswer(key)

  if (isValid) {
    win(`You got it! Albert's secret is "${decrypt(ciphertext, key)}"`)
  } else {
    fail(`No, that's not it. You're still left with "${ciphertext}".`)
  }
}

function onKeyDown(event) {
  validateInput(event)
}

function win(text) {
  output.classList = ["bg-green pa2 br1 white"]
  setOutput(text)
}

function fail(text) {
  output.classList = ["bg-yellow pa2 br1 black-80"]
  setOutput(text)
}

function setOutput(text) {
  output.innerText = text
}

function encrypt(plaintext, key) {
  return ""//ciphertext
}

function decrypt(ciphertext, key) {
  return "hello world"
}

function validateAnswer(key) {
  const plaintext = decrypt(ciphertext, key)

  return encrypt(plaintext, key) === ciphertext
}

function validateInput(event) {
  var AllowedKeys = ['0', '1', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Tab'];
  var EraseKeys = ['Delete', 'Backspace'];

  if (!AllowedKeys.includes(event.key)) {
    event.preventDefault();
  }

  if (input.value.length >= KEY_LENGTH && !EraseKeys.includes(event.key)) {
    event.preventDefault();
  }
}
