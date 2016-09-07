'use strict';
require('shelljs/global');

const TEMP_FOLDER = '/tmp';

class Git {

	constructor() {
		this.messageHashes = {};
        this.lock = false;
	}

    cloneRepo(repository) {
    	return this.runCommand('git clone --depth=1 ' + repository + ' ' + this.getRepoFolderName());
    }

    getBranches() {
    	return this.runGitCommand('ls-remote --heads origin')
    				.then(branchesStr => {
		    			return branchesStr
		    				.split('\n')
		    				.filter(branch => {
		    					return branch.length > 0;
		    				})
		    				.map(branch => {
		    					return branch.match(/refs\/heads\/(.+)/)[1];
		    				})
		    		});
    }

    getCommits() {
        
        if(this.lock) {
            return Promise.resolve([]);
        }

    	return this.runGitCommand('pull')
    				.then(this.runGitCommand.bind(this, 'log --pretty=format:"%h;%cn;%s"'))
    				.then(commits => {
    					return commits.split('\n').map(commit => {
    						let parts = commit.split(';');
    						return {
    							hash: parts[0],
    							sender: parts[1],
    							message: parts[2]
    						}
    					})
    				})
    				.then(commits => {
    					return commits.filter(commit => {
    						return !(commit.hash in this.messageHashes);
    					});
    				})
    				.then(commits => {
    					commits.forEach(commit => {
    						this.messageHashes[commit.hash] = true;
    					});

    					return commits;
    				});
    }

    sendMessage(message) {

        if(this.lock) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.sendMessage(message)
                        .then(resolve)
                }, 500)
            })
        }

        this.lock = true;
        return this.runGitCommand('commit -am "' + message.replace(/"/g, "\\\"") + '" --allow-empty')
                    .then(this.runGitCommand.bind(this,'push'))
                    .then(() => {
                        this.lock = false;
                    });
    }

    switchBranch(branchName) {
    	return this.runGitCommand('fetch origin ' + branchName + ':' + branchName)
    			.then(this.runGitCommand.bind(this, 'checkout ' + branchName));
    }

    getRepoFolderName() {
    	return this.folderName = this.folderName || 'gic_' + new Date().getTime();
    }

    runCommand(command) {

    	cd(TEMP_FOLDER);

    	return new Promise((resolve, reject) => {
    		exec(command, {silent: true}, function(code, stdout, stderr) {
    			if(code === 0) {
    				resolve(stdout);
	    		} else {
	    			reject(stderr);
	    		}
	    	});
    	});
    }

    runGitCommand(command, callback) {

    	cd(TEMP_FOLDER + '/' + this.getRepoFolderName());

    	return new Promise((resolve, reject) => {
    		exec('git ' + command, {silent: true}, function(code, stdout, stderr) {
	    		if(code === 0) {
	    			resolve(stdout);
	    		} else {
	    			reject(stderr);
	    		}
	    	});
    	});
    }



}

module.exports = Git;