import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { Util } from '../util/util';

@Directive({
  selector: '[oKeyboardListener]'
})
export class OKeyboardListenerDirective implements OnInit {

  @Input() keyboardKeys: string;
  @Output() onKeysPressed: EventEmitter<object> = new EventEmitter<object>();

  protected keyboardNumberKeysArray: Array<number> = [];
  protected activeKeys: object = {};

  @HostListener('keydown', ['$event'])
  keyDown(e: KeyboardEvent) {
    const pressedCode = e.keyCode;
    if (this.keyboardNumberKeysArray.indexOf(pressedCode) !== -1) {
      this.activeKeys[pressedCode] = true;
      this.checkNeededKeys(e);
    }
  }

  @HostListener('keyup', ['$event'])
  keyUp(e: KeyboardEvent) {
    const pressedCode = e.keyCode;
    if (this.keyboardNumberKeysArray.indexOf(pressedCode) !== -1) {
      this.activeKeys[pressedCode] = false;
    }
  }

  ngOnInit(): void {
    this.parseKeyboardKeys();
  }

  parseKeyboardKeys() {
    const keysAsStringArray = Util.parseArray(this.keyboardKeys);
    keysAsStringArray.forEach(key => {
      try {
        this.keyboardNumberKeysArray.push(parseInt(key, 10));
      } catch (e) {
        console.error(e);
      }
    });
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
