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
  const types = [constantType, refType, derefType, operationType]

  const operations = ['nop', 'hlt', 'jmp']

  document.addEventListener('alpine:init', () => {
    Alpine.data('editor', () => ({
      types,
      operations,
      labels: ['_start'],
      tick: 0,
      code: [
        {
          "type": constantType,
          "value": "0"
        },
        {
          "type": constantType,
          "value": "1"
        },
        {
          "type": constantType,
          "value": "2"
        },
        {
          "type": constantType,
          "value": "3"
        }
      ],
      add(type) {
        this.code.push({ type, value: 0 })
      },
      renderLabel(index) {
        const label = this.labels[index] 
        return  label ? label + ':' : ''
      },
      step() {
        this.tick++
      },
      reset() {
        this.tick = 0
      },
      remove(index) {
        this.code.splice(index, 1)
      }
    }));
  })
</script>

<div id="code-editor" x-data="editor">
  <div class="flex flex-row">
    <div>
      <table>
        <thead>
          <tr>
            <td class="w3">label</td>
            <td class="w3">value</td>
            <td class="w3"></td>
          </tr>
        </thead>
        <tbody>
          <template x-for="(line, index) in code">
            <tr :class="index === tick ? 'bg-black white' : ''">
              <td x-text="renderLabel(index)"></td>
              <td class="w3">
                <!--  -->
                <template x-if="line.type.name === 'constant'">
                  <input type="number" x-model="line.value" size="2" max-length="2" class="w3" min="0" max="31"></input>
                </template>
                <!--  -->
                <template x-if="['ref', 'deref'].includes(line.type.name)">
                  <select>
                    <template x-for="label in labels">
                      <option x-text="label"></option>
                    </template>
                  </select>
                </template>
                <!--  -->
                <template x-if="line.type.name === 'operation'">
                  <select>
                    <template x-for="op in operations">
                      <option x-text="op"></option>
                    </template>
                  </select>
                </template>
              </td>
              <td><button @click="remove(index)">x</button></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div>
      <ul class="list mv0">
        <template x-for="type in types">
          <li><button x-text="`${type.icon} ${type.name}`" @click="add(type)"></button></li>
        </template>
      </ul>
    </div>
  </div>
  <div class="flex flex-row">
    <div><button @click="step()">step</button><button @click="reset()">reset</button>tick: <span x-text="tick"></span></div>
  </div>
  <div class="flex flex-row">
    <code><pre x-text="JSON.stringify($data, null, 2)"></pre></code>
  </div>
</div>
