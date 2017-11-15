import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Util } from '../util/util';

@Directive({
  selector: '[oKeyboardListener]',
  host: {
    '(window:keyup)': 'keyUp($event)',
    '(window:keydown)': 'keyDown($event)'
  }
})
export class OKeyboardListenerDirective implements OnInit {

  @Input() keyboardKeys: string;
  @Output() onKeysPressed: EventEmitter<Object> = new EventEmitter<Object>();

  protected keyboardNumberKeysArray: Array<number> = [];
  protected activeKeys: Object = {};

  ngOnInit(): void {
    this.parseKeyboardKeys();
  }

  parseKeyboardKeys() {
    const keysAsStringArray = Util.parseArray(this.keyboardKeys);
    keysAsStringArray.forEach(key => {
      try {
        this.keyboardNumberKeysArray.push(parseInt(key));
      } catch (e) {
        console.log(e);
      }
    });
  }

  keyDown(e: KeyboardEvent) {
    const pressedCode = e.keyCode;
    if (this.keyboardNumberKeysArray.indexOf(pressedCode) !== -1) {
      this.activeKeys[pressedCode] = true;
      this.checkNeededKeys(e);
    }
  }

  keyUp(e: KeyboardEvent) {
    const pressedCode = e.keyCode;
    if (this.keyboardNumberKeysArray.indexOf(pressedCode) !== -1) {
      this.activeKeys[pressedCode] = false;
    }
  }

  checkNeededKeys(e: KeyboardEvent) {
    let trigger = true;
    this.keyboardNumberKeysArray.forEach(key => {
      trigger = trigger && this.activeKeys[key];
    });
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
     // this.activeKeys = {};
      this.onKeysPressed.emit();
    }
  }

}
