import { MbscControlBase, EventEmitter, ElementRef, NgZone, NgControl, MbscInputService } from './frameworks/angular';
import './presets/timespan';
export declare class MbscTimespan extends MbscControlBase {
    value: number;
    onChangeEmitter: EventEmitter<number>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService);
    setNewValue(v: number): void;
    ngAfterViewInit(): void;
}
