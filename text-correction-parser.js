(function () {
  'use strict';

  const enclosers = [
      {
        name: 'left-wrong-replaced',
        opening : '[r]',
        closing: '>>',
        template: '<span class="left-wrong-replaced">%</span>'
      },{
        name: 'right-right-replaced',
        opening: '>>',
        closing: '[/r]',
        template: '<span class="right-right-replaced">%</span>'
      },{
        name: 'left-right-replaced',
        opening : '[r]',
        closing: '<<',
        template: '<span class="left-right-replaced">%</span>'
      },{
        name: 'right-wrong-replaced',
        opening: '<<',
        closing: '[/r]',
        template: '<span class="right-wrong-replaced">%</span>'
      },{
        name: 'deleted',
        opening: '[d]',
        closing: '[/d]',
        template: '<span class="deleted">%</span>'
      },{
        name: 'added',
        opening: '[a]',
        closing: '[/a]',
        template: '<span class="added">%</span>'
      }

    ];

  class TextCorrectionParser {

    constructor(data) {
      this.data = data;
      this.parsed;
      this.dindex;
      this.currentCandidates;
      this.cchar;
      this.enclosedText;

      this.resetVars();
    }

    resetVars() {
      this.parsed = '';
      this.dindex = 0;
      this.currentCandidates = [];
      this.cchar = '';
      this.enclosedText = '';
    }


    parse(data = this.data) {
      this.data = data;
      this.resetVars();

      let possible;
      let tagStartRegexp;
      let foundClosingCandidates;
      let hasJustFoundClosingCandidate = false;

      for (this.dindex = 0; this.dindex < this.data.length; ++this.dindex) {

        this.cchar = this.data[this.dindex];
        tagStartRegexp = new RegExp('^' + this.escapeRegExp(this.cchar));

        /* check for close candidates */
        if (this.currentCandidates.length) {
          possible = enclosers.filter(e => tagStartRegexp.test(e.closing));
          if (possible.length) {
            let foundClosingEnclosers = this.findEnclosers('closing');
            if (foundClosingEnclosers.length) { // a closing tag was found amonst the candidates
              foundClosingCandidates = this.currentCandidates.filter(c => {
                for (let f in foundClosingEnclosers) {
                  if (c === foundClosingEnclosers[f]) {
                    return true;
                  }
                }
                return false;
              });
              if (foundClosingCandidates.length) {
                this.parsed += foundClosingCandidates[0].template.replace('%', this.enclosedText);
                this.currentCandidates = [];
                hasJustFoundClosingCandidate = true;

                this.enclosedText = '';
              }
              else {
                hasJustFoundClosingCandidate = false;
                this.addCharToEnclosedText();
                continue;
              }
            }
            else {
              this.addCharToEnclosedText();
              continue;
            }
          }
          else {
            this.addCharToEnclosedText();
            continue;
          }
        }

        /* we search for opening tags */
        possible = enclosers.filter(e => tagStartRegexp.test(e.opening));
        if (possible.length) {
          this.currentCandidates = this.findEnclosers('opening');
          if (this.currentCandidates.length) {
            // jumping the tag
            this.dindex += this.currentCandidates[0].opening.length - 1;
            continue;
          }
        }

        if (hasJustFoundClosingCandidate) {
          this.dindex += foundClosingCandidates[0].closing.length - 1;
          hasJustFoundClosingCandidate = false;
          continue;
        }

        this.parsed += this.cchar;
      }


      return this.parsed;
    }

    addCharToEnclosedText() {
      this.enclosedText += this.cchar;
    }

    findEnclosers(type = 'opening') {
      let offset = 0;
      let tag = '';
      let founds, possible;
      let tagStartRegexp;

      do {
        tag += this.data[this.dindex + offset];
        offset++;

        /* are there some enclosers ? */
        founds = enclosers.filter(e => e[type] === tag);
        if (founds.length) {
          return founds;
        }
        /* if no founds, let's see if there are some possible enclosers */
        tagStartRegexp = new RegExp('^' + this.escapeRegExp(tag));
        possible = enclosers.filter(e => tagStartRegexp.test(e[type]));

        // we continue while possible enclosers
      } while (possible.length);

      return [];
    }

    escapeRegExp(s) {
      return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
  }

  TextCorrectionParser.enclosers = enclosers;
  window.TextCorrectionParser = TextCorrectionParser;
})();