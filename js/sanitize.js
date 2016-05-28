!function (Drupal, $, window, undefined) {
  Drupal.behaviors.sanitize = {
    attach: function (context, settings) {
      var Sanitizer = function () {};

      // Parses the element value for possible SSNs to CCNs.
      Sanitizer.prototype.checkSafe = function ($element) {
        var content, ssnMatcher;
        content = $element.val();
        ssnMatcher = new RegExp(/\d{3}[ \-.]?\d{2}[ \-.]?\d{4}\b/, 'gm');
        // TODO: This should probably be a more robust expression for credit
        // card numbers.
        ccnMatcher = new RegExp(/\d{4}[ \-.]?\d{4}[ \-.]?\d{4}[ \-.]?\d{4}\b/, 'gm');
        if (content.match(ssnMatcher) || content.match(ccnMatcher)) {
          this.createAlert($element);
        }
      };

      // Alerts the user of a possible information disclosure. Just once.
      Sanitizer.prototype.createAlert = function ($element) {
        var $form = $($element.closest('form'));
        $form.once(function () {
          alert("Whoops! It looks like you may have entered some private information. Please make sure that you have not included your CARD number or private information like a Social Security Number. This helps protect your privacy and keep your CARD secure.");
        });
      }

      // Every time a form is updated, kick off a check.
      $('.entitytype-contact-form', context).change(function (e) {
        var src, sanitizer;
        $src = $(e.srcElement);
        sanitizer = new Sanitizer();

        // Parse text and textareas only.
        if ($src.is('input[type=text]') || $src.is('textarea')) {
          if (!$src.is('#edit-field-phone-und-0-value')) {
            sanitizer.checkSafe($src);
          }
        }
      }, this);
    }
  }
}(Drupal, jQuery, window);
