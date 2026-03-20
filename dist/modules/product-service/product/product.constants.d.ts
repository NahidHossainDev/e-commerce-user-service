import { ProductQueryDto } from './dto/product-query-options.dto';
export declare const PRODUCT_FILTER_FIELDS: (keyof ProductQueryDto)[];
export declare const PRODUCT_SEARCH_FIELDS: string[];
export declare const PRODUCT_SORT_OPTIONS: {
    NEWEST: {
        createdAt: number;
    };
    OLDEST: {
        createdAt: number;
    };
    PRICE_LOW_HIGH: {
        'price.basePrice': number;
    };
    PRICE_HIGH_LOW: {
        'price.basePrice': number;
    };
    RATING_HIGH_LOW: {
        averageRating: number;
    };
    SALES_HIGH_LOW: {
        salesCount: number;
    };
    TITLE_ASC: {
        title: number;
    };
    TITLE_DESC: {
        title: number;
    };
};
