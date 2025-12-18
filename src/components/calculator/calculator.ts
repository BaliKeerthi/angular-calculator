import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: false,
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {

  // Stores the current value shown on the calculator display
  display: string = '';

  // Stores the calculator memory value (M+, M-, MR, MC)
  memory: number = 0;

  // Used for button highlight animation
  activeKey: string = '';

  // -------------------------------------------------
  // CLEAR ENTRY (CE)
  // Clears only the current display value
  // -------------------------------------------------
  clearEntry() {
    this.display = '';
  }

  // -------------------------------------------------
  // MAIN BUTTON HANDLER
  // Handles numbers, operators, functions, and memory
  // -------------------------------------------------
  press(value: string) {

    // Highlight the pressed button
    this.highlight(value);

    // CLEAR ALL (C)
    if (value === 'C') {
      this.display = '';
      return;
    }

    // EQUAL (=) → evaluate the expression
    if (value === '=') {
      this.safeEval();
      return;
    }

    // SQUARE ROOT (√x)
    if (value === 'sqrt') {
      if (this.display !== '') {
        this.safeEval(); // evaluate expression first
        this.display = Math.sqrt(Number(this.display)).toString();
      }
      return;
    }

    // SQUARE (x²)
    if (value === 'square') {
      if (this.display !== '') {
        this.safeEval();
        this.display = (Number(this.display) ** 2).toString();
      }
      return;
    }

    // PERCENT (%)
    if (value === '%') {
      if (this.display !== '') {
        this.safeEval();
        this.display = (Number(this.display) / 100).toString();
      }
      return;
    }

    // -------------------------------------------------
    // MEMORY OPERATIONS
    // -------------------------------------------------

    // MEMORY ADD (M+)
    if (value === 'M+') {
      this.safeEval();
      this.memory += Number(this.display || 0);
      return;
    }

    // MEMORY SUBTRACT (M-)
    if (value === 'M-') {
      this.safeEval();
      this.memory -= Number(this.display || 0);
      return;
    }

    // MEMORY RECALL (MR)
    if (value === 'MR') {
      this.display = this.memory.toString();
      return;
    }

    // MEMORY CLEAR (MC)
    if (value === 'MC') {
      this.memory = 0;
      return;
    }

    // -------------------------------------------------
    // NORMAL INPUT (numbers and operators)
    // -------------------------------------------------
    if (this.display === '0') {
      this.display = value;
    } else {
      this.display += value;
    }
  }

  // -------------------------------------------------
  // OPERATOR HANDLER
  // Used mainly for division button (÷)
  // -------------------------------------------------
  pressOperator(op: string) {
    this.display += op;
  }

  // -------------------------------------------------
  // RECIPROCAL FUNCTION (1/x)
  // -------------------------------------------------
  reciprocal() {
    if (this.display !== '') {
      this.safeEval();
      const num = Number(this.display);

      // Prevent division by zero
      if (num !== 0) {
        this.display = (1 / num).toString();
      } else {
        this.display = 'Error';
      }
    }
  }

  // -------------------------------------------------
  // BACKSPACE FUNCTION (⌫)
  // Removes the last character from display
  // -------------------------------------------------
  backspace() {
    this.display = this.display.slice(0, -1);
  }

  // -------------------------------------------------
  // SAFE EVALUATION
  // Evaluates mathematical expressions safely
  // -------------------------------------------------
  safeEval() {
  try {
    // Use Function constructor instead of eval (esbuild-safe)
    this.display = Function('"use strict"; return (' + this.display + ')')().toString();
  } catch {
    this.display = 'Error';
  }
}

  // -------------------------------------------------
  // KEYBOARD SUPPORT
  // Listens to keyboard input globally
  // -------------------------------------------------
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {

    const key = event.key;

    // Highlight pressed key
    this.highlight(key);

    // Numbers, operators, dot, brackets
    if (/[0-9+\-*/.()]/.test(key)) {
      if (this.display === '0') {
        this.display = key;
      } else {
        this.display += key;
      }
    }

    // ENTER → evaluate
    else if (key === 'Enter') {
      this.safeEval();
    }

    // BACKSPACE → remove last character
    else if (key === 'Backspace') {
      this.backspace();
    }

    // DELETE → clear display
    else if (key === 'Delete') {
      this.display = '';
    }

    // C or c → clear display
    else if (key.toLowerCase() === 'c') {
      this.display = '';
    }
  }

  // -------------------------------------------------
  // BUTTON HIGHLIGHT EFFECT
  // -------------------------------------------------
  highlight(key: string) {
    this.activeKey = key;
    setTimeout(() => this.activeKey = '', 120);
  }
}
