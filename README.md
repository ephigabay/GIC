# GIC
GIC is a git based chat. It uses a git server for storing messages and managing the chat.

## How it works
In GIC every message is a commit message, and every channel in the chat is a branch.

## Getting started
Clone this repo:
`git clone https://github.com/ephigabay/GIC.git`
Install dependencies:
`npm install`
Edit the repository link in the `config.js` file to a git repository you have access to.
Run the app: `npm start`

## Warning
Don't use a real git repository you actually use for work, this chat will commit to your repository every message sent in the chat. It's best to create a new git repository for the chat.