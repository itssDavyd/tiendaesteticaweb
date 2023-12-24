var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://raw.githubusercontent.com/l-lin/angular-datatables/master/LICENSE
 */
import { Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
var DataTableDirective = /** @class */ (function () {
    function DataTableDirective(el, vcr, renderer) {
        this.el = el;
        this.vcr = vcr;
        this.renderer = renderer;
        /**
         * The DataTable option you pass to configure your table.
         */
        this.dtOptions = {};
    }
    DataTableDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.dtTrigger) {
            this.dtTrigger.subscribe(function (options) {
                _this.displayTable(options);
            });
        }
        else {
            this.displayTable(null);
        }
    };
    DataTableDirective.prototype.ngOnDestroy = function () {
        if (this.dtTrigger) {
            this.dtTrigger.unsubscribe();
        }
        if (this.dt) {
            this.dt.destroy(true);
        }
    };
    DataTableDirective.prototype.displayTable = function (dtOptions) {
        var _this = this;
        // assign new options if provided
        if (dtOptions) {
            this.dtOptions = dtOptions;
        }
        this.dtInstance = new Promise(function (resolve, reject) {
            Promise.resolve(_this.dtOptions).then(function (resolvedDTOptions) {
                // validate object
                var isTableEmpty = Object.keys(resolvedDTOptions).length === 0 && $('tbody tr', _this.el.nativeElement).length === 0;
                if (isTableEmpty) {
                    reject('Both the table and dtOptions cannot be empty');
                    return;
                }
                // Set a column unique
                if (resolvedDTOptions.columns) {
                    resolvedDTOptions.columns.forEach(function (col) {
                        var _a;
                        if (((_a = col.id) !== null && _a !== void 0 ? _a : '').trim() === '') {
                            col.id = _this.getColumnUniqueId();
                        }
                    });
                }
                // Using setTimeout as a "hack" to be "part" of NgZone
                setTimeout(function () {
                    // Assign DT properties here
                    var options = {
                        rowCallback: function (row, data, index) {
                            if (resolvedDTOptions.columns) {
                                var columns = resolvedDTOptions.columns;
                                _this.applyNgPipeTransform(row, columns);
                                _this.applyNgRefTemplate(row, columns, data);
                            }
                            // run user specified row callback if provided.
                            if (resolvedDTOptions.rowCallback) {
                                resolvedDTOptions.rowCallback(row, data, index);
                            }
                        }
                    };
                    // merge user's config with ours
                    options = Object.assign({}, resolvedDTOptions, options);
                    _this.dt = $(_this.el.nativeElement).DataTable(options);
                    resolve(_this.dt);
                });
            });
        });
    };
    DataTableDirective.prototype.applyNgPipeTransform = function (row, columns) {
        // Filter columns with pipe declared
        var colsWithPipe = columns.filter(function (x) { return x.ngPipeInstance && !x.ngTemplateRef; });
        colsWithPipe.forEach(function (el) {
            var pipe = el.ngPipeInstance;
            var pipeArgs = el.ngPipeArgs || [];
            // find index of column using `data` attr
            var i = columns.filter(function (c) { return c.visible !== false; }).findIndex(function (e) { return e.id === el.id; });
            // get <td> element which holds data using index
            var rowFromCol = row.childNodes.item(i);
            // Transform data with Pipe and PipeArgs
            var rowVal = $(rowFromCol).text();
            var rowValAfter = pipe.transform.apply(pipe, __spreadArray([rowVal], pipeArgs, false));
            // Apply transformed string to <td>
            $(rowFromCol).text(rowValAfter);
        });
    };
    DataTableDirective.prototype.applyNgRefTemplate = function (row, columns, data) {
        var _this = this;
        // Filter columns using `ngTemplateRef`
        var colsWithTemplate = columns.filter(function (x) { return x.ngTemplateRef && !x.ngPipeInstance; });
        colsWithTemplate.forEach(function (el) {
            var _a = el.ngTemplateRef, ref = _a.ref, context = _a.context;
            // get <td> element which holds data using index
            var i = columns.filter(function (c) { return c.visible !== false; }).findIndex(function (e) { return e.id === el.id; });
            var cellFromIndex = row.childNodes.item(i);
            // reset cell before applying transform
            $(cellFromIndex).html('');
            // render onto DOM
            // finalize context to be sent to user
            var _context = Object.assign({}, context, context === null || context === void 0 ? void 0 : context.userData, {
                adtData: data
            });
            var instance = _this.vcr.createEmbeddedView(ref, _context);
            _this.renderer.appendChild(cellFromIndex, instance.rootNodes[0]);
        });
    };
    DataTableDirective.prototype.getColumnUniqueId = function () {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 6; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result.trim();
    };
    DataTableDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: DataTableDirective, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    DataTableDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.2", type: DataTableDirective, selector: "[datatable]", inputs: { dtOptions: "dtOptions", dtTrigger: "dtTrigger" }, ngImport: i0 });
    return DataTableDirective;
}());
export { DataTableDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: DataTableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[datatable]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }]; }, propDecorators: { dtOptions: [{
                type: Input
            }], dtTrigger: [{
                type: Input
            }] } });
//# sourceMappingURL=angular-datatables.directive.js.map