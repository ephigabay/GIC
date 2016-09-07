'use strict';

const git = new (require('./Git'))();
const GUI = new (require('./UI'))();

GUI.setInputEvent((element) => {
    var message = element.getValue();

    git.sendMessage(message);
    element.setValue("");
    element.focus();
    GUI.redraw();
});


GUI.addMessage("Welcome to GIC - the first git based chat");
GUI.addMessage("Every message in this chat is a commit");
GUI.addMessage("And every channel is a branch");
GUI.addMessage("");
GUI.addMessage("Cloning repo... Please wait...");

git.cloneRepo('https://github.com/ephigabay/chatRepo.git')
    .then(() => {

        GUI.addMessage("Finished cloning repo, you may begin!");

        getBranches();
        getMessages();
    });


function getBranches() {
    git.getBranches()
        .then(branches => {
            branches.forEach(branch => {
                GUI.addChannelBuffer(branch);
            });
            GUI.addChannelFlush();
            setTimeout(getBranches, 5000);
        }).catch(err => {
            console.error(err);
        })
}

function getMessages() {
    git.getCommits()
        .then(commits => {
            commits.forEach(commit => {
                GUI.addMessageBuffer('{bold}' + commit.sender + '{/bold}: ' + commit.message);
            });
            GUI.addMessageFlush();
            setTimeout(getMessages, 1000);
        }).catch((err) => {
            console.error(err);
        })
}