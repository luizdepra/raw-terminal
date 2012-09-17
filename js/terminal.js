var Terminal = {
    locale: null,

    init: function(container, locale) {
        this.container = container;
        
        this.loadLocale(locale);
    },
    
    loadLocale: function(locale) {
        $.getJSON(locale + '.json', function(json) {
            this.locale = json;
            this.welcome();
        });
    },
    
    welcome: function() {
        // TODO clean screen
        this.print(this.locale...);
    },
    
    print: function(text) {
        var out = $('<div>').html(text);
        out.appendTo($(this.container));
    },
    
    prompt: function() {
    
    }
};

$(document).ready(function() {
  Terminal.init('#container', 'pt-br');
});
