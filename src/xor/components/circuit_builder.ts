const ElementId = [
  'table_header_row',
  'table_body',
  'table_row',
  'block_selector', 
  'add_block_button',
  'clock_output', 
  'step_button', 
  'reset_button'
] as const

type Elements = Record<typeof ElementId[number], HTMLElement>

const BlockType = ['memory_cell', 'xor_gate'] as const

interface Block {
  id: number
  type: typeof BlockType[number]
  output: number | null
  value: 0 | 1 | null
  el: HTMLElement
}

class Block {
  id: number
  type: typeof BlockType[number]
  output: number | null = null
  value: 0 | 1 | null = null
  el: HTMLElement
  innerElements: Record<string, HTMLElement> = {}

  constructor (id: number, type: typeof BlockType[number], modelEl: HTMLElement) {
    this.id = id
    this.type = type
    this.el = modelEl.cloneNode(true) as HTMLElement
    
    this.el.id = `${this.el.id}-${this.id}`

    const classNames = ['cb-cell-remove', 'cb-cell-id', 'cb-cell-type', 'cb-cell-output-selector']

    classNames.forEach((className) => {
      const innerEl = this.el.querySelectorAll(`.${className}`)[0] as HTMLElement
      if (!innerEl) throw new Error('Block(): Missing child element: ' + className)
      console.log(innerEl)
      this.innerElements[className] = innerEl
    })

    this.update()
  }

  update () {
    this.innerElements['cb-cell-id'].innerText = String(this.id)
    this.innerElements['cb-cell-type'].innerText = this.type as string

    const outputSelector = this.innerElements['cb-cell-output-selector'] as HTMLSelectElement
  }

  onAdd(blocks: Set<Block>) {
    const select = (this.innerElements['cb-cell-output-selector'] as HTMLSelectElement)

    Array.from(select.options).forEach(() => select.options.remove(0))

    var noneOpt = document.createElement("option");
    noneOpt.text = String("None");
    noneOpt.value = String("");

    select.options.add(noneOpt);

    blocks.forEach(block => {
      var opt = document.createElement("option");
      opt.text = String(block.id);
      opt.value = String(block.id);

      select.options.add(opt);
    })
  }

  onRemove(callback: Function) {
    const el = this.innerElements['cb-cell-remove'];

    el.addEventListener('click', function listener (e) {
      el.removeEventListener('click', listener);
      callback(); 
    })
  }
}

class CircuitBuilder {
  elements: Elements = {} as Elements
  blocks: Set<Block> = new Set()
  cycle = 0
  ids = 0
  rowEl: HTMLTableRowElement

  constructor () {
    console.log('constructing')

    ElementId.forEach(id => {
      const el = document.getElementById(id)
      if (!el) throw new Error(`Missing element '${id}`)
      this.elements[id] = el
    })

    this.elements.step_button.addEventListener('click', this.step.bind(this))
    this.elements.reset_button.addEventListener('click', this.reset.bind(this))
    this.elements.add_block_button.addEventListener('click', this.addBlock.bind(this))

    this.elements.table_row.remove()
  }

  addBlock () {
    const block = new Block(this.ids++, "memory_cell", this.elements.table_row)

    block.onRemove(() => this.removeBlock(block))

    this.blocks.add(block)
    this.elements.table_body.appendChild(block.el)

    console.log('adding block', block)

    this.update()
  }

  removeBlock(block: Block) {
    this.blocks.delete(block)
    block.el.remove()
  }

  step () {
    this.cycle += 1;
    this.update()
  }

  reset () {
    this.cycle = 0;
    this.update()
  }

  update() {
    (this.elements.clock_output as HTMLInputElement).value = String(this.cycle)
    this.blocks.forEach(block => block.onAdd(this.blocks))
  }
}

let circuitBuilder

document.addEventListener('DOMContentLoaded', () => {
  circuitBuilder = new CircuitBuilder()
})
