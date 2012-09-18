var Command = {
    help: function() {
        Terminal.print('Help me!');
    }
};

var Terminal = {
    locale: null,
    
    commandLine: "",

    init: function(container, locale) {
        this.container = container;
        
        this.loadLocale(locale);
        
        window.setInterval(function() {
            $('.cursor').toggleClass('blink');
        }, 500);
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
        
        $(document).keypress(this.readKey);
    },
    
    readKey: function(event) {
        if (!$('.cursor'))
            return;
        
        var code = event.keyCode || event.which;
        
        if (code != 13) {
            var character = String.fromCharCode(code);
            Terminal.commandLine += character;
            
            $('.cursor').before(character);
        }
        else {
            Terminal.execute(Terminal.commandLine);
        }
        
    },
    
    execute: function(command) {
        $('.cursor').remove();
        this.commandLine = "";
    
        var cmd = command.split(' ');
        
        if (Command[cmd[0]]) {
            Command[cmd[0]]();
        }
        else {
            this.print('terminal: '+command+': command not found');
        }
        
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
        
        $(window).scrollTop($('.cursor').offset().top);
    }
};

$(document).ready(function() {
  Terminal.init('#container', 'pt-br');
});
