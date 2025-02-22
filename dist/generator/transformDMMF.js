"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformDMMF = transformDMMF;
exports.transformEnum = void 0;
const transformField = field => {
  var _field$default;
  const deps = new Set();
  let tokens = [field.name + ':'];
  let inputTokens = [];
  if (['Int', 'Float', 'Decimal'].includes(field.type)) {
    tokens.push('t.Number()');
  } else if (['BigInt'].includes(field.type)) {
    tokens.push('t.Integer()');
  } else if (['String', 'DateTime', 'Json', 'Date'].includes(field.type)) {
    tokens.push('t.String()');
  } else if (field.type === 'Boolean') {
    tokens.push('t.Boolean()');
  } else if (field.kind !== 'object') {
    tokens.push(`::${field.type}::`);
    deps.add(field.type);
  }
  if (field.isList && field.kind !== 'object') {
    tokens.splice(1, 0, 't.Array(');
    tokens.splice(tokens.length, 0, ')');
  }
  if (field.kind === 'object') {
    return {
      str: '',
      strInput: '',
      deps
    };
  }
  inputTokens = [...tokens];

  // @id cannot be optional except for input if it's auto increment
  if (field.isId && (field === null || field === void 0 ? void 0 : (_field$default = field.default) === null || _field$default === void 0 ? void 0 : _field$default.name) === 'autoincrement') {
    inputTokens.splice(1, 0, 't.Optional(');
    inputTokens.splice(inputTokens.length, 0, ')');
  }
  if ((!field.isRequired || field.hasDefaultValue) && !field.isId) {
    tokens.splice(1, 0, 't.Optional(');
    tokens.splice(tokens.length, 0, ')');
    inputTokens.splice(1, 0, 't.Optional(');
    inputTokens.splice(inputTokens.length, 0, ')');
  }
  return {
    str: tokens.join(' ').concat('\n'),
    strInput: inputTokens.join(' ').concat('\n'),
    deps
  };
};
const transformFields = fields => {
  let dependencies = new Set();
  const _fields = [];
  const _inputFields = [];
  fields.map(transformField).forEach(field => {
    _fields.push(field.str);
    _inputFields.push(field.strInput);
    [...field.deps].forEach(d => {
      dependencies.add(d);
    });
  });
  return {
    dependencies,
    rawString: _fields.filter(f => !!f).join(','),
    rawInputString: _inputFields.filter(f => !!f).join(',')
  };
};
const transformModel = (model, models) => {
  const fields = transformFields(model.fields);
  let raw = [`${models ? '' : `export const ${model.name} = `}t.Object({\n\t`, fields.rawString, '})'].join('\n');
  let inputRaw = [`${models ? '' : `export const ${model.name}Input = `}t.Object({\n\t`, fields.rawInputString, '})'].join('\n');
  if (Array.isArray(models)) {
    models.forEach(md => {
      const re = new RegExp(`.+::${md.name}.+\n`, 'gm');
      const inputRe = new RegExp(`.+::${md.name}.+\n`, 'gm');
      raw = raw.replace(re, '');
      inputRaw = inputRaw.replace(inputRe, '');
    });
  }
  return {
    raw,
    inputRaw,
    deps: fields.dependencies
  };
};
const transformEnum = enm => {
  const values = enm.values.map(v => `${v.name}: t.Literal('${v.name}'),\n`).join('');
  return [`export const ${enm.name} = t.KeyOf(`, 't.Object({', values, '})', ')'].join('\n');
};
exports.transformEnum = transformEnum;
function transformDMMF(dmmf) {
  const {
    models,
    enums
  } = dmmf.datamodel;
  const importStatements = new Set(['import { t } from "elysia"']);
  return [...models.map(model => {
    let {
      raw,
      inputRaw,
      deps
    } = transformModel(model);
    [...deps].forEach(d => {
      const depsModel = models.find(m => m.name === d);
      if (depsModel) {
        const replacer = transformModel(depsModel, models);
        const re = new RegExp(`::${d}::`, 'gm');
        raw = raw.replace(re, replacer.raw);
        inputRaw = inputRaw.replace(re, replacer.inputRaw);
      }
    });
    enums.forEach(enm => {
      const re = new RegExp(`::${enm.name}::`, 'gm');
      if (raw.match(re)) {
        raw = raw.replace(re, enm.name);
        inputRaw = inputRaw.replace(re, enm.name);
        importStatements.add(`import { ${enm.name} } from './${enm.name}.js'`);
      }
    });
    return {
      name: model.name,
      rawString: [[...importStatements].join('\n'), raw].join('\n\n'),
      inputRawString: ''
    };
  }), ...enums.map(enm => {
    return {
      name: enm.name,
      inputRawString: null,
      rawString: 'import { t } from "elysia"\n\n' + transformEnum(enm)
    };
  })];
}