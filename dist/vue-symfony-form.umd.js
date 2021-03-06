(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('form-serialize'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'form-serialize', 'lodash'], factory) :
  (factory((global.symfonyForm = {}),global.serialize,global._));
}(this, (function (exports,serialize,_) { 'use strict';

  serialize = serialize && serialize.hasOwnProperty('default') ? serialize['default'] : serialize;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  (function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=""; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();

  var symfonyForm = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('form',{ref:"form",on:{"submit":function($event){$event.preventDefault();return _vm.onSubmit($event)}}},[(_vm.showInvalid)?_c('div',{class:_vm.errorClass},[_vm._t("warning",[_vm._v(" Whoops! Seems you've entered invalid data. ")])],2):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
    name: 'SymfonyForm',
    props: {
      action: { type: String, required: true },
      method: { type: String, default: 'GET' },
      errorClass: { type: String, default: 'form-error'},
      dataPrefix: { type: String, default: undefined },
      isSecure: Boolean,
    },
    data: function data() {
      return {
        showInvalid: false
      };
    },
    methods: {
      onSubmit: function() {
        var this$1 = this;

        var data = serialize(this.$refs.form, { hash: true });

        this.$emit('beforeSubmit', data);

        this.$connector(this.action, this.method, data, this.isSecure)
          .then(function (req) {
            this$1.clearErrors();

            this$1.$emit('onSuccess', req);
          })
          .catch(function (error) {
            this$1.$emit('onFail');

            var res = error.response;
            if (res.status >= 400) {
              if (res.data.hasOwnProperty('errors')) {
                this$1.showErrors(res.data.errors);
                this$1.showInvalid = false;
              } else {
                this$1.showInvalid = true;
              }
            }
          });

        this.$emit('onSubmit');
      },
      showErrors: function(errors) {
        var this$1 = this;

        this.clearErrors();

        var prefix = this.dataPrefix === undefined ? '' : this.dataPrefix;
        this.fetchErrors(errors, prefix).forEach(function (value) {
          var el = this$1.$refs.form.querySelector('[name=\'' + value[0] + '\']');
          var error = document.createElement('div');
          error.classList.add(this$1.errorClass);
          error.innerHTML = value[1];
          el.parentNode.insertBefore(error, el);
        });
      },
      clearErrors: function() {
        var errors = this.$refs.form.getElementsByClassName(this.errorClass);

        Array.from(errors).forEach(function(error) {
          error.remove();
        });
      },
      fetchErrors: function(errors, prefix) {
        var this$1 = this;
        if ( prefix === void 0 ) prefix = '';

        var result = [];

        if (errors.hasOwnProperty('children')) {
          return this.fetchErrors(errors.children, prefix);
        } else {
          _.forOwn(errors, function (value, index) {
            if ('' !== prefix) { index = '[' + index + ']'; }

            if (value.hasOwnProperty('children')) {
              result.push(_.flatten(this$1.fetchErrors(value, prefix + index)));
            } else if (value.hasOwnProperty('errors')) {
              result.push([prefix + index, value.errors[0]]);
            }
          });
        }

        return result;
      }
    }
  };

  var index = {
      install: function install(Vue, options) {
          if (!options.hasOwnProperty('connector')) {
              console.error('(@vue-symfony-form): connector must be set');
          } else {
              Vue.prototype.$connector = options.connector;
              Vue.component(symfonyForm.name, symfonyForm);
          }
      }
  }

  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
