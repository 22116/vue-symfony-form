(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('form-serialize'), require('lodash')) :
    typeof define === 'function' && define.amd ? define(['exports', 'axios', 'form-serialize', 'lodash'], factory) :
    (factory((global.symfonyForm = {}),global.axios,global.serialize,global._));
}(this, (function (exports,axios,serialize,_) { 'use strict';

    axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
    serialize = serialize && serialize.hasOwnProperty('default') ? serialize['default'] : serialize;
    _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

    function connector(route, method, data, isSecure) {
        return axios.request({
            url: route,
            method: method,
            data: data
        });
    }

    (function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=""; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();

    var form = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('form',{ref:"form",on:{"submit":function($event){$event.preventDefault();return _vm.onSubmit($event)}}},[(_vm.showInvalid)?_c('div',{staticClass:"alert alert-danger"},[_vm._v("Whoops! Seems you've entered invalid data.")]):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
      name: "symfony-form",
      props: {
        action: { type: String, required: true },
        method: { type: String, default: 'GET' },
        dataPrefix: String,
        isSecure: Boolean
      },
      data: function data() {
        return {
          showInvalid: false
        };
      },
      methods: {
        onSubmit: function() {
          var that = this;
          var data = serialize(this.$refs.form, { hash: true });

          this.$emit("beforeSubmit", data);

          connector(this.action, this.method, data, this.isSecure)
            .then(function(req) {
              that.clearErrors();

              that.$emit("onSuccess", req);
            })
            .catch(function(error) {
              that.$emit("onFail");

              var res = error.response;
              if (res.status === 400) {
                if (res.data.hasOwnProperty("errors")) {
                  that.showErrors(res.data.errors);
                  that.showInvalid = false;
                } else {
                  that.showInvalid = true;
                }
              }
            });

          this.$emit("onSubmit");
        },
        showErrors: function(errors) {
          var this$1 = this;

          this.clearErrors();

          var prefix = this.dataPrefix === undefined ? "" : this.dataPrefix;
          this.fetchErrors(errors, prefix).forEach(function (value) {
            var el = this$1.$refs.form.querySelector("[name='" + value[0] + "']");
            var error = document.createElement("div");
            error.classList.add("alert");
            error.classList.add("alert-danger");
            error.innerHTML = value[1];
            el.parentNode.insertBefore(error, el);
          });
        },
        clearErrors: function() {
          var errors = this.$refs.form.getElementsByClassName("alert-danger");

          Array.from(errors).forEach(function(error) {
            error.remove();
          });
        },
        fetchErrors: function(errors, prefix) {
          if ( prefix === void 0 ) prefix = "";

          var that = this;
          var result = [];

          if (errors.hasOwnProperty("children")) {
            return that.fetchErrors(errors.children, prefix);
          } else {
            _.forOwn(errors, function(value, index) {
              if ("" !== prefix) { index = "[" + index + "]"; }

              if (value.hasOwnProperty("children")) {
                result.push(_.flatten(that.fetchErrors(value, prefix + index)));
              } else if (value.hasOwnProperty("errors")) {
                result.push([prefix + index, value.errors[0]]);
              }
            });
          }

          return result;
        }
      }
    };

    exports.default = form;

    Object.defineProperty(exports, '__esModule', { value: true });

})));