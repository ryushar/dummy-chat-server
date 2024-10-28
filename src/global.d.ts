type TMessageAttachment = {
  uuid: string;
  type: "image";
  url: string;
  width: number;
  height: number;
};

type TReaction = {
  uuid: string;
  value: string;
};

type TParticipant = {
  uuid: string;
  name: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
};

type TMessage = {
  uuid: string;
  text: string;
  attachments: TMessageAttachment[];
  replyToMessageUuid?: string;
  reactions: TReaction[];
  authorUuid: string;
  sentAt: number;
  updatedAt: number;
};

type TMessageJSON = Omit<TMessage, "replyToMessageUuid"> & {
  replyToMessage?: Omit<TMessage, "replyToMessageUuid">;
};
