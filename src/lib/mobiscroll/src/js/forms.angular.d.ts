import { MbscBase, MbscControlBase, NgZone, ControlValueAccessor, NgControl, ElementRef, EventEmitter, QueryList, OnInit, Observable, MbscInputService } from './frameworks/angular';
export declare class MbscFormService {
    private _options;
    options: any;
}
export declare class MbscForm extends MbscBase implements OnInit {
    private _formService;
    options: any;
    rootElem: ElementRef;
    constructor(initialElem: ElementRef, _formService: MbscFormService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscFormBase extends MbscBase implements OnInit {
    protected _formService: MbscFormService;
    protected _inheritedOptions: any;
    options: any;
    disabled: boolean;
    name: string;
    _initElem: ElementRef;
    constructor(hostElem: ElementRef, _formService: MbscFormService);
    ngOnInit(): void;
}
export declare class MbscFormValueBase extends MbscFormBase implements ControlValueAccessor {
    protected _control: NgControl;
    protected _noOverride: boolean;
    protected _value: any;
    innerValue: any;
    protected onChange: any;
    protected onTouch: any;
    value: any;
    error: boolean;
    errorMessage: string;
    valueChangeEmitter: EventEmitter<string>;
    constructor(hostElem: ElementRef, _formService: MbscFormService, _control: NgControl, _noOverride: boolean);
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    writeValue(v: any): void;
}
export declare class MbscInputBase extends MbscFormValueBase {
    icon: string;
    iconAlign: string;
    type: string;
    passwordToggle: boolean;
    iconShow: string;
    iconHide: string;
    placeholder: string;
    constructor(initialElem: ElementRef, _formService: MbscFormService, _control: NgControl, noOverride: boolean);
}
export declare class MbscInput extends MbscInputBase {
    protected _inputService: MbscInputService;
    constructor(initialElem: ElementRef, _formService: MbscFormService, _inputService: MbscInputService, _control: NgControl);
    ngAfterViewInit(): void;
}
export declare class MbscTextarea extends MbscInputBase {
    protected _inputService: MbscInputService;
    constructor(initialElem: ElementRef, _formService: MbscFormService, _inputService: MbscInputService, _control: NgControl);
    ngAfterViewInit(): void;
}
export declare class MbscDropdown extends MbscFormValueBase {
    protected _inputService: MbscInputService;
    label: string;
    icon: string;
    iconAlign: string;
    constructor(hostElem: ElementRef, formService: MbscFormService, _inputService: MbscInputService, control: NgControl);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    writeValue(v: any): void;
}
export declare class MbscButton extends MbscFormBase {
    _flat: boolean;
    _block: boolean;
    type: string;
    icon: string;
    flat: any;
    block: any;
    constructor(hostElem: ElementRef, formService: MbscFormService);
    ngAfterViewInit(): void;
}
export declare class MbscCheckbox extends MbscFormValueBase {
    constructor(hostElem: ElementRef, formService: MbscFormService, control: NgControl);
    ngAfterViewInit(): void;
}
export declare class MbscSwitch extends MbscControlBase implements OnInit {
    protected _formService: MbscFormService;
    protected _inheritedOptions: any;
    disabled: boolean;
    name: string;
    value: boolean;
    onChangeEmitter: EventEmitter<boolean>;
    _initElem: ElementRef;
    constructor(hostElem: ElementRef, zone: NgZone, _formService: MbscFormService, control: NgControl);
    setNewValue(v: boolean): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscStepper extends MbscControlBase implements OnInit {
    protected _formService: MbscFormService;
    protected _inheritedOptions: any;
    value: number;
    name: string;
    min: number;
    max: number;
    step: number;
    val: string;
    disabled: boolean;
    onChangeEmitter: EventEmitter<number>;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscFormService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscProgress extends MbscControlBase implements OnInit {
    protected _formService: MbscFormService;
    protected _inheritedOptions: any;
    value: number;
    max: number;
    icon: string;
    iconAlign: string;
    val: string;
    disabled: boolean;
    stepLabels: Array<number>;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscFormService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscRadioService {
    private _name;
    name: string;
    private _multiSelect;
    multiSelect: boolean;
    private _valueSubject;
    onValueChanged(): Observable<any>;
    changeValue(v: any): void;
}
export declare class MbscRadioGroupBase extends MbscFormValueBase {
    protected _radioService: MbscRadioService;
    name: string;
    constructor(hostElement: ElementRef, formService: MbscFormService, _radioService: MbscRadioService, control: NgControl);
    ngOnInit(): void;
    writeValue(v: any): void;
}
export declare class MbscRadioGroup extends MbscRadioGroupBase {
    constructor(hostElement: ElementRef, formService: MbscFormService, radioService: MbscRadioService, control: NgControl);
}
export declare class MbscRadio extends MbscFormBase {
    private _radioService;
    readonly checked: boolean;
    name: string;
    modelValue: any;
    value: any;
    clicked(e: any): void;
    constructor(hostElement: ElementRef, formService: MbscFormService, _radioService: MbscRadioService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
}
export declare class MbscSegmentedGroup extends MbscRadioGroupBase {
    select: string;
    readonly multiSelect: boolean;
    constructor(hostElement: ElementRef, formService: MbscFormService, radioService: MbscRadioService, control: NgControl);
    ngOnInit(): void;
}
export declare class MbscSegmented extends MbscFormBase {
    private _radioService;
    readonly checked: boolean;
    name: string;
    modelValue: any;
    multiSelect: boolean;
    icon: string;
    value: any;
    valueChange: EventEmitter<any>;
    clicked(e: any): void;
    constructor(hostElement: ElementRef, formService: MbscFormService, _radioService: MbscRadioService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
}
export declare class MbscSlider extends MbscControlBase {
    private _formService;
    private _lastValue;
    private _dummy;
    readonly isMulti: boolean;
    readonly dummyArray: Array<number>;
    protected _inheritedOptions: any;
    protected _needsTimeout: boolean;
    tooltip: boolean;
    highlight: boolean;
    live: boolean;
    valueTemplate: string;
    icon: string;
    val: string;
    max: number;
    min: number;
    step: number;
    disabled: boolean;
    stepLabels: Array<number>;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    inputElements: QueryList<ElementRef>;
    constructor(hostElement: ElementRef, _formService: MbscFormService, zone: NgZone, control: NgControl);
    reInitialize(): void;
    setNewValue(v: any): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
