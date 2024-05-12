import { Memory } from './memory'

const PAGE_SIZE = 32
const NO_OF_PAGES = 32
const MEMORY_SIZE = NO_OF_PAGES * PAGE_SIZE

// todo: 
// handle integer overflow
// handle trying to store values larger than 32
// handle stack errors

export class Machine {
  private memory = new Memory(MEMORY_SIZE)
  private ip = 0
  private sp = 0

  loadProgram(data: Array<number>) {
    data.forEach((n, i) => {
      const result = this.memory.write(i, n)
      if (!result) throw new Error(`Could not load data '${n}' at index '${i}'`)
    })
  }

  stackPop(): number {
    const value = this.memory.read(this.sp)
    this.memory.write(this.sp, 0)
    this.sp++
    return value
  }

  stackPush(value: number) {
    this.sp--
    this.memory.write(this.sp, value)
  }

  stackPeek(): number {
    return this.memory.read(this.sp)
  }

  fetch(): number {
    const opCode = this.memory.read(this.ip)

    this.ip++

    return opCode
  }

  exec() {
    switch (this.fetch()) {
      case 0:
        break
      case 1:
        this.save()
        break
      case 2:
        this.load()
        break
      case 3:
        this.push()
        break
      case 4:
        this.pop()
        break
      case 5:
        this.dup()
        break
      case 6:
        this.swap()
        break
      case 7:
        this.drop()
        break
      case 8:
        this.and()
        break
      case 9:
        this.not()
        break
      case 10:
        this.or()
        break
      case 11:
        this.xor()
        break
      case 12:
        this.lsh()
        break
      case 13:
        this.rsh()
        break
      case 14:
        this.eq()
        break
      case 15:
        this.grt()
        break
      case 16:
        this.lsr()
        break
      case 17:
        this.jump()
        break
      case 18:
        this.ifte()
        break
      case 19:
        this.add()
        break
      case 20:
        this.sub()
        break
      case 21:
        this.mul()
        break
      case 22:
        this.div()
        break
      case 23:
        this.mod()
        break
      default:
        throw new Error('Unknown op code.')
    }
  }

  save() {
    const data = this.stackPop()
    const destination = this.stackPop()
    this.memory.write(destination, data)
  }

  load() {
    const source = this.stackPop()
    const data = this.memory.read(source)
    this.stackPush(data)
  }

  push() {
    this.stackPush(this.fetch())
  }

  pop() {
    this.stackPop()
  }

  dup() {
    this.stackPush(this.stackPeek())
  }

  swap() {
    const b = this.stackPop()
    const a = this.stackPop()

    this.stackPush(b)
    this.stackPush(a)
  }

  drop() {
    this.stackPop()
  }

  and() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a & b)
  }

  not() {
    const x = this.stackPop()
    this.stackPush(~x)
  }

  or() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a | b)
  }

  xor() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a ^ b)
  }

  lsh() {
    const x = this.stackPop()
    this.stackPush(x << 1)
  }

  rsh() {
    const x = this.stackPop()
    this.stackPush(x >>> 1)
  }

  eq() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a == b ? 1 : 0)
  }

  grt() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a > b ? 1 : 0)
  }

  lsr() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a < b ? 1 : 0)
  }

  jump() {
    const destinationAddress = this.stackPop()
    this.ip = destinationAddress
  }

  ifte() {
    const c = this.stackPop()
    const b = this.stackPop()
    const a = this.stackPop()

    const destinationAddress = a !== 0 ? b : c

    this.stackPush(destinationAddress)
    this.jump()
  }

  add() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a + b)
  }

  sub() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a - b)
  }

  mul() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a * b)
  }

  div() {
    const b = this.stackPop()
    const a = this.stackPop()
    const result = a / b
    if (result == Infinity) {
      this.stackPush(0)
    } else {
      this.stackPush(result)
    }
  }

  mod() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a % b)
  }
}
