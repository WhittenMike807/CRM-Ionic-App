import { MbscControlBase, ElementRef, NgZone, NgControl, EventEmitter, OnInit, MbscInputService } from './frameworks/angular';
import './presets/calendar';
export declare class MbscCalendar extends MbscControlBase implements OnInit {
    private isMulti;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService);
    setNewValue(v: any): void;
    ngAfterViewInit(): void;
    ngOnInit(): void;
}
