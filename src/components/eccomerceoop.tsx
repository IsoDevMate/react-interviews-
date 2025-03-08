// ==========================================================
// TYPESCRIPT OOP CONCEPTS: E-COMMERCE SYSTEM
// ==========================================================

// ---------------- ABSTRACT CLASSES AND METHODS ----------------

/**
 * Abstract Product class that defines the common structure
 * for all products in our system
 */
abstract class Product {
  // Protected properties - accessible by this class and subclasses
  protected _id: string;

  // Readonly properties - can only be set once (in constructor)
  readonly createdAt: Date;

  constructor(
    protected _name: string,
    protected _price: number,
    protected _description: string
  ) {
    this._id = Math.random().toString(36).substring(2, 9);
    this.createdAt = new Date();
  }

  // Getters - allow controlled access to properties
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  // Setters - allow controlled modification of properties
  set price(newPrice: number) {
    if (newPrice <= 0) {
      throw new Error("Price must be greater than zero");
    }
    this._price = newPrice;
  }

  // Abstract method - must be implemented by subclasses
  abstract calculateTax(): number;

  // Regular method - inherited by all subclasses
  display(): string {
    return `${this._name} - $${this._price}`;
  }
}

// ---------------- INTERFACES ----------------

/**
 * Interfaces define contracts that classes can implement
 */
interface Discountable {
  applyDiscount(percentage: number): void;
  getDiscountedPrice(): number;
}

interface Shippable {
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  calculateShippingCost(distance: number): number;
}

// ---------------- IMPLEMENTATION CLASSES ----------------

/**
 * Physical product that implements both interfaces
 * and extends the abstract Product class
 */
class PhysicalProduct extends Product implements Discountable, Shippable {
  private _discountPercentage: number = 0;

  constructor(
    name: string,
    price: number,
    description: string,
    public weight: number,
    public dimensions: {
      width: number;
      height: number;
      depth: number;
    },
    private _stockCount: number
  ) {
    // Call parent constructor with super
    super(name, price, description);
  }

  // Implement abstract method from Product
  calculateTax(): number {
    // Physical products have 10% tax
    return this._price * 0.1;
  }

  // Implement method from Discountable interface
  applyDiscount(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Discount percentage must be between 0 and 100");
    }
    this._discountPercentage = percentage;
  }

  // Implement method from Discountable interface
  getDiscountedPrice(): number {
    return this._price * (1 - this._discountPercentage / 100);
  }

  // Implement method from Shippable interface
  calculateShippingCost(distance: number): number {
    // Base shipping cost calculation using weight and distance
    const baseCost = this.weight * 0.1 * distance / 100;

    // Additional cost for larger items
    const volume = this.dimensions.width * this.dimensions.height * this.dimensions.depth;
    const additionalCost = volume > 1000 ? 10 : 0;

    return baseCost + additionalCost;
  }

  // Method specific to PhysicalProduct
  decreaseStock(quantity: number): void {
    if (quantity > this._stockCount) {
      throw new Error("Not enough stock available");
    }
    this._stockCount -= quantity;
  }

  get stockCount(): number {
    return this._stockCount;
  }
}

/**
 * Digital product that only implements Discountable
 */
class DigitalProduct extends Product implements Discountable {
  private _discountPercentage: number = 0;

  constructor(
    name: string,
    price: number,
    description: string,
    private _downloadSize: number,
    private _licenseType: 'personal' | 'commercial'
  ) {
    super(name, price, description);
  }

  // Implement abstract method from Product
  calculateTax(): number {
    // Digital products have 5% tax
    return this._price * 0.05;
  }

  // Implement method from Discountable interface
  applyDiscount(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Discount percentage must be between 0 and 100");
    }
    this._discountPercentage = percentage;
  }

  // Implement method from Discountable interface
  getDiscountedPrice(): number {
    return this._price * (1 - this._discountPercentage / 100);
  }

  // Method specific to DigitalProduct
  generateDownloadLink(): string {
    return `https://example.com/download/${this._id}`;
  }

  get downloadSize(): number {
    return this._downloadSize;
  }

  get licenseType(): 'personal' | 'commercial' {
    return this._licenseType;
  }
}

