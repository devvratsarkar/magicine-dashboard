import { stripHtml } from "string-strip-html";
import { useGetBrandQuery } from "../redux/features/catalogueEndPoints";
import { API_BASE_URL, MEDIA_BASE_URL, USER_BASE_URL } from "../utils/config";

export const generateSchemaMarkup = (product) => {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product ? product.product_name : "",
        "image": product ? product.featured_image : "",
        "description": product && product?.long_description ? stripHtml(product?.long_description).result : "",
        "url": product && product.slug ? `${USER_BASE_URL}product/general-product/${product.slug}` : "",
        "category": Array.isArray(product?.category) ? product.category.map(cat => cat.label).join(', ') : "",
        "manufacturer": {
            "@type": "Organization",
            "name": product ? product.marketer : "",
        },
        "brand": {
            "@type": "Brand",
            "name": product ? product.brand : ""
        },
        "weight": {
            "@type": "QuantitativeValue",
            "value": product ? product.weight : "",
            "unitCode": "GRM"
        },
        "height": {
            "@type": "QuantitativeValue",
            "value": product ? product.height : "",
            "unitCode": "CMT"
        },
        "width": {
            "@type": "QuantitativeValue",
            "value": product ? product.width : "",
            "unitCode": "CMT"
        },
        "depth": {
            "@type": "QuantitativeValue",
            "value": product ? product.length : "",
            "unitCode": "CMT"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": "",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 0,
            "reviewCount": 0
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${USER_BASE_URL}`
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": product ? product.product_name : "Product",
                    "item": product && product.slug ? `${USER_BASE_URL}product/general-product/${product.slug}` : ""
                }
            ]
        }
    };

    return JSON.stringify(schema, null, 2);
};


export const generateSchemaMarkupMedicine = (product) => {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product ? product.product_name : "",
        "image": product ? product.featured_image : "",
        "description": product && product?.short_description ? stripHtml(product?.short_description).result : "",
        "url": product && product.slug ? `${USER_BASE_URL}${product ? product?.selected_form : ""}/${product.slug}` : "",
        "category": Array.isArray(product?.category) ? product.category.map(cat => cat.label).join(', ') : "",
        "manufacturer": {
            "@type": "Organization",
            "name": product ? product.marketer : "",
        },
        "brand": {
            "@type": "Brand",
            "name": product ? product.brand : ""
        },
        "weight": {
            "@type": "QuantitativeValue",
            "value": product ? product.weight : "",
            "unitCode": "GRM"
        },
        "height": {
            "@type": "QuantitativeValue",
            "value": product ? product.height : "",
            "unitCode": "CMT"
        },
        "width": {
            "@type": "QuantitativeValue",
            "value": product ? product.width : "",
            "unitCode": "CMT"
        },
        "depth": {
            "@type": "QuantitativeValue",
            "value": product ? product.length : "",
            "unitCode": "CMT"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": "",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 0,
            "reviewCount": 0
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${USER_BASE_URL}`
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": product ? product.product_name : "Product",
                    "item": product && product.slug ? `${USER_BASE_URL}${product ? product?.selected_form : ""}/${product.slug}` : ""
                }
            ]
        }
    };

    return JSON.stringify(schema, null, 2);
};


export const generateSchemaMarkupDurgicalEquipment = (product) => {

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product ? product.product_name : "",
        "image": product ? product.featured_image : "",
        "description": product && product?.description && product?.description?.content ? stripHtml(product?.description?.content).result : "",
        "url": product && product.slug ? `${USER_BASE_URL}product/surgical-equipments/${product.slug}` : null,
        "manufacturer": {
            "@type": "Organization",
            "name": product ? product.marketer : "",
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": "",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 0,
            "reviewCount": 0
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${USER_BASE_URL}`
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": product ? product.product_name : "Product",
                    "item": product && product.slug ? `${USER_BASE_URL}product/surgical-equipments/${product.slug}` : null
                }
            ]
        }
    };

    return JSON.stringify(schema, null, 2);
};


export const generateCategorySchemaMarkup = (categoryData) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Category",
        "name": categoryData?.category_name || "",
        "description": categoryData?.long_description && stripHtml(categoryData?.long_description).result || "",
        "url": `${USER_BASE_URL}categories/${categoryData?.slug || ""}`,
        "image": categoryData ? categoryData?.thumbnail_image : "",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${USER_BASE_URL}`
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Categories",
                    "item": `${USER_BASE_URL}`
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": categoryData?.name || "Category",
                    "item": `${USER_BASE_URL}categories/${categoryData?.slug || ""}`
                }
            ]

        },
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "Product",
                    "name": "",
                    "image": "",
                    "url": "",
                    "description": "",
                    "sku": "",
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "",
                        "price": "",
                        "availability": ""
                    }
                },

            ]
        }
    };

    return JSON.stringify(schema, null, 2);
};

export const generateBrandSchemaMarkup = (brandData) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": brandData?.brand_name || "",
        "logo": brandData.featured_image || "",
        "url": `${USER_BASE_URL}brands/${brandData.slug}` || "",
        "sameAs": [
            "https://www.instagram.com",
            "https://www.facebook.com",
            "https://www.twitter.com"
        ],
        "description": brandData && brandData.short_description ? stripHtml(brandData.short_description).result : "",
        "founder": {
            "@type": "",
            "name": ""
        },
        "foundingDate": "",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "",
            "contactType": "Customer Service"
        }
    }


    return JSON.stringify(schema, null, 2);
};
