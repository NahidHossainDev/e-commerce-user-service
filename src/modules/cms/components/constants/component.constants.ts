import { CmsComponentType } from '../enums/component.enum';

export interface ConfigurableField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'text' | 'html';
  required: boolean;
  defaultValue?: any;
  description?: string;
  options?: { label: string; value: any }[];
}

export interface ComponentTypeDefinition {
  type: CmsComponentType;
  label: string;
  description: string;
  configurableFields: ConfigurableField[];
}

export const COMPONENT_REGISTRY: ComponentTypeDefinition[] = [
  {
    type: CmsComponentType.HERO_SLIDER,
    label: 'Hero Slider',
    description: 'A beautiful carousel showcasing promotional slides, headings, and Call-to-Action buttons.',
    configurableFields: [
      {
        name: 'slides',
        label: 'Slides List',
        type: 'array',
        required: true,
        description: 'Array of slider items. Each slide supports title, subtitle, imageUrl, linkText, and linkUrl.',
      },
    ],
  },
  {
    type: CmsComponentType.FEATURE_ICONS,
    label: 'Feature Icons',
    description: 'A row of icons highlighting storefront selling points (e.g. Free Shipping, 24/7 Support).',
    configurableFields: [
      {
        name: 'features',
        label: 'Features List',
        type: 'array',
        required: true,
        description: 'Array of features. Each feature supports icon name, title, and description.',
      },
    ],
  },
  {
    type: CmsComponentType.PRODUCT_SECTION,
    label: 'Product Section',
    description: 'Displays products in a grid or slider with either half border or full border cards.',
    configurableFields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'string',
        required: false,
        defaultValue: 'Trending Products',
      },
      {
        name: 'productIds',
        label: 'Selected Products',
        type: 'array',
        required: true,
      },
      {
        name: 'cardType',
        label: 'Product Card Type',
        type: 'string',
        required: true,
        defaultValue: 'half_border',
        options: [
          { label: 'Half Border Card', value: 'half_border' },
          { label: 'Full Border Card', value: 'full_border' },
        ],
      },
      {
        name: 'enableSlider',
        label: 'Enable Slider View',
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    ],
  },
  {
    type: CmsComponentType.CATEGORY_GRID,
    label: 'Category Grid',
    description: 'Displays a curated list of product categories in an interactive grid.',
    configurableFields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'string',
        required: false,
        defaultValue: 'Shop by Category',
      },
      {
        name: 'categoryIds',
        label: 'Categories (External Reference IDs)',
        type: 'array',
        required: true,
        description: 'Array of Category IDs to display.',
      },
      {
        name: 'layout',
        label: 'Grid Layout Shape',
        type: 'string',
        required: false,
        defaultValue: 'circle',
        options: [
          { label: 'Circular Icons', value: 'circle' },
          { label: 'Square Cards', value: 'square' },
        ],
      },
    ],
  },
  {
    type: CmsComponentType.PROMO_BANNER,
    label: 'Promo Banner',
    description: 'A static banner showcasing active campaigns or seasonal discounts.',
    configurableFields: [
      {
        name: 'imageUrl',
        label: 'Banner Image URL',
        type: 'string',
        required: true,
      },
      {
        name: 'altText',
        label: 'Alternative Access Text',
        type: 'string',
        required: false,
      },
      {
        name: 'linkUrl',
        label: 'Redirect Link URL',
        type: 'string',
        required: false,
      },
      {
        name: 'discountText',
        label: 'Overlaid Discount Text',
        type: 'string',
        required: false,
      },
    ],
  },
  {
    type: CmsComponentType.IMAGE_GRID,
    label: 'Image Grid / Carousel',
    description: 'Renders partner logos, image banners, or vendor badges in a custom responsive grid or slider.',
    configurableFields: [
      {
        name: 'images',
        label: 'Images List',
        type: 'array',
        required: true,
        description: 'Array of image items. Each item supports image file, altText, label, and redirect link.',
      },
    ],
  },
  {
    type: CmsComponentType.BLOG_GRID,
    label: 'Blog Grid',
    description: 'Renders latest articles or selected blog posts for customer engagement.',
    configurableFields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'string',
        required: false,
        defaultValue: 'Latest from our Blog',
      },
      {
        name: 'limit',
        label: 'Max Articles',
        type: 'number',
        required: true,
        defaultValue: 3,
      },
      {
        name: 'blogIds',
        label: 'Specific Blogs (Optional References)',
        type: 'array',
        required: false,
      },
    ],
  },
  {
    type: CmsComponentType.VIDEO_SECTION,
    label: 'Video Section',
    description: 'Embeds a video (YouTube/Vimeo/Direct link) with custom text overlay.',
    configurableFields: [
      {
        name: 'videoUrl',
        label: 'Video URL',
        type: 'string',
        required: true,
      },
      {
        name: 'title',
        label: 'Video Section Overlay Title',
        type: 'string',
        required: false,
      },
      {
        name: 'description',
        label: 'Short Description text',
        type: 'text',
        required: false,
      },
      {
        name: 'autoplay',
        label: 'Autoplay Video',
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    ],
  },
  {
    type: CmsComponentType.TESTIMONIALS,
    label: 'Testimonials',
    description: 'Displays customer feedback, star ratings, and buyer quotes.',
    configurableFields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'string',
        required: false,
        defaultValue: 'What our customers say',
      },
      {
        name: 'testimonials',
        label: 'Customer Quotes list',
        type: 'array',
        required: true,
        description: 'List containing author name, star rating (1-5), quote text, and avatar URL.',
      },
    ],
  },
  {
    type: CmsComponentType.RICH_TEXT,
    label: 'Rich Text',
    description: 'A customizable rich text content block for custom descriptions or informational content.',
    configurableFields: [
      {
        name: 'content',
        label: 'Rich Text / WYSIWYG HTML Content',
        type: 'html',
        required: true,
      },
    ],
  },
  {
    type: CmsComponentType.CUSTOM_HTML,
    label: 'Custom HTML',
    description: 'A raw HTML block for advanced code snippets, forms, embeds or special layouts.',
    configurableFields: [
      {
        name: 'html',
        label: 'Raw HTML Code',
        type: 'html',
        required: true,
      },
    ],
  },
];
