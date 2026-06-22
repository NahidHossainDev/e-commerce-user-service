import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { createSlug } from 'src/utils/helpers/slug.helper';
import { CmsComponentsService } from '../components/components.service';
import { CmsPageStatus, CmsPageType } from './enums/page.enum';
import { CreateCmsPageDto, QueryCmsPageDto, UpdateCmsPageDto } from './dto/page.dto';
import { CmsPagesRepository } from './pages.repository';
import { CmsPageDocument } from './schemas/page.schema';

@Injectable()
export class CmsPagesService {
  constructor(
    private readonly pagesRepository: CmsPagesRepository,
    private readonly componentsService: CmsComponentsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(dto: CreateCmsPageDto): Promise<CmsPageDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 1. Generate & normalize slug
      const slug = dto.slug ? createSlug(dto.slug) : createSlug(dto.title);
      const existing = await this.pagesRepository.findBySlug(slug);
      if (existing) {
        throw new ConflictException(`CMS Page with slug '${slug}' already exists`);
      }

      const page = await this.pagesRepository.create({ ...dto, slug }, session);

      // 2. Enforce only one home page
      if (dto.isHomePage) {
        await this.pagesRepository.unsetHomePage((page._id as any).toString(), session);
      }

      await session.commitTransaction();
      return page;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findOne(id: string): Promise<CmsPageDocument> {
    const page = await this.pagesRepository.findById(id);
    if (!page) {
      throw new NotFoundException(`CMS Page with ID ${id} not found`);
    }
    return page;
  }

  async findOneBySlug(slug: string): Promise<CmsPageDocument> {
    const page = await this.pagesRepository.findBySlug(slug);
    if (!page) {
      throw new NotFoundException(`CMS Page with slug '${slug}' not found`);
    }
    return page;
  }

  async getPageForStorefront(slug?: string, previewToken?: string): Promise<any> {
    let page: CmsPageDocument | null = null;

    if (!slug) {
      page = await this.pagesRepository.findHomePage();
      if (!page) {
        throw new NotFoundException('Homepage not found');
      }
    } else {
      if (slug.toLowerCase() === 'home' || slug.toLowerCase() === 'homepage') {
        page = await this.pagesRepository.findHomePage();
      }
      if (!page) {
        page = await this.pagesRepository.findBySlug(slug);
      }
      if (!page) {
        throw new NotFoundException(`CMS Page with slug '${slug}' not found`);
      }
    }

    // If page is draft, allow loading ONLY if preview token matches
    if (page.status === CmsPageStatus.DRAFT) {
      const isValidToken = previewToken && this.validatePreviewToken((page._id as any).toString(), previewToken);
      if (!isValidToken) {
        throw new NotFoundException(
          `CMS Page ${slug ? `with slug '${slug}' ` : ''}not found`,
        );
      }
    }

    // Load page components (filter out hidden ones, sort by order ASC)
    const components = await this.componentsService.findByPageId((page._id as any).toString(), true);

    return {
      page: {
        id: page._id,
        title: page.title,
        slug: page.slug,
        seo: page.seo,
        components,
      },
    };
  }

  async getAdminPageDetails(id: string): Promise<any> {
    const page = await this.findOne(id);
    const components = await this.componentsService.findByPageId((page._id as any).toString(), false);
    return {
      ...page.toObject(),
      components,
      previewToken: this.generatePreviewToken((page._id as any).toString()),
    };
  }

  async findAll(queryDto: QueryCmsPageDto): Promise<IPaginatedResponse<CmsPageDocument>> {
    return await this.pagesRepository.findAll(queryDto);
  }

  async update(id: string, dto: UpdateCmsPageDto): Promise<CmsPageDocument> {
    const page = await this.findOne(id);
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // SYSTEM Pages lock check
      if (page.type === CmsPageType.SYSTEM) {
        if (dto.slug && createSlug(dto.slug) !== page.slug) {
          throw new BadRequestException('Cannot change the slug of a protected SYSTEM page');
        }
      }

      // Check unique slug on rename
      let slug = page.slug;
      if (dto.slug && createSlug(dto.slug) !== page.slug) {
        slug = createSlug(dto.slug);
        const existing = await this.pagesRepository.findBySlug(slug);
        if (existing) {
          throw new ConflictException(`CMS Page with slug '${slug}' already exists`);
        }
      } else if (dto.title && !dto.slug && page.type !== CmsPageType.SYSTEM) {
        // Only regenerate slug from title if not custom slug and not SYSTEM page
        slug = createSlug(dto.title);
        const existing = await this.pagesRepository.findBySlug(slug);
        if (existing && (existing._id as any).toString() !== id) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }
      }

      const updated = await this.pagesRepository.update(id, { ...dto, slug }, session);

      // Homepage exclusivity sync
      if (dto.isHomePage) {
        await this.pagesRepository.unsetHomePage(id, session);
      }

      await session.commitTransaction();
      return updated;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async remove(id: string): Promise<void> {
    const page = await this.findOne(id);

    // Business Rules Protections
    if (page.isHomePage) {
      throw new BadRequestException('The home page is protected and cannot be deleted');
    }
    if (page.type === CmsPageType.SYSTEM) {
      throw new BadRequestException('SYSTEM pages are protected and cannot be deleted');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 1. Delete Page
      await this.pagesRepository.delete(id, session);

      // 2. Cascade delete all child components
      await this.componentsService.removeByPageId(id, session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async duplicatePage(id: string): Promise<CmsPageDocument> {
    const sourcePage = await this.findOne(id);
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 1. Generate unique slug for the cloned page
      let slug = `${sourcePage.slug}-copy`;
      let count = 1;
      while (await this.pagesRepository.findBySlug(slug)) {
        slug = `${sourcePage.slug}-copy-${count}`;
        count++;
      }

      // 2. Create the copy of CmsPage in DRAFT mode
      const clonedPage = await this.pagesRepository.create(
        {
          title: `${sourcePage.title} (Copy)`,
          slug,
          type: CmsPageType.CUSTOM,
          status: CmsPageStatus.DRAFT,
          isHomePage: false,
          seo: sourcePage.seo,
        },
        session,
      );

      // 3. Clone all component associations
      const clonedComponents = await this.componentsService.cloneComponentsForPage(
        (sourcePage._id as any).toString(),
        (clonedPage._id as any).toString(),
        session,
      );

      // 4. Update the cloned page with component references
      const componentIds = clonedComponents.map((c) => c._id as any);
      const updatedClonedPage = await this.pagesRepository.update(
        (clonedPage._id as any).toString(),
        { componentIds } as any,
        session,
      );

      await session.commitTransaction();
      return updatedClonedPage;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  // ================= PREVIEW TOKEN SYSTEM =================

  generatePreviewToken(pageId: string): string {
    const secret = 'CMS-PREVIEW-SYSTEM-SECRET-KEY';
    return Buffer.from(`${pageId}:${secret}`).toString('base64');
  }

  validatePreviewToken(pageId: string, token: string): boolean {
    return token === this.generatePreviewToken(pageId);
  }
}
