'use strict';

const blessed = require('blessed');

class UI {

	constructor() {
		this.screen = this.generateScreen();

		this.screen.title = 'GIC - git based chat';

		this.chatHistory = this.generateChatHistory();

		this.input = this.generatorInput();

		this.channelsList = this.generateChannelsList();

		// Append our box to the screen.
		this.screen.append(this.chatHistory);
		this.screen.append(this.input);
		this.screen.append(this.channelsList);

		this.input.focus();

		this.setEvents();

		this.redraw();
	}

	setEvents() {
		this.screen.key(['C-c'], function(ch, key) {
		    return process.exit(0);
		});

		this.input.on('click', function() {
		    this.focus();
		});
	}

	setInputEvent(callback) {
		this.input.key('enter', function() {
			callback(this);
		});
	}

	setListItemSelectedEvent(callback) {
		this.channelsList.on('element click', function() {
			callback(this.value);
		})
	}

	generateChatHistory() {
		return blessed.box({
		    top: 0,
		    left: 0,
		    width: '100%-25',
		    height: '100%-3',
		    tags: true,
		    border: {
		        type: 'line'
		    },
		    scrollable: true,
		    alwaysScroll: true,
		    mouse: true,
		    style: {
		        fg: '#00ff00',
		        bg: '#000000',
		        border: {
		            fg: '#f0f0f0'
		        }
		    } 
		});
	}

	generatorInput() {
		return blessed.Textbox({
		    width: '100%-25',
		    bottom: 0,
		    height: 3,
		    inputOnFocus: true,
		    padding: {
		        top: 1,
		        left: 2
		    },
		    style: {
		        fg: '#787878',
		        bg: '#454545',

		        focus: {
		            fg: '#f6f6f6',
		            bg: '#353535'
		        }
		    }
		});
	}

	generateChannelsList() {
		return blessed.List({
		    top: 0,
		    right: 0,
		    width: 25,
		    height: '100%',
		    tags: true,
		    border: {
		        type: 'line'
		    },
		    scrollable: true,
		    mouse: true,
		    keys: true,
		    vi: false,
		    style: {
		        selected: {
		            fg: 'red'
		        },
		        fg: '#00ff00',
		        bg: '#000000',
		        border: {
		            fg: '#f0f0f0'
		        }
		    }
		});
	}

	generateScreen() {
		return blessed.screen({
		    smartCSR: true,
		    width: '100%'
		});
	}

	addMessage(message) {
		this.addMessageBuffer(message);
		this.addMessageFlush();
	}

	addMessageBuffer(message) {
		this.chatHistory.pushLine(message);
	}

	addMessageFlush() {
		this.chatHistory.setScrollPerc(100);
		this.redraw();
	}

	clearMessages() {
		this.chatHistory.setContent('');
	}

	addChannelBuffer(channel) {
		if(!this.channelsList.getItem(channel)) {
            this.channelsList.add(channel);                    
        }
	}

	addChannelFlush() {
		this.redraw();
	}

	redraw() {
		this.screen.render();
	}

}

module.exports = UI;