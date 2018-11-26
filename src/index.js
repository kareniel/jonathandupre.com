import 'babel-polyfill'

import { Terminal } from 'xterm'
import ansiEscapes from 'ansi-escapes'

class Shell {
  constructor () {
    this._eventListenerOptions = { once: true }

    this.line = ''
    this.index = 0

    this.term = new Terminal()

    this.el = document.getElementById('terminal')
    this.term.open(this.el)
    this.term.attachCustomKeyEventHandler(this.handleEvents.bind(this))
    this.term.setOption('cursorBlink', true)

    this.drawCursor()
    this.el.focus()
  }

  handleEvents (e) {
    e.stopPropagation()
    e.preventDefault()

    if (e.key === 'Backspace') {
      return this.handleBackspace(e)
    }

    if (e.key.indexOf('Arrow') > -1) {
      return this.handleArrows(e)
    }

    if (e.key === 'Enter') {
      return this.handleCR(e)
    }

    if (this.isValidInput(e.key)) {
      return this.handleKey(e)
    }
  }

  isValidInput (key) {
    return key.length === 1 && key.charCodeAt(0) < 128
  }

  handleArrows (e) {
    switch (e.key) {
      case 'ArrowLeft':
        if (this.index === 0) break
        this.term.write(ansiEscapes.cursorBackward(1))
        this.index--
        break

      case 'ArrowRight':
        console.log(this.index, this.line.length, this.line)
        if (this.index >= this.line.length) break
        this.term.write(ansiEscapes.cursorForward(1))
        this.index++
        break
      default:
        break
    }
    console.log(this.index)
  }

  handleBackspace () {
    if (!this.line) return

    this.index--
    this.line = this.line.slice(0, -1)
    this.term.write(ansiEscapes.eraseLine + ansiEscapes.cursorLeft)
    this.drawCursor()
    this.term.write(this.line)
  }

  handleKey (e) {
    this.line += e.key
    this.term.write(e.key)
    this.index++
  }

  handleCR (e) {
    this.exec(this.line.split(' '))
  }

  exec (args = []) {
    var command = args[0]
    var params = args.slice(1)

    if (command === 'clear') return this.clear()

    this.term.write('\n' + ansiEscapes.cursorLeft)

    switch (command) {
      case 'whoami':
        this.term.write('guest')
        break

      case 'ls':
        this.term.write('wip.txt')
        break

      case 'cat':
        this.cat(params)
        break

      default:
        this.term.write(this.line + ': command not found')
        break
    }

    this.line = ''
    this.index = 0
    this.term.write('\n' + ansiEscapes.cursorLeft)
    this.drawCursor()
  }

  cat (params) {
    var file = params[0]

    switch (file) {
      case 'wip.txt':
        this.term.write('thanks for checking this out :)')
        break
      default:
        this.term.write('cat: ' + file + ': No such file or directory')
    }
  }

  clear () {
    this.term.clear()
    this.term.write(ansiEscapes.eraseLine + ansiEscapes.cursorLeft)
    this.index = 0
    this.line = ''
    this.drawCursor()
  }

  drawCursor () {
    this.term.write('$ ')
  }
}

var shell = new Shell()
