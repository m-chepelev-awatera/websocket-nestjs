import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';

import { BaseObjectIdDto } from '@lib/dto/base-object-id.dto';
import { MessageDomainModel } from '@chats/domain-models/message.domain-model';
import { MessageType } from '@chats/schemas/message.schema';

class AuthorDto {
  @Expose()
  name: string;

  @Expose()
  nameEn: string;

  @Expose()
  userId: Types.ObjectId;
}

export class ResponseMessageDto extends BaseObjectIdDto<MessageDomainModel> {
  constructor(model: MessageDomainModel) {
    super(model);
    this.conversationId = model.conversationId;
    this.type = model.type;
    this.text = model.text;
    this.files = model.files;
    this.replyToId = model.replyToId;
    this.author = model.author;
    this.edited = model.edited;
  }

  @Expose()
  readonly conversationId: Types.ObjectId;

  @Expose()
  readonly type: MessageType;

  @Expose()
  readonly text: string;

  @Expose()
  readonly files: unknown[];

  @Expose()
  readonly replyToId?: Types.ObjectId;

  @Expose()
  @Type(() => AuthorDto)
  readonly author?: AuthorDto;

  @Expose()
  readonly edited?: boolean;
}
