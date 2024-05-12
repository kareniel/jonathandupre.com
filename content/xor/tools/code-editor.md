---
title: Code editor
date: 2024-05-12
description: 
---

<div id="code-editor" class="" x-data="{ 
  code: ['&index', '#1', 'grt'], 
  labels: { _start: 0 },
  get getLabel () { return 'hellooooo' }
}">
  <table>
    <tbody>
      <template x-for="line in code">
        <tr>
          <td v-text="getLabel"></td>
          <td x-text="line"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
