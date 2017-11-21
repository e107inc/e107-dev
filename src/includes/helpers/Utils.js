/**
 * Class Utils.
 */
export default class Utils {

  /**
   * @returns {boolean}
   */
  static isE107(cookies) {
    if (typeof cookies === "string") {
      for (let cookie of cookies.split('; ')) {
        let [name, value] = cookie.split("=");
        if (name.indexOf('e107') !== -1 || value.indexOf('e107') !== -1) {
          return true;
        }
      }
    }
    else {
      for (let cookie of cookies) {
        if (cookie.name.indexOf('e107') !== -1 || cookie.value.indexOf('e107') !== -1) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @returns {boolean}
   */
  static debugModeIsOn(cookies) {
    if (typeof cookies === "string") {
      for (let cookie of cookies.split('; ')) {
        let [name, value] = cookie.split("=");
        if (name.indexOf('e107_debug_level') !== -1) {
          return true;
        }
      }
    }
    else {
      for (let cookie of cookies) {
        if (cookie.name.indexOf('e107_debug_level') !== -1) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Replace all occurrences of the search string with the replacement strings.
   *
   * @param {Array} array
   *   An array contains multiple needles.
   * @param {String} replace
   *   The replacement value that replaces found search values.
   * @param {String} string
   *   The string or array being searched and replaced on.
   *
   * @returns {*}
   */
  static arrayReplace(array, replace, string) {
    let replaceString = string;
    for (let i = 0; i < array.length; i++) {
      replaceString = replaceString.replace(array[i], replace);
    }
    return replaceString;
  }

  /**
   * Strip the specified characters from the beginning of a string.
   *
   * @param {String} string
   *   The input string.
   * @param {String} character
   *   The characters you want to strip.
   *
   * @returns {*|XML|void}
   */
  static leftTrim(string, character) {
    let pattern = '/^' + character + '/';
    return string.replace(pattern, '');
  }

}
