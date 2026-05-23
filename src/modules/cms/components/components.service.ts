import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CmsComponentsRepository } from './components.repository';
import { CreateCmsComponentDto, ReorderComponentsDto, UpdateCmsComponentDto } from './dto/component.dto';
import { CmsComponentDocument } from './schemas/component.schema';
import { ComponentValidationService } from './validation.service';

@Injectable()
export class CmsComponentsService {
  constructor(
    private readonly componentsRepository: CmsComponentsRepository,
    private readonly validationService: ComponentValidationService,
  ) {}

  async create(
    pageId: string,
    dto: CreateCmsComponentDto,
    session?: ClientSession,
  ): Promise<CmsComponentDocument> {
    // 1. Dynamic Payload Validation based on Component Type
    const validatedData = await this.validationService.validateData(
      dto.componentType,
      dto.data,
    );
    dto.data = validatedData;

    // 2. Persist in DB
    return await this.componentsRepository.create(pageId, dto, session);
  }

  async findOne(id: string): Promise<CmsComponentDocument> {
    const component = await this.componentsRepository.findById(id);
    if (!component) {
      throw new NotFoundException(`CMS Component with ID ${id} not found`);
    }
    return component;
  }

  async findByPageId(pageId: string, filterVisible = false): Promise<CmsComponentDocument[]> {
    return await this.componentsRepository.findByPageId(pageId, filterVisible);
  }

  async update(
    id: string,
    dto: UpdateCmsComponentDto,
    session?: ClientSession,
  ): Promise<CmsComponentDocument> {
    const existing = await this.findOne(id);

    // If data payload is updated, dynamically validate it
    if (dto.data) {
      const type = dto.componentType || existing.componentType;
      const validatedData = await this.validationService.validateData(type, dto.data);
      dto.data = validatedData;
    }

    return await this.componentsRepository.update(id, dto, session);
  }

  async remove(id: string, session?: ClientSession): Promise<CmsComponentDocument> {
    return await this.componentsRepository.delete(id, session);
  }

  async removeByPageId(pageId: string, session?: ClientSession): Promise<void> {
    await this.componentsRepository.deleteByPageId(pageId, session);
  }

  async reorder(dto: ReorderComponentsDto, session?: ClientSession): Promise<void> {
    await this.componentsRepository.reorder(dto.components, session);
  }

  async duplicateComponent(id: string, session?: ClientSession): Promise<CmsComponentDocument> {
    const source = await this.findOne(id);
    
    // Create cloned component incrementing order index by 1
    const createDto: CreateCmsComponentDto = {
      componentType: source.componentType,
      order: source.order + 1,
      isVisible: source.isVisible,
      settings: source.settings,
      data: source.data,
    };

    return await this.componentsRepository.create(
      source.pageId.toString(),
      createDto,
      session,
    );
  }

  async cloneComponentsForPage(
    sourcePageId: string,
    targetPageId: string,
    session?: ClientSession,
  ): Promise<CmsComponentDocument[]> {
    return await this.componentsRepository.cloneComponents(
      sourcePageId,
      targetPageId,
      session,
    );
  }
}
