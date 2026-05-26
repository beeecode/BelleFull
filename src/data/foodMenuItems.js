import { projectDetails } from './projectDetails';

const imageCycle = [
  projectDetails.visualAssets.dishOne,
  projectDetails.visualAssets.dishThree,
  projectDetails.visualAssets.dishFive,
  projectDetails.visualAssets.dishFour,
];

export const foodCategories = [
  'All',
  'Cheesy Pizza',
  'Jollof Rice',
  'Fried Rice',
  'Pasta',
  'Shawarma',
  'Barbecue',
  'Pepper Soup',
  'Chicken and Chips',
  'Fish Pepper Soup',
  'Small Chops',
  'Burger',
  'Parfait',
  'Moimoi',
];

export const foodMenuItems = [
  {
    id: 'cheesy-pizza',
    name: 'Cheesy Pizza',
    category: 'Cheesy Pizza',
    price: 6500,
    description: 'Cheesy pizza made for sharing and cravings.',
  },
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    category: 'Jollof Rice',
    price: 3000,
    description: 'Smoky Nigerian jollof rice with rich pepper flavor.',
  },
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    category: 'Fried Rice',
    price: 3200,
    description: 'Colorful fried rice with vegetables and seasoning.',
  },
  {
    id: 'pasta',
    name: 'Pasta',
    category: 'Pasta',
    price: 3500,
    description: 'Soft pasta tossed in bold Amazing Taste sauce.',
  },
  {
    id: 'shawarma',
    name: 'Shawarma',
    category: 'Shawarma',
    price: 2800,
    description: 'Toasted wrap filled with chicken and creamy sauce.',
  },
  {
    id: 'barbecue',
    name: 'Barbecue',
    category: 'Barbecue',
    price: 4500,
    description: 'Smoky grilled barbecue with a saucy seasoned finish.',
  },
  {
    id: 'pepper-soup',
    name: 'Pepper Soup',
    category: 'Pepper Soup',
    price: 3500,
    description: 'Warm pepper soup with local spice and bold aroma.',
  },
  {
    id: 'chicken-and-chips',
    name: 'Chicken and Chips',
    category: 'Chicken and Chips',
    price: 5000,
    description: 'Crispy chicken served with golden chips.',
  },
  {
    id: 'fish-pepper-soup',
    name: 'Fish Pepper Soup',
    category: 'Fish Pepper Soup',
    price: 5000,
    description: 'Fresh fish pepper soup with rich local spice.',
  },
  {
    id: 'small-chops',
    name: 'Small Chops',
    category: 'Small Chops',
    price: 2500,
    description: 'Party-ready small chops with a tasty mix of bites.',
  },
  {
    id: 'burger',
    name: 'Burger',
    category: 'Burger',
    price: 3200,
    description: 'Soft bun, savory filling, and creamy sauce.',
  },
  {
    id: 'parfait',
    name: 'Parfait',
    category: 'Parfait',
    price: 2500,
    description: 'Cool parfait with creamy yogurt and crunchy toppings.',
  },
  {
    id: 'moimoi',
    name: 'Moimoi',
    category: 'Moimoi',
    price: 1200,
    description: 'Soft moimoi with a familiar local flavor.',
  },
].map((item, index) => ({
  ...item,
  currency: 'NGN',
  image: imageCycle[index % imageCycle.length],
}));
