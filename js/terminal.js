var Command = {
    help: function() {
        Terminal.print('Help me!');
    }
};

var Terminal = {
    locale: null,
    
    commandLine: "",
    commandHistory: [],
    commandHistoryIndex: -1,
    
    cursorIndex: 0,
    cursorSize: 1,

    init: function(container, locale) {
        this.container = container;
        
        this.loadLocale(locale);
        
        window.setInterval(function() {
            $('#cursor').toggleClass('blink');
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
        this.displayPrompt();
        
        $(document).on('keydown keypress', this.readKey);
    },
    
    readKey: function(event) {
        if (!$('#cursor'))
            return;
        
        var code = event.keyCode || event.which;
        
        if (event.type == 'keydown') {
            console.log('keydown: ' + event.keyCode + ' - ' + event.which);
            
            if (code == 8)
                event.preventDefault();
        }
        else if (event.type == 'keypress') {
            console.log('keypress: ' + event.keyCode + ' - ' + event.which);
            
            if (code != 13) {
                var character = String.fromCharCode(code);
                Terminal.commandLine += character;
                Terminal.cursorIndex++;
                
                Terminal.updatePrompt();
            }
            else {
                Terminal.execute(Terminal.commandLine);
            }
        }
    },
    
    execute: function(command) {
        var parent = $('#command').parent();
        $('#command').remove();
        parent.append(command);
    
        var cmd = command.split(' ');
        
        if (Command[cmd[0]]) {
            Command[cmd[0]]();
        }
        else {
            this.print('terminal: '+command+': command not found');
        }
        
        this.displayPrompt();
    },
    
    print: function(text) {
        var out = $('<div>').html(text);
        $(this.container).append(out);
    },
    
    displayPrompt: function() {
        this.cursorSize = 1;
        this.cursorIndex = 0;
        this.commandLine = "";
    
        var prompt = $('<div>').html('[luizdepra.com.br]$ ');
        var command = $('<span>', {id: 'command'});
        var cursor = $('<span>', {id: 'cursor'}).html('&nbsp;').wrap($('blink'));
        command.append(cursor);
        prompt.append(command);
        $(this.container).append(prompt);
        
        $(window).scrollTop($('#cursor').offset().top);
    },
    
    updatePrompt: function() {
        var prompt = $('#command').parent();
        $('#command').remove();
        
        var command = $('<span>', {id: 'command'}).append(this.commandLine.substring(0, this.cursorIndex));
        
        var insideCursor;
        if (this.cursorIndex == this.commandLine.length) {
            insideCursor = '&nbsp;';
        }
        else {
            insideCursor = this.commandLine.substring(this.cursorIndex, this.cursorIndex + this.cursorSize);
        }
        
        var cursor = $('<span>', {id: 'cursor'}).html(insideCursor);
        command.append(cursor);
 
        if (this.cursorIndex + this.cursorSize < this.commandLine.length) {
            var postCursor = this.commandLine.substring(this.cursorIndex + this.cursorSize, this.commandLine.length);
            command.append(postCursor);
        }
 
        prompt.append(command);
    }
};

$(document).ready(function() {
  Terminal.init('#container', 'pt-br');
});
