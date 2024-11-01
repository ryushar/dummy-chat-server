import { v4 } from "uuid";
import { faker } from "@faker-js/faker";

const ChatEngine = new (class {
  private _sessionUuid: string;
  private _participants: TParticipant[];
  private _messages: TMessage[];
  private _messagesMap: Record<string, TMessage>;
  private _mainParticipant: TParticipant;
  private _tick: number;
  private _loop: NodeJS.Timeout | null;

  constructor() {
    this._sessionUuid = v4();
    this._participants = [];
    this._messages = [];
    this._messagesMap = {};
    this._mainParticipant = {
      uuid: "you",
      name: "You",
      bio: faker.person.bio(),
      email: faker.internet.email(),
      jobTitle: faker.person.jobTitle(),
      avatarUrl: faker.image.urlLoremFlickr(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this._tick = 0;
    this._loop = null;
  }

  start(): void {
    this._loop = setInterval(this._main.bind(this), 1e3);
  }

  stop(): void {
    if (this._loop === null) return;
    clearInterval(this._loop);
    this._loop = null;
  }

  setup(): void {
    for (let i = 0; i < 5; i++) {
      this._createRandomParticipant();
    }

    for (let i = 0; i < 50; i++) {
      this._createRandomMessage(i);
    }
  }

  getSessionUuid(): string {
    return this._sessionUuid;
  }

  getAllParticipants(): TParticipant[] {
    const participants = [this._mainParticipant, ...this._participants];
    return participants;
  }

  getParticipantUpdates(time: number): TParticipant[] {
    const participants = [this._mainParticipant, ...this._participants];
    return participants.filter((p) => p.updatedAt >= time);
  }

  getAllMessages(): TMessageJSON[] {
    return this._fillReplyToMessage(this._messages);
  }

  getLatestMessages(): TMessageJSON[] {
    const messages = this._messages.slice(this._messages.length - 25);
    return this._fillReplyToMessage(messages);
  }

  getMessageUpdates(time: number): TMessage[] {
    const messages = this._messages.filter((m) => m.updatedAt >= time);
    return this._fillReplyToMessage(messages);
  }

  getOlderMessages(messageUuid: string): TMessage[] {
    const index = this._messages.findIndex((m) => m.uuid === messageUuid);
    const endIndex = Math.max(0, index);
    const startIndex = Math.max(0, endIndex - 25);
    const messages = this._messages.slice(startIndex, endIndex);
    return this._fillReplyToMessage(messages);
  }

  addNewMessage(text: string): TMessage {
    const message: TMessage = {
      uuid: v4(),
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

  private _main(): void {
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

  private _fillReplyToMessage(messages: TMessage[]): TMessageJSON[] {
    return messages.map((message) => {
      const clone = {
        ...message,
        replyToMessageUuid: undefined,
      } as TMessageJSON;
      if (message.replyToMessageUuid) {
        const replyToMessage = {
          ...this._messagesMap[message.replyToMessageUuid],
          replyToMessageUuid: undefined,
        } as TMessageJSON;
        clone.replyToMessage = replyToMessage;
      }
      return clone;
    });
  }

  private _createRandomAttachment(): TMessageAttachment {
    const random = Math.random();
    const config = { width: 0, height: 0 };

    if (random < 0.25) {
      config.width = 720;
      config.height = 480;
    } else if (random < 0.5) {
      config.width = 640;
      config.height = 120;
    } else if (random < 0.5) {
      config.width = 1280;
      config.height = 360;
    } else {
      config.width = 320;
      config.height = 320;
    }

    const attachment: TMessageAttachment = {
      uuid: v4(),
      type: "image",
      url: faker.image.urlLoremFlickr(config),
      width: config.width,
      height: config.height,
    };

    return attachment;
  }

  private _createRandomMessage(delay = 0): void {
    const authorIndex = Math.floor(Math.random() * this._participants.length);
    const author = this._participants[authorIndex];

    const message: TMessage = {
      uuid: v4(),
      text: faker.lorem.sentence({ min: 1, max: 40 }),
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

  private _updateRandomMessage(): void {
    const index = Math.floor(Math.random() * this._messages.length);
    const message = this._messages[index];
    const random = Math.random();

    if (random < 0.7 || message.reactions.length >= 10) {
      message.text = faker.lorem.sentence({ min: 1, max: 40 });
    } else {
      const index = Math.floor(Math.random() * this._participants.length);
      const participant = this._participants[index];
      message.reactions.push({
        uuid: v4(),
        participantUuid: participant.uuid,
        value: faker.internet.emoji({ types: ["smiley", "flag", "food"] }),
      });
    }

    message.updatedAt = Date.now();
  }

  private _createRandomParticipant(): void {
    const participant: TParticipant = {
      uuid: v4(),
      name: faker.person.fullName(),
      bio: faker.person.bio(),
      email: faker.internet.email(),
      jobTitle: faker.person.jobTitle(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      avatarUrl: faker.image.urlLoremFlickr(),
    };
    this._participants.push(participant);
  }

  private _updateRandomParticipant(): void {
    const index = Math.floor(Math.random() * this._participants.length);
    const participant = this._participants[index];
    const random = Math.random();

    if (random < 0.5) {
      participant.name = faker.person.fullName();
    } else {
      participant.avatarUrl = faker.image.urlLoremFlickr();
    }

    participant.updatedAt = Date.now();
  }
})();

export default ChatEngine;
