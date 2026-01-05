import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ImageAttachedEvent,
  ImageDetachedEvent,
  MediaEvent,
} from 'src/common/events/media.events';
import { MediaService } from '../media.service';

@Injectable()
export class MediaListener {
  constructor(private readonly mediaService: MediaService) {}

  @OnEvent(MediaEvent.IMAGE_ATTACHED, { async: true })
  async handleImageAttached(event: ImageAttachedEvent) {
    await this.mediaService.attachImage(event);
  }

  @OnEvent(MediaEvent.IMAGE_DETACHED, { async: true })
  async handleImageDetached(event: ImageDetachedEvent) {
    await this.mediaService.detachImage(event);
  }
}