// ---------------- STATIC METHODS AND PROPERTIES ----------------

/**
 * Cart class with static methods and properties
 */
class Cart {
  // Private static property
  private static readonly TAX_RATE: number = 0.1;

  // Private instance property
  private _items: Product[] = [];

  // Static method - can be called without instantiating the class
  static calculateTotalPrice(products: Product[]): number {
    return products.reduce((total, product) => total + product.price, 0);
  }

  // Static method with static property usage
  static applyTaxToPrice(price: number): number {
    return price * (1 + Cart.TAX_RATE);
  }

  // Instance methods
  addItem(product: Product): void {
    this._items.push(product);
  }

  removeItem(productId: string): void {
    const index = this._items.findIndex(item => item.id === productId);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  get items(): Product[] {
    // Return a copy to prevent direct modification
    return [...this._items];
  }

  calculateTotal(): number {
    return this._items.reduce((total, item) => {
      // Add price and tax for each item
      return total + item.price + item.calculateTax();
    }, 0);
  }
}

// ---------------- SINGLETON PATTERN ----------------

/**
 * Inventory class implemented as a Singleton
 */
class Inventory {
  private static instance: Inventory | null = null;
  private _products: Map<string, Product> = new Map();

  // Private constructor prevents direct instantiation
  private constructor() {}

  // Static method to get the single instance
  static getInstance(): Inventory {
    if (!Inventory.instance) {
      Inventory.instance = new Inventory();
    }
    return Inventory.instance;
  }

  addProduct(product: Product): void {
    this._products.set(product.id, product);
  }

  getProduct(id: string): Product | undefined {
    return this._products.get(id);
  }

  getAllProducts(): Product[] {
    return Array.from(this._products.values());
  }

  searchProducts(keyword: string): Product[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.getAllProducts().filter(product =>
      product.name.toLowerCase().includes(lowerKeyword)
    );
  }
}

// ---------------- FACTORY PATTERN ----------------

/**
 * ProductFactory - Creates different types of products
 */
class ProductFactory {
  static createPhysicalProduct(
    name: string,
    price: number,
    description: string,
    weight: number,
    dimensions: { width: number; height: number; depth: number },
    stockCount: number
  ): PhysicalProduct {
    return new PhysicalProduct(
      name,
      price,
      description,
      weight,
      dimensions,
      stockCount
    );
  }

  static createDigitalProduct(
    name: string,
    price: number,
    description: string,
    downloadSize: number,
    licenseType: 'personal' | 'commercial'
  ): DigitalProduct {
    return new DigitalProduct(
      name,
      price,
      description,
      downloadSize,
      licenseType
    );
  }
}

// ---------------- USAGE EXAMPLE ----------------

// Create an inventory (Singleton)
const inventory = Inventory.getInstance();

// Use factory to create products
const laptop = ProductFactory.createPhysicalProduct(
  "MacBook Pro",
  1999.99,
  "Powerful laptop for professionals",
  2.1, // weight in kg
  { width: 30.41, height: 1.62, depth: 21.24 }, // cm
  100 // stock count
);

const ebook = ProductFactory.createDigitalProduct(
  "TypeScript Deep Dive",
  29.99,
  "Comprehensive guide to TypeScript",
  15.4, // MB
  "personal" // license type
);

// Add products to inventory
inventory.addProduct(laptop);
inventory.addProduct(ebook);

// Apply discounts
laptop.applyDiscount(10); // 10% off
ebook.applyDiscount(25); // 25% off

// Create a shopping cart
const cart = new Cart();
cart.addItem(laptop);
cart.addItem(ebook);

// Calculate costs
console.log(`Total cart price: $${cart.calculateTotal().toFixed(2)}`);
console.log(`Laptop discounted price: $${laptop.getDiscountedPrice().toFixed(2)}`);
console.log(`Shipping cost for laptop: $${laptop.calculateShippingCost(500).toFixed(2)}`);

// Use static methods
console.log(`Total price without tax: $${Cart.calculateTotalPrice(cart.items).toFixed(2)}`);
console.log(`Price with tax applied: $${Cart.applyTaxToPrice(2000).toFixed(2)}`);
