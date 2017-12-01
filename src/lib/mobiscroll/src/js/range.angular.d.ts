import { MbscControlBase, ElementRef, NgZone, NgControl, EventEmitter, MbscInputService } from './frameworks/angular';
import './presets/range';
export declare class MbscRange extends MbscControlBase {
    value: Array<Date>;
    onChangeEmitter: EventEmitter<Array<Date>>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService);
    setNewValue(v: Array<Date>): void;
    ngAfterViewInit(): void;
}
