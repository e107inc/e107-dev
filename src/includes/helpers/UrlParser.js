import MenuItems from '../../config/menu.items.json';
import Utils from './Utils';

/**
 * Class UrlParser.
 */
export default class UrlParser {

  /**
   * Returns with domain.
   *
   * @param url
   *   URL we want to get domain from.
   */
  static getDomainFromUrl(url) {
    let parsedUrl = UrlParser.parseUrl(url);
    return parsedUrl.domain;
  }

  /**
   * Parses an URL.
   *
   * @param {String} url
   *   URL to be parsed.
   *
   * @returns {{protocol: string, domain: string, subdomain: string, parent_domain: string, path: string, query: string, fragment: string}}
   */
  static parseUrl(url) {
    let parsed_url = {
      'protocol': '',
      'domain': '',
      'subdomain': '',
      'parent_domain': '',
      'path': '',
      'query': '',
      'fragment': ''
    };

    if (typeof url === "undefined" || url === null || url.length === 0) {
      return parsed_url;
    }

    let protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0, protocol_i);

    let remaining_url = url.substr(protocol_i + 3, url.length);
    let domain_i = remaining_url.indexOf('/');
    domain_i = domain_i === -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = (domain_i === -1 || domain_i + 1 === remaining_url.length) ? '' : remaining_url.substr(domain_i + 1, remaining_url.length);

    if (parsed_url.path && parsed_url.path.indexOf("#") !== -1) {
      let fragment = parsed_url.path.split('#');
      parsed_url.fragment = fragment[1];
      // Update path with the fragment-less value.
      parsed_url.path = fragment[0];
    }

    if (parsed_url.path && parsed_url.path.indexOf("?") !== -1) {
      let query = parsed_url.path.split('?');
      parsed_url.query = query[1];
      // Update path with the query-less value.
      parsed_url.path = query[0];
    }

    let domain_parts = parsed_url.domain.split('.');
    switch (domain_parts.length) {
      case 2:
        parsed_url.subdomain = '';
        parsed_url.host = domain_parts[0];
        parsed_url.tld = domain_parts[1];
        break;
      case 3:
        parsed_url.subdomain = domain_parts[0];
        parsed_url.host = domain_parts[1];
        parsed_url.tld = domain_parts[2];
        break;
      case 4:
        parsed_url.subdomain = domain_parts[0];
        parsed_url.host = domain_parts[1];
        parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
        break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;
    return parsed_url;
  }

  static setDebugParam(url, mode) {
    let nfo = UrlParser.parseUrl(url);
    // Assemble new URL with the selected debug mode.
    let newUrl = nfo.protocol + '://' + nfo.domain + '/' + nfo.path + '?' + mode;

    // Process query parameters.
    if (nfo.query && nfo.query !== "") {
      let find = Object.keys(MenuItems);
      // Remove any kind of debug modes applied before.
      let query = Utils.arrayReplace(find, '', nfo.query);
      // Remove '?' query prefix if it exists.
      query = Utils.arrayReplace(['?'], '', query);
      // Remove '&' query separator from the beginning of the query.
      query = Utils.leftTrim(query, '&');
      // Append query to URL.
      newUrl += (query !== "") ? '&' + query : '';
    }

    // Process URL fragment.
    if (nfo.fragment && nfo.fragment !== "") {
      // Remove '#' fragment prefix if it exists.
      let fragment = Utils.arrayReplace(['#'], '', nfo.fragment);
      // Append fragment to URL.
      newUrl += (fragment !== "") ? '#' + fragment : '';
    }

    return newUrl;
  }

  static getDebugParam(url, def) {
    for (let [mode, label] of Object.entries(MenuItems)) {
      if (label === 'separator') {
        continue;
      }

      if (url.indexOf(mode) !== -1) {
        return mode;
      }
    }

    return def;
  }

}
