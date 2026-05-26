import { siteConfig } from '../constants/siteConfig';
import { menuItems } from './menuItems';
import { testimonials } from './testimonials';

export const visualAssets = {
  heroRestaurant: '/figma-assets/d3d9844069c4d06c1703ce6b2fc4d9dc3c7f4af8.png',
  mainDish: '/figma-assets/36a565ceb4374187c1aeb28ab74f90c3e0bbdc15.png',
  dishOne: '/figma-assets/31dd7e967a694044e65dbcf36d09f616c7dd3720.png',
  dishThree: '/figma-assets/7fba5a9d8622f58c148ca95de2786b1faa7926a4.png',
  dishFive: '/figma-assets/dadd00c732079e63689d1d32e29f969127b1bc3d.png',
  dishFour: '/figma-assets/e81ac223a639cd1a246f58720c07f6bc8bcb8734.png',
  chef: '/figma-assets/840cbc661e8dde4e053b2dfb6c5ed11f56c6cffb.png',
  customerPortrait: '/figma-assets/a154812a0a57a0a6fdd158f0f37cd4a842010f3c.png',
  ctaBackground: '/figma-assets/30b64b68ee0f677954218cf77e267b7b78c02625.png',
  logo: '/figma-assets/2b3d866c25f27fdbc86e44b3d0adcbb0846d9ee0.svg',
  heroLeafLeft: '/figma-assets/c8614993e3ae896e17e0c80184010dbeef304cf8.svg',
  heroLeafRight: '/figma-assets/c5f0dcafb01808acbf78c2a2b6a5699e575d9c0e.svg',
  heroLeafLower: '/figma-assets/bc02be021eadd861311ffabc48198c2223033e1f.svg',
  specialLeafLeft: '/figma-assets/44c874d9ec6320581ffb6d210ed779d2c45284b1.svg',
  specialLeafRight: '/figma-assets/9977aba934b415226570dab4fd2f02f3513cf1ae.svg',
  specialLeafLower: '/figma-assets/eded88e490b4b3918724505ba9dced3ef825cad8.svg',
  welcomeLeafRight: '/figma-assets/66915ce0ecba6f4a6e776f8edf293bc0c5627ec6.svg',
  chefLeaf: '/figma-assets/ccdc06cabfb097200b557cf196a4ab182f5fb6b0.svg',
  customerPan: '/figma-assets/dadac15ac86646b82a5b7956087cda51097a479d.svg',
};

export const preservedCopy = {
  hero: {
    headline: 'Where Every Bite Is a Taste of Heaven',
    body:
      'Amazing Taste Delicacies, also known as The Pasta Haven, brings pasta favorites, local fast-food comfort, and quick service to Osogbo.',
  },
  welcome: {
    headline: 'Welcome to Amazing Taste Delicacies',
    body:
      'A local Osogbo fast-food kitchen serving pasta-forward meals, quick bites, and satisfying delicacies with a homegrown touch.',
  },
  chef: {
    headline: 'Amazing Taste, Everyday Comfort',
    body:
      'A local Osogbo food brand serving tasty meals, quick service, and dependable everyday options made to satisfy.',
    highlights: ['Fresh everyday meals', 'Quick service', 'Trusted Osogbo brand'],
    note: 'Locally operated, delivery available, and open to partnerships.',
  },
  reviews: {
    headline: 'Loved in Osogbo',
    body:
      'Known for delicious pasta dishes, quick service, and comfort food with local flavor.',
  },
  newsletter: {
    headline: 'Follow @amazing_taste_delicacies for fresh menu drops.',
    emailPlaceholder: 'Enter your email',
    buttonLabel: 'Join Updates',
  },
  reservation: {
    headline: 'Order or Book from Instagram',
    body: 'Reach Amazing Taste Delicacies on Instagram for fresh updates, orders, and availability.',
    successHeadline: 'Request Sent',
    successBody: 'Thank you for reaching out to Amazing Taste Delicacies.',
    seatingOptions: ['Pickup', 'Delivery', 'Event order', 'Partnership inquiry'],
    timeOptions: [
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '5:00 PM',
      '6:00 PM',
      '7:00 PM',
      '8:00 PM',
      '9:00 PM',
    ],
    guestOptions: [1, 2, 3, 4, 5, 6, 8, '10+'],
  },
  footer: {
    copyright: 'Amazing Taste Delicacies. All Rights Reserved.',
    links: ['Instagram', 'Menu', 'Contact'],
  },
};

export const projectDetails = {
  ...siteConfig,
  menuItems,
  testimonials,
  visualAssets,
  preservedCopy,
};
