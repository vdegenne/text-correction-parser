'use strict';

let operators = [
  {
    name: 'wrong_replace',
    opening : '[',
    closing: '>',
    encloser: '<span class="wrong_replace">%</span> '
  },

  {
    name: 'right_replace',
    opening: '>',
    closing: ']',
    encloser: '<span class="right_replace">%</span>'
  },

  {
    name: 'removed',
    opening: '>',
    closing: '<',
    encloser: '<span class="removed">%</span>'
  },

  {
    name: 'adding',
    opening: '@',
    closing: '@',
    encloser: '<span class="added">%</span>'
  }
];

let awaiting, candidates, enclosedText;

function reset_vars () {
  awaiting = false;
  candidates = [];
  enclosedText = '';
}

function parse_data (data) {
  let output = '';

  for (let i = 0; i < data.length; ++i) {
    let theLetter = data[i];

    if (!awaiting) {
      /* searching for an opening */
      let openings = operators.filter(function (o) {
        return o.opening === theLetter;
      });

      if (openings.length) {
        candidates = openings;
        awaiting = true;
        continue;
      }

      output += theLetter;
      continue;
    }

    /* else we search for closers */
    let closers = candidates.filter(function (c) {
      return c.closing === theLetter;
    });

    if (closers.length)
    {
      let closer = closers[0];

      output += closer.encloser.replace('%', enclosedText);
      reset_vars();

      let openings = operators.filter(function (o) {
        return (!(closer === o) && o.opening === theLetter);
      });

      if (openings.length) {
        candidates = openings;
        awaiting = true;
      }
      continue;
    }

    enclosedText += theLetter;
  }

  reset_vars();
  return output;
}




module.exports.parse_data = parse_data;