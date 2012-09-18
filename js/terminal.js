var Terminal = {
    locale: null,

    init: function(container, locale) {
        this.container = container;
        
        this.loadLocale(locale);
    },
    
    loadLocale: function(locale) {
        $.getJSON('js/locale/' + locale + '.json', function(data) {
            Terminal.locale = data;
            Terminal.welcome();
        });
    },
    
    welcome: function() {
        $(this.container).empty();
        
        this.print(this.locale.welcome_msg);
        this.print(this.locale.welcome_help_msg);
        this.print('&nbsp;');
        this.prompt();
    },
    
    print: function(text) {
        var out = $('<div>').html(text);
        $(this.container).append(out);
    },
    
    prompt: function() {
        var prompt = $('<div>').html('[luizdepra.com.br]$ ');
        var cursor = $('<span>', {'class': 'cursor'}).html('&nbsp;').wrap($('blink'));
        prompt.append(cursor);
        $(this.container).append(prompt);
    }
};

$(document).ready(function() {
  Terminal.init('#container', 'en-us');
});
