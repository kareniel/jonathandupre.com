---
title: Code editor
date: 2024-05-12
description: 
---
<script>
  const constantType = { name: 'constant', icon: '#' }
  const refType = { name: 'ref', icon: '&' }
  const derefType = { name: 'deref', icon: '.' }
  const operationType = { name: 'operation', icon: '>' }
  const types = [operationType, constantType, refType, derefType]
  const operations = ['nop', 'hlt', 'jmp', 'dup', 'out']

  document.addEventListener('alpine:init', () => {
    Alpine.data('editor', () => ({
      types,
      operations,
      output: [],
      tick: 0,
      code: [
        {
          "type": '#',
          "value": "0",
          "label": "start"
        },
        {
          "type": '>',
          "value": "out",
          "label": "loop"
        },
        {
          "type": '#',
          "value": "1",
        },
        {
          "type": '>',
          "value": "add"
        },
        {
          "type": '&',
          "value": "start"
        },
        {
          "type": '>',
          "value": "jmp"
        }
      ],
      step() {
        this.tick++
      },
      reset() {
        this.tick = 0
      },
      add(type) {
        const line = { type: type.icon, value: 0 }
        if (type.icon === '&') line.value = 'start'
        if (type.icon === '.') line.value = 'start'
        if (type.icon === '>') line.value = 'nop'
        this.code.push(line)
      },
      remove(line) {
        const index = this.code.findIndex(l => l === line)
        this.code.splice(index, 1)
      },
      up(line) {
        const index = this.code.findIndex(l => l === line)
        if (index === 0) return
        var top = this.code[index - 1]
        this.code[index - 1] = this.code[index]
        this.code[index] = top
      },
      down(line) {
        const index = this.code.findIndex(l => l === line)
        if (index >= this.code.length - 1) return
        var bottom = this.code[index + 1]
        this.code[index + 1] = this.code[index]
        this.code[index] = bottom
      },
      changeType (line, type) {
        line.type = type.icon
        if (type.icon === '&') line.value = 'start'
        if (type.icon === '.') line.value = 'start'
        if (type.icon === '>') line.value = 'nop'
        if (type.icon === '#') line.value = 0
      }
    }));
  })
</script>

<div id="code-editor" x-data="editor" class="code">
  <div class="flex flex-row ba">
    <div class="ba">
      <table class="w-100">
        <thead>
          <tr>
            <td class="w2"></td>
            <td class="w4">label</td>
            <td class=""> </td>
            <td class="w3">value</td>
            <td class=""></td>
          </tr>
        </thead>
        <tbody>
          <template x-for="(line, index) in code">
            <tr :class="index === tick ? 'bg-black white' : ''">
              <td class="w2 tr ph1"><pre x-text="index" class="mv0 pv0"></pre></td>
              <td class="w4"><input class="w4 b--none tr" type="text" x-model.lazy.fill="line.label"/></td>
              <td class="">
                <div x-data="{ open: false }" class="">
                  <button
                    class="btn btn-primary f7"
                    @click="open = !open"
                    :aria-expanded="open ? 'true' : 'false'"
                    x-text="`${line.type} ▼`"
                  >
                  </button>
                  <div
                    class="absolute bg-white ba"
                    x-show="open"
                    @click.away="open = false"
                  >
                    <ul class="list pl0 ba f7">
                      <template x-for="type in types">
                        <li class=""><button @click="changeType(line, type); open = false" x-text="type.icon"></button></li>
                      </template>
                    </ul>
                  </div>
                </div>
              </td>
              <td class="w3">
                <!-- CONSTANT -->
                <template x-if="line.type === '#'">
                  <input type="number" x-model.lazy.fill="line.value" size="2" max-length="2" class="w3" min="0" max="31"/>
                </template>
                <!-- REF OR DEREF  -->
                <template x-if="['&', '.'].includes(line.type)">
                  <div x-data="{ open: false }" class="mb-3">
                    <button
                      class="btn btn-primary f7"
                      @click="open = !open"
                      :aria-expanded="open ? 'true' : 'false'"
                      x-text="`${line.value} ▼`"
                    >
                    </button>
                    <div
                      class="absolute bs b-thin rounded-sm p-block bg-color-background"
                      x-show="open"
                      @click.away="open = false"
                    >
                      <ul class="list">
                        <template x-for="label in code.map(line => line.label).filter(x => x)">
                          <li><button @click="line.value = label; open = false" x-text="label"></button></li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </template>
                <!-- OPERATION -->
                <template x-if="line.type === '>'">
                  <div x-data="{ open: false }" class="mb-3">
                    <button
                      class="btn btn-primary f7"
                      @click="open = !open"
                      :aria-expanded="open ? 'true' : 'false'"
                      x-text="`${line.value} ▼`"
                    >
                    </button>
                    <div
                      class="absolute bs b-thin rounded-sm p-block bg-color-background"
                      x-show="open"
                      @click.away="open = false"
                    >
                      <ul class="list">
                        <template x-for="op in operations">
                          <li><button @click="line.value = op; open = false" x-text="op"></button></li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </template>
              </td>
              <td class="f7 flex flex-row">
                <div class="">
                  <button @click="down(line)" class="mh0">↓</button><button @click="up(line)" class="mh0">↑</button>
                </div>
                <button @click="remove(line)">x</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="ba">
      <ul class="list mv0 ph0">
        <template x-for="type in types">
          <li><button class="w4 tl" x-text="`${type.icon} ${type.name}`" @click="add(type)"></button></li>
        </template>
      </ul>
    </div>
  </div>
  <div class="flex flex-row">
    <div><button @click="step()">step</button><button @click="reset()">reset</button>tick: <span x-text="tick"></span></div>
  </div>
  <div class="flex flex-row">
    <p>output:</p><code class="f7"><pre x-text="output.join(' ')"></pre></code>
  </div>
  <div class="flex flex-row">
    <code class="f7"><pre x-text="JSON.stringify($data, null, 2)"></pre></code>
  </div>
</div>
