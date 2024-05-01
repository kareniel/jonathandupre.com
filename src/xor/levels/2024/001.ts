import { decode } from '../../lib/encoding.js'
import { encrypt, decrypt, validateKey } from '../../lib/encryption.js'

const ciphertext = decode("vsymgkf eb a2dajugmvl2ivgwgddr  ienq0zwkhszdadgzeq")
const testPlainText  = decode("quidquid latine dictum sit altum videtur")
const testCipherText = decode("tg  sp0mdndf jgev gvp4iwkqrhhvp4irkaw2qp")

const ok = document.getElementById('ok') as HTMLButtonElement;
const input = document.getElementById('in') as HTMLInputElement;
const output = document.getElementById('out') as HTMLDivElement;

if (!ok || !input || !output) throw new Error('Missing elements')

setOutput('\n')

ok.addEventListener('click', onClick)
input.addEventListener('keydown', validateKeyInput)

function setOutput(text) {
  output.innerText = text
}

function onClick() {
  if (!input) throw new Error('Missing input element')
  const inputValue = parseInput(input.value)
  const isValidInput = validateKey(inputValue)

  if (!isValidInput) {
    return fail(`That's not a valid key.`)
  }

  const isWin = verifyAnswer(inputValue)

  if (isWin) {
    win(`You got it! Albert's secret phrase is "${decrypt(ciphertext, inputValue)}"`)
  } else {
    fail(`No, that's not the right key. With that key, the secret phrase would be "${decrypt(ciphertext, inputValue)}".`)
  }
}

function parseInput(value: string): number[] {
  const values = value.match(/.{1,5}/g)
  if (!values) return []
  return values.map(str => parseInt(str, 2))
}

function verifyAnswer(key) {
  return encrypt(testPlainText, key) === testCipherText
}

function win(text) {
  output.classList.remove(...output.classList.values())
  output.classList.add(...["bg-green pa2 br1 white"])
  setOutput(text)
}

function fail(text) {
  output.classList.remove(...output.classList.values())
  output.classList.add(...["bg-yellow pa2 br1 black-80"])
  setOutput(text)
}

function validateKeyInput(event: KeyboardEvent) {
  var AllowedKeys = ['0', '1', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Tab'];
  var EraseKeys = ['Delete', 'Backspace'];

  if (!AllowedKeys.includes(event.key)) {
    event.preventDefault();
  }
  
  const key = parseInput(input.value)

  if (validateKey(key) && !EraseKeys.includes(event.key)) {
    event.preventDefault();
  }
}
