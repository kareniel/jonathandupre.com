const KEY_LENGTH = 25
const LOWERCASE_A_CODE_POINT_OFFSET = 96
const NUMBER_0_CODE_POINT_OFFSET = 21

const defaultSeed = decode("0").map(n => n.toString(2)).join('').padStart(5, "0")
const ciphertext = "vsymgkf eb a2dajugmvl2ivgwgddr  ienq0zwkhszdadgzeq"
const testPlainText  = "quidquid latine dictum sit altum videtur"
const testCipherText = "tg  sp0mdndf jgev gvp4iwkqrhhvp4irkaw2qp"

const ok = document.getElementById('ok');
const input = document.getElementById('in');
const output = document.getElementById('out');

let seed = defaultSeed

setOutput('\n')

ok.addEventListener('click', onClick)
input.addEventListener('keydown', onKeyDown)

function onClick() {
  const isValidInput = validateInput(input.value)

  if (!isValidInput) {
    return fail(`That's not a valid key.`)
  }

  const key = encode(parseInput(input.value))
  const isWin = verifyAnswer(key)

  if (isWin) {
    win(`You got it! Albert's secret phrase is "${decrypt(ciphertext, key)}"`)
  } else {
    fail(`No, that's not the right key. With that key, the secret phrase would be "${decrypt(ciphertext, key)}".`)
  }
}

function validateInput(value) {
  return typeof value === 'string' && /^[01]{25}$/.test(value)
}

function parseInput(value) {
  return value.match(/.{1,5}/g).map(str => parseInt(str, 2))
}

function onKeyDown(event) {
  validateKeyInput(event)
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
  const binKey = decode(key)
  const binText = decode(plaintext)

  const result = binText.map((n, index) => {
    return n ^ binKey[index % 5]
  })

  return encode(result)
}

// Symmetric encryption
function decrypt(ciphertext, key) {
  return encrypt(ciphertext, key)
}

function verifyAnswer(key) {
  console.log('verify with key', key, encrypt(testPlainText, key), testCipherText)
  return encrypt(testPlainText, key) === testCipherText
}

function validateKeyInput(event) {
  var AllowedKeys = ['0', '1', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Tab'];
  var EraseKeys = ['Delete', 'Backspace'];

  if (!AllowedKeys.includes(event.key)) {
    event.preventDefault();
  }

  if (input.value.length >= KEY_LENGTH && !EraseKeys.includes(event.key)) {
    event.preventDefault();
  }
}

// Encode a list of numbers (0-31) into a Tobaud string
// number[] -> str
function encode(numbers) {
  var result = numbers.map(n => {
    if (n === 0) return " "
    if (n >= 0 && n <= 26) return String.fromCodePoint([n + LOWERCASE_A_CODE_POINT_OFFSET])
    if (n >= 27 && n <= 31) return String.fromCodePoint([n + NUMBER_0_CODE_POINT_OFFSET])
    throw new Error(`encode: Number '${n}' is out of bounds.`)
  }).join('')

  return result
}

// Decode a Tobaud encoded string
// str -> number[]
function decode(str) { 
  var result = str.split('').map(char => {
    if (char == " ") return 0
    if (/[a-z]/.test(char)) return char.codePointAt(0) - LOWERCASE_A_CODE_POINT_OFFSET
    if (/[0-4]/.test(char)) return char.codePointAt(0) - NUMBER_0_CODE_POINT_OFFSET
    throw new Error(`decode(): Character '${char}' is not allowed.`)
  })

  return result
}
