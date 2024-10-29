"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const faker_1 = require("@faker-js/faker");
const ChatEngine = new (class {
    constructor() {
        this._sessionUuid = (0, uuid_1.v4)();
        this._participants = [];
        this._messages = [];
        this._messagesMap = {};
        this._mainParticipant = {
            uuid: "you",
            name: "You",
            bio: faker_1.faker.person.bio(),
            email: faker_1.faker.internet.email(),
            jobTitle: faker_1.faker.person.jobTitle(),
            avatarUrl: faker_1.faker.image.urlLoremFlickr(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        this._tick = 0;
        this._loop = null;
    }
    start() {
        this._loop = setInterval(this._main.bind(this), 1e3);
    }
    stop() {
        if (this._loop === null)
            return;
        clearInterval(this._loop);
        this._loop = null;
    }
    setup() {
        for (let i = 0; i < 5; i++) {
            this._createRandomParticipant();
        }
        for (let i = 0; i < 50; i++) {
            this._createRandomMessage(i);
        }
    }
    getSessionUuid() {
        return this._sessionUuid;
    }
    getAllParticipants() {
        const participants = [this._mainParticipant, ...this._participants];
        return participants;
    }
    getParticipantUpdates(time) {
        const participants = [this._mainParticipant, ...this._participants];
        return participants.filter((p) => p.updatedAt >= time);
    }
    getAllMessages() {
        return this._fillReplyToMessage(this._messages);
    }
    getLatestMessages() {
        const messages = this._messages.slice(this._messages.length - 25);
        return this._fillReplyToMessage(messages);
    }
    getMessageUpdates(time) {
        const messages = this._messages.filter((m) => m.updatedAt >= time);
        return this._fillReplyToMessage(messages);
    }
    getOlderMessages(messageUuid) {
        const index = this._messages.findIndex((m) => m.uuid === messageUuid);
        const endIndex = Math.max(0, index);
        const startIndex = Math.max(0, endIndex - 25);
        const messages = this._messages.slice(startIndex, endIndex);
        return this._fillReplyToMessage(messages);
    }
    addNewMessage(text) {
        const message = {
            uuid: (0, uuid_1.v4)(),
            text,
            attachments: [],
            sentAt: Date.now(),
            updatedAt: Date.now(),
            authorUuid: "you",
            reactions: [],
        };
        if (Math.random() < 0.5) {
            const attachment = this._createRandomAttachment();
            message.attachments.push(attachment);
        }
        this._messages.push(message);
        this._messagesMap[message.uuid] = message;
        return message;
    }
    _main() {
        if (this._tick % 600 === 0) {
            this._createRandomMessage();
        }
        if (this._tick % 30 === 0) {
            this._updateRandomMessage();
        }
        if (this._tick % 3600 === 0) {
            this._createRandomParticipant();
        }
        if (this._tick % 600 === 0) {
            this._updateRandomParticipant();
        }
        this._tick++;
    }
    _fillReplyToMessage(messages) {
        return messages.map((message) => {
            const clone = {
                ...message,
                replyToMessageUuid: undefined,
            };
            if (message.replyToMessageUuid) {
                const replyToMessage = {
                    ...this._messagesMap[message.replyToMessageUuid],
                    replyToMessageUuid: undefined,
                };
                clone.replyToMessage = replyToMessage;
            }
            return clone;
        });
    }
    _createRandomAttachment() {
        const random = Math.random();
        const config = { width: 0, height: 0 };
        if (random < 0.25) {
            config.width = 720;
            config.height = 480;
        }
        else if (random < 0.5) {
            config.width = 640;
            config.height = 120;
        }
        else if (random < 0.5) {
            config.width = 1280;
            config.height = 360;
        }
        else {
            config.width = 320;
            config.height = 320;
        }
        const attachment = {
            uuid: (0, uuid_1.v4)(),
            type: "image",
            url: faker_1.faker.image.urlLoremFlickr(config),
            width: config.width,
            height: config.height,
        };
        return attachment;
    }
    _createRandomMessage(delay = 0) {
        const authorIndex = Math.floor(Math.random() * this._participants.length);
        const author = this._participants[authorIndex];
        const message = {
            uuid: (0, uuid_1.v4)(),
            text: faker_1.faker.lorem.sentence({ min: 1, max: 40 }),
            attachments: [],
            authorUuid: author.uuid,
            reactions: [],
            sentAt: Date.now() + delay,
            updatedAt: Date.now() + delay,
        };
        if (Math.random() < 0.05) {
            const attachment = this._createRandomAttachment();
            message.attachments.push(attachment);
        }
        if (Math.random() < 0.05 && this._messages.length > 0) {
            const index = Math.floor(Math.random() * this._messages.length);
            const replyToMessage = this._messages[index];
            message.replyToMessageUuid = replyToMessage.uuid;
        }
        this._messages.push(message);
        this._messagesMap[message.uuid] = message;
    }
    _updateRandomMessage() {
        const index = Math.floor(Math.random() * this._messages.length);
        const message = this._messages[index];
        const random = Math.random();
        if (random < 0.7 || message.reactions.length >= 10) {
            message.text = faker_1.faker.lorem.sentence({ min: 1, max: 40 });
        }
        else {
            message.reactions.push({
                uuid: (0, uuid_1.v4)(),
                value: faker_1.faker.internet.emoji({ types: ["smiley", "flag", "food"] }),
            });
        }
        message.updatedAt = Date.now();
    }
    _createRandomParticipant() {
        const participant = {
            uuid: (0, uuid_1.v4)(),
            name: faker_1.faker.person.fullName(),
            bio: faker_1.faker.person.bio(),
            email: faker_1.faker.internet.email(),
            jobTitle: faker_1.faker.person.jobTitle(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            avatarUrl: faker_1.faker.image.urlLoremFlickr(),
        };
        this._participants.push(participant);
    }
    _updateRandomParticipant() {
        const index = Math.floor(Math.random() * this._participants.length);
        const participant = this._participants[index];
        const random = Math.random();
        if (random < 0.5) {
            participant.name = faker_1.faker.person.fullName();
        }
        else {
            participant.avatarUrl = faker_1.faker.image.urlLoremFlickr();
        }
        participant.updatedAt = Date.now();
    }
})();
exports.default = ChatEngine;
