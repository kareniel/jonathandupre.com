/*


section .data
  result db

section .text
  global _start

_start:
  out #1
  halt



(ciphertext: array of bytes of arbitrary length, key: array of 5 bytes)

// loop through each byte of the key
// loop through each byte of cipher text, xoring each ciphertext byte with the current key byte




let out = a byte array with length of cipher text

append_out:

next_index:
  if index == 5
    return 0
  return index + 1

for each cipher_byte
  key_index = next_index()
  key_byte = key_bytes [key_index]
  plain = cipher_byte ^ key_byte
  append out with plain

return plaintext

1 2 3 4 5 // key
1 2 3 4 5 1 2 3 4 5 1 2 3 4 5 // ciphertext



features:
- parse
- resolve symbols
- encode instructions
- generate output




*/

// 1. remove all empty lines
// 2. remove all tabs and spaces at the beginning of lines
// 4. replace & and # with push and newline
// 6. replace . with load and newline
// 7. replace @ + rest of line with decoded tobaud
// 3. remove labels and store label index minus label index
// 4. replace labels with indices
// 5. replace mnemonics with opcodes

import { decode } from './encoding'

type Code = Array<string>

const opcodes = [
  'noop', 
  'save', 'load', 
  'push', 'pop', 'dup', 'swap', 'drop', 
  'and', 'not', 'or', 'xor', 'lsh', 'rsh', 
  'eq', 'grt', 'lsr', 
  'jump', 'ifte', 
  'add', 'sub', 'mul', 'div', 'mod', 
  'in', 'out',
  'halt'
]

export function assemble (code: Code) {
  const labels = {}
  return code
    .filter(line => line.length)
    .map(line => line.trimStart().trimEnd())
    .reduce(reducePush, [])
    .reduce(reduceLoad, [])
    .map(line => line.startsWith('@') ? String(decode(line.slice(1))[0]) : line)
    .map((line, lineIndex) => {
      if (line.endsWith(':')) {
        const labelName = line.slice(0, -1)
        const labelCount = Object.keys(labels).length
        const address = lineIndex - labelCount
        if (labels[labelName] !== undefined) throw new Error(`Label '${labelName}' is defined twice.`);
        labels[labelName] = address
      }
      return line
    })
    .filter(line => line.endsWith(':'))
    .map(line => Object.keys(labels).includes(line) ? labels[line] : line)
    .map(line => opcodes.includes(line) ? opcodes.indexOf(line) : line)
}

function reducePush(prev: Code, line: string) {
  if (line.startsWith('&') || line.startsWith('#')) {
    prev.push('push')
    prev.push(line.slice(1))
    return prev
  }
  prev.push(line)
  return prev
}

function reduceLoad(prev: Code, line: string) {
  if (line.startsWith('.')) {
    prev.push('load')
    prev.push(line.slice(1))
    return prev
  }
  prev.push(line)
  return prev
}
