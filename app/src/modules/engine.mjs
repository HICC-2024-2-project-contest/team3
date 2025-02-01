'use strict';

import fs from 'node:fs';
import path from 'node:path';

import { parse as parseHTML } from 'node-html-parser';
const HTML = {
  parse: parseHTML,
};

class TemplateEngine {
  #cache = {};
  options;
  templates;

  constructor(options) {
    this.views = options.views;
    this.options = options;
    this.templates = {};
    this.resources = {};
  }

  render(file, scope, callback) {
    try {
      const template = this.getTemplate(file);

      const document = HTML.parse(template);
      this.processDocument(file, document, scope);
      const parsed = document.toString();

      callback(null, parsed);
    } catch (error) {
      callback(error, null);
    }
  }

  use(req, res, next) {
    try {
      const file = path.resolve(this.views, req.path.substring(1));

      if (!file.startsWith(this.views)) {
        throw 403;
      }

      if (!fs.existsSync(file)) {
        throw 404;
      }

      res.sendFile(file);
    } catch (e) {
      next();
    }
  }

  getTemplate(file) {
    const key = Buffer.from(file).toString('base64');

    if (!this.#cache[key]) {
      this.#cache[key] = fs.readFileSync(file).toString();
    }

    return this.#cache[key];
  }

  processDocument(file, document, scope = {}) {
    this.processInjection(file, document, scope);
    this.processImportTag(file, document, scope);
    this.processUri(file, document, scope);
  }

  processInjection(file, document, scope = {}) {
    let content = document.innerHTML;
    const injections = content.match(/#{([^}]+)}/g);
    for (const injection of injections || []) {
      const code = injection.match(/#{([^}]+)}/)[1];
      const value = this.eval(code, scope);
      content = content.replace(injection, value);
    }
    document.innerHTML = content;
  }

  processImportTag(file, document, scope = {}) {
    let elements = document.querySelectorAll('import');
    for (const element of elements) {
      const src = element.getAttribute('src');
      const importFile = path.resolve(
        src.startsWith('/') ? scope.settings.view : path.dirname(file),
        element.getAttribute('src')
      );
      const importDocument = HTML.parse(this.getTemplate(importFile));
      this.processDocument(importFile, importDocument, scope);
      element.replaceWith(...importDocument.childNodes);
    }
  }

  processUri(file, document, scope = {}) {
    let srcElements = document.querySelectorAll('[src]');
    for (const element of srcElements) {
      const src = element.getAttribute('src');
      if (!src || src.startsWith('/') || src.match(/^https?:\/?\/?/)) {
        continue;
      } else {
        let newUri = path.resolve(path.dirname(file), src);
        newUri = newUri.replace(/\\/g, '/');
        newUri = newUri.substring(scope.settings.views.length);
        element.setAttribute('src', newUri);
      }
    }
    let hrefElements = document.querySelectorAll('[href]');
    for (const element of hrefElements) {
      if (element.tagName === 'A') {
        continue;
      }
      const href = element.getAttribute('href');
      if (!href || href.startsWith('/') || href.match(/^https?:\/?\/?/)) {
        continue;
      } else {
        let newUri = path.resolve(path.dirname(file), href);
        newUri = newUri.replace(/\\/g, '/');
        newUri = newUri.substring(scope.settings.views.length);
        element.setAttribute('href', newUri);
      }
    }
  }

  eval(code, scope) {
    return new Function(`with (this) { return ${code} }`).call(scope);
  }
  nodes(string) {
    return HTML.parse(string).childNodes;
  }
}

export default TemplateEngine;
