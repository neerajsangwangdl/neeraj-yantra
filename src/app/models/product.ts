import { Attribute } from "./attribute";

export class Product {
    ProductId: number;
    CategoryId: number;
    CanSeeRole: number;
    stock: number;
    DepartmentId: number;
    DepartmentName: string;
    CategoryName: string;
    Name: string;
    Description: string;
    PrimaryImage: string;
    SecondaryImage: string;
    Thumbnail: string;
    Display: number;
    Price: number;
    Quantity: number;
    min_quantity: number;
    max_quantity: number;
    DiscountPercentage: number;
    ProductCount: number;
    Color: Attribute[];
    Size: Attribute[];
}
