---
title: Circuit builder
date: 2024-04-30
description: 
---

<div id="circuit-builder" class="f7">
  <table class="tl collapse ba br2 b--black-10 pv2 ph3 w-100">
    <tbody id="table_body">
      <tr id="table_header_row" class="striped--light-gray">
        <th class="pv2 ph2 tl fw6 ttu"></th>
        <th class="pv2 ph2 tl fw6 ttu">ID</th>
        <th class="pv2 ph2 tl fw6 ttu">Type</th>
        <th class="pv2 ph2 tl fw6 ttu">Output</th>
        <th class="pv2 ph2 tl fw6 ttu">Value</th>
      </tr>
      <tr id="table_row">
        <td class="cb-cell-remove pv2 ph2"><button>✖</button></td>
        <td class="cb-cell-id pv2 ph2">1</td>
        <td class="cb-cell-type pv2 ph2">Xor gate</td>
        <td class="cb-cell-output pv2 ph2">
          <select class="cb-cell-output-selector">
            <option value="">None</option>
          </select>
        </td>
        <td class="pv2 ph3"><pre>-</pre></td>
      </tr>
    </tbody>
  </table>
  
  <div class="flex w-100 ma1 pa1">
    <select id="block_selector" class="mv1 mr1">
      <option>-- Blocks --</option>
      <option value="memory_cell">Memory cell</option>
      <option value="xor_gate">Xor gate</option>
    </select>
    <button id="add_block_button" class="mv1 ml1">Add block</button>
  </div>

  <div class="flex w-100 ma1 pa1">
    <div class="mv1 mr1"><span>Clock</span></div>
    <div class="ma1"><input id="clock_output" type="text" value="0" size="3" class="pre w2 tr" disabled/></div>
    <div class="ma1"><button id="step_button">Step</button></div>
    <div class="mv1 ml1"><button id="reset_button">Reset</button></div>
  </div>
</div>
