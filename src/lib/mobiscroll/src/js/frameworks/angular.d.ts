import mobiscroll from '../core/dom';
import { $, extend } from '../core/core';
import { Directive, Component, Input, Output, EventEmitter, Optional, AfterViewInit, OnDestroy, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, ViewChildren, NgZone, NgModule, Injectable, ContentChildren, QueryList } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { NgControl, ControlValueAccessor, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { MbscFormValueBase } from '../forms.angular';
export declare class MbscInputService {
    private _controlSet;
    isControlSet: boolean;
    private _componentRef;
    input: MbscFormValueBase;
}
declare class MbscBase implements AfterViewInit, OnDestroy {
    protected initialElem: ElementRef;
    options: any;
    protected _instance: any;
    protected element: any;
    readonly instance: any;
    protected setElement(): void;
    constructor(initialElem: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
declare abstract class MbscValueBase extends MbscBase {
    protected zone: NgZone;
    abstract setNewValue(v: any): void;
    constructor(initialElem: ElementRef, zone: NgZone);
    protected initialValue: any;
    protected setNewValueProxy(v: any): void;
}
declare abstract class MbscControlBase extends MbscValueBase implements ControlValueAccessor {
    protected control: NgControl;
    protected _inputService: MbscInputService;
    readonly optionExtensions: any;
    protected _needsTimeout: boolean;
    protected onChange: any;
    protected onTouch: any;
    onChangeEmitter: EventEmitter<any>;
    protected handleChange(element?: any): void;
    protected oldAccessor: any;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, _inputService: MbscInputService);
    overwriteAccessor(): void;
    ngAfterViewInit(): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    writeValue(v: any): void;
}
declare abstract class MbscDataControlBase extends MbscControlBase implements OnInit {
    protected isMulti: boolean;
    private previousData;
    noDataCheck: boolean;
    data: Array<any>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService);
    setNewValue(v: any): void;
    cloneData(): void;
    ngOnInit(): void;
    abstract refreshData(newData: any): void;
    ngDoCheck(): void;
}
declare function deepEqualsArray(a1: Array<any>, a2: Array<any>): boolean;
export { $, extend, mobiscroll, MbscBase, MbscValueBase, MbscControlBase, MbscDataControlBase, deepEqualsArray, Directive, Component, Input, Output, EventEmitter, Optional, AfterViewInit, OnDestroy, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, ViewChildren, ContentChildren, QueryList, NgZone, NgControl, ControlValueAccessor, FormsModule, NgModule, CommonModule, Injectable, Observable, Subject, trigger, state, animate, transition, style };
