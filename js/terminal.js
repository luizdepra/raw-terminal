// --- Locale ---
var Locale = null;

// --- Avaliable Commands ---
var Command = {
    help: { // Show hekp and commands
        command: function() {
            return Locale.help_command;
        },
        
        description: function() {
            return Locale.help_description;
        },
        
        exec: function() { 
            Terminal.print('Help me!');
            Terminal.print('&nbsp;');
        }
    },
    
    ls: { // List 'files'/Pages
        command: function() {
            return Locale.ls_command;
        },
        
        description: function() {
            return Locale.ls_description;
        },
        
        exec: function() { 
            Terminal.print('Ls me!');
            Terminal.print('&nbsp;');
        }
    },
    
    cat: { // Show 'file'
        command: function() {
            return Locale.cat_command;
        },
        
        description: function() {
            return Locale.cat_description;
        },
        
        exec: function() { 
            Terminal.print('Cat me!');
            Terminal.print('&nbsp;');
        }
    },
    
    hostname: { // Show site address
        command: function() {
            return Locale.hostname_command;
        },
        
        description: function() {
            return Locale.hostname_description;
        },
        
        exec: function() { 
            Terminal.print(Locale.hostname_msg);
            Terminal.print('&nbsp;');
        }
    },
    
    whoami: { // Show user IP
        command: function() {
            return Locale.whoami_command;
        },
        
        description: function() {
            return Locale.whoami_description;
        },
        
        exec: function() { 
            Terminal.print('Whoami me!');
            Terminal.print('&nbsp;');
        }
    }
};

// --- Terminal ---
var Terminal = {    
    commandLine: "",
    commandHistory: [],
    commandHistoryMaxSize: 20,
    commandHistoryIndex: -1,
    
    cursorIndex: 0,

    // Init Terminal
    init: function(container, locale) {
        this.container = container;
        
        this.loadLocale(locale);
        
        window.setInterval(function() {
            $('#cursor').toggleClass('blink');
        }, 500);
    },
    
    // load locale json
    loadLocale: function(locale) {
        $.getJSON('js/locale/' + locale + '.json', function(data) {
            Locale = data;
            Terminal.welcome();
        });
    },
    
    // Show welcome message
    welcome: function() {
        $(this.container).empty();
        
        this.print(Locale.welcome_msg);
        this.print(Locale.welcome_help_msg);
        this.print('&nbsp;');
        this.displayPrompt();
        
        $(document).on('keydown keypress', this.readKey);
    },
    
    // Read keyboard keys
    readKey: function(event) {
        if (!$('#cursor'))
            return;
        
        var code = event.keyCode || event.which;
        
        if (event.type == 'keydown') {
            console.log('keydown: ' + event.keyCode + ' - ' + event.which);
            
            if (code == 8) { // Backspace
                event.preventDefault();
                
                if (Terminal.cursorIndex > 0) {
                    var front = Terminal.commandLine.slice(0, Terminal.cursorIndex - 1);
                    var back = Terminal.commandLine.slice(Terminal.cursorIndex, Terminal.commandLine.length);
                    Terminal.cursorIndex--;
                    
                    Terminal.commandLine = front + back;
                    Terminal.updatePrompt();
                }
            }
            else if (code == 35) { // End
                Terminal.cursorIndex = Terminal.commandLine.length;
                
                Terminal.updatePrompt();
            }
            else if (code == 36) { // Home
                Terminal.cursorIndex = 0;
                
                Terminal.updatePrompt();
            }
            else if (code == 37) { // Left Arrow
                if (Terminal.cursorIndex > 0) {
                    Terminal.cursorIndex--;
                    
                    Terminal.updatePrompt();
                }
            }
            else if (code == 38) { // Up Arrow
                if (Terminal.commandHistoryIndex < Terminal.commandHistory.length - 1) {
                    Terminal.commandHistoryIndex++;
                    
                    Terminal.commandLine = Terminal.commandHistory[Terminal.commandHistoryIndex];
                    Terminal.updatePrompt();
                }
            }
            else if (code == 39) { // Right Arrow
                if (Terminal.cursorIndex < Terminal.commandLine.length) {
                    Terminal.cursorIndex++;
                    
                    Terminal.updatePrompt();
                }
            }
            else if (code == 40) { // Down Arrow
                if (Terminal.commandHistoryIndex > -1) {
                    Terminal.commandHistoryIndex--;
                    
                    if (Terminal.commandHistoryIndex == -1) {
                        Terminal.commandLine = '';
                    }
                    else {
                        Terminal.commandLine = Terminal.commandHistory[Terminal.commandHistoryIndex];
                    }
                    Terminal.updatePrompt();
                }
            }
            else if (code == 46) { // Delete
                if (Terminal.cursorIndex < Terminal.commandLine.length) {
                    var front = Terminal.commandLine.slice(0, Terminal.cursorIndex);
                    var back = Terminal.commandLine.slice(Terminal.cursorIndex + 1, Terminal.commandLine.length);
                    if (Terminal.cursorIndex > 0)
                        Terminal.cursorIndex--;
                    
                    Terminal.commandLine = front + back;
                    Terminal.updatePrompt();
                }
            }
        }
        else if (event.type == 'keypress') { // normal keys
            console.log('keypress: ' + event.keyCode + ' - ' + event.which);
            
            if (code != 13) { // not ENTER
                var character = String.fromCharCode(code);
                
                var front = Terminal.commandLine.slice(0, Terminal.cursorIndex);
                var back = Terminal.commandLine.slice(Terminal.cursorIndex, Terminal.commandLine.length);
                
                Terminal.commandLine = front + character + back;
                Terminal.cursorIndex++;
                
                Terminal.updatePrompt();
            }
            else { // ENTER
                Terminal.execute(Terminal.commandLine);
            }
        }
    },
    
    // Execute comand line
    execute: function(command) {
        if (command.length == 0)
            return;
    
        var parent = $('#command').parent();
        $('#command').remove();
        parent.append(command);
    
        this.commandHistory.unshift(command);
        if (this.commandHistory.length > this.commandHistoryMaxSize)
            this.commandHistory.pop();
        
        this.commandHistoryIndex = -1;
    
        var cmd = command.split(' ');
        
        if (Command[cmd[0]]) {
            Command[cmd[0]].exec();
        }
        else {
            this.print('terminal: '+command+': command not found');
        }
        
        this.displayPrompt();
    },
    
    // Print a text
    print: function(text) {
        var out = $('<div>').html(text);
        $(this.container).append(out);
    },
    
    // Show prompt
    displayPrompt: function() {
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
    
    // Update prompt
    updatePrompt: function() {
        var prompt = $('#command').parent();
        $('#command').remove();
        
        var command = $('<span>', {id: 'command'}).append(this.commandLine.slice(0, this.cursorIndex));
        
        var insideCursor;
        if (this.cursorIndex == this.commandLine.length) {
            insideCursor = '&nbsp;';
        }
        else {
            insideCursor = this.commandLine.slice(this.cursorIndex, this.cursorIndex + 1);
        }
        
        var cursor = $('<span>', {id: 'cursor'}).html(insideCursor);
        command.append(cursor);
 
        var postCursor = this.commandLine.slice(this.cursorIndex + 1, this.commandLine.length);
        command.append(postCursor);

        prompt.append(command);
    }
};

// --- Set, Ready, GO! ---
$(document).ready(function() {
  Terminal.init('#container', 'pt-br');
});
