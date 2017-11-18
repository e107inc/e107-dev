/**
 * Class Utils.
 */
export default class Utils {

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
      replaceString = replaceString.replace(new RegExp(array[i], 'g'), replace);
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
