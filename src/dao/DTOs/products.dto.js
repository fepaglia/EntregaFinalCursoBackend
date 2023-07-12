export default class ProductsDto {
    constructor(product) {
        this.title = product.title;
        this.price = product.price;
        this.thumbnail = product.thumbnail;
        this.category = product.category;
        this.stock = product.stock;
    }
};