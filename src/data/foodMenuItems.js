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
    description: 'A cheesy, satisfying pizza made for sharing, parties, and comfort-food cravings.',
  },
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    category: 'Jollof Rice',
    price: 3000,
    description: 'Smoky Nigerian jollof rice with rich pepper flavor and a satisfying home-style finish.',
  },
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    category: 'Fried Rice',
    price: 3200,
    description: 'Colorful fried rice with vegetables, seasoning, and a clean fast-food comfort taste.',
  },
  {
    id: 'pasta',
    name: 'Pasta',
    category: 'Pasta',
    price: 3500,
    description: 'Amazing Taste pasta with a bold sauce, soft bite, and filling everyday portion.',
  },
  {
    id: 'shawarma',
    name: 'Shawarma',
    category: 'Shawarma',
    price: 2800,
    description: 'Loaded shawarma wrap with creamy sauce, fresh filling, and a quick satisfying bite.',
  },
  {
    id: 'barbecue',
    name: 'Barbecue',
    category: 'Barbecue',
    price: 4500,
    description: 'Grilled barbecue with smoky seasoning, saucy finish, and a satisfying protein bite.',
  },
  {
    id: 'pepper-soup',
    name: 'Pepper Soup',
    category: 'Pepper Soup',
    price: 3500,
    description: 'Warm pepper soup with local spice, bold aroma, and a comforting broth.',
  },
  {
    id: 'chicken-and-chips',
    name: 'Chicken and Chips',
    category: 'Chicken and Chips',
    price: 5000,
    description: 'Crisp chips served with seasoned chicken for a familiar quick-service favorite.',
  },
  {
    id: 'fish-pepper-soup',
    name: 'Fish Pepper Soup',
    category: 'Fish Pepper Soup',
    price: 5000,
    description: 'Fresh fish pepper soup with rich local spice and a deep warming flavor.',
  },
  {
    id: 'small-chops',
    name: 'Small Chops',
    category: 'Small Chops',
    price: 2500,
    description: 'Party-ready small chops with a tasty mix of bites for events and cravings.',
  },
  {
    id: 'burger',
    name: 'Burger',
    category: 'Burger',
    price: 3200,
    description: 'Soft bun, savory filling, and creamy sauce packed into a filling burger.',
  },
  {
    id: 'parfait',
    name: 'Parfait',
    category: 'Parfait',
    price: 2500,
    description: 'Cool parfait layered with creamy yogurt, fruit notes, and crunchy toppings.',
  },
  {
    id: 'moimoi',
    name: 'Moimoi',
    category: 'Moimoi',
    price: 1200,
    description: 'Soft moimoi with a local flavor profile, perfect as a side or light meal.',
  },
].map((item, index) => ({
  ...item,
  currency: 'NGN',
  image: imageCycle[index % imageCycle.length],
}));
