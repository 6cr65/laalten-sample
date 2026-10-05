/* Menu as listed on magicpin's delivery page, October 2026 (list prices).
   Each dish: [name, price or null when not confirmed, non-veg?, most loved?, note] */
window.MENU = [
  { id: 'starters', hi: 'शुरुआत', en: 'Starters', items: [
    ['Crispy Chilli Potato', 199, 0, 1], ['Chilli Paneer', 249, 0, 1], ['Drums of Heaven', 279, 1, 1], ['Chilli Chicken', 279, 1, 1],
    ['Manchurian Dry', 229], ['Veg Spring Roll', 209], ['Paneer Popcorn', 349], ['Corn Chaat', 249], ['Aloo Chatpata Chaat', 249],
    ['Veg Creme Cheese Nachos', 269], ['Peri Peri Fries', 239], ['Cheese Garlic Bread', 189], ['Egg Bhurji Roll', 269, 1]] },
  { id: 'tandoor', hi: 'तंदूर', en: 'Tandoor & Grills', items: [
    ['Dahi Ke Sholey', 229, 0, 1], ['Chicken Seekh Kabab', null, 1, 1], ['Pineapple Tandoori', null, 0, 1], ['Achari Paneer Tikka', 259],
    ['Malai Paneer Tikka', 349], ['Hariyali Paneer Tikka', 349], ['Tandoori Malai Chaap', 229], ['Tandoori Spicy Mushroom', 239],
    ['Chicken Tikka', 299, 1], ['Murg Malai Tikka', 299, 1], ['Hyderabadi Murg Tikka', 299, 1],
    ['Tandoori Veg Platter', 499, 0, 0, 'Dahi ke sholey, paneer tikka, tandoori chaap, hara bhara kebab']] },
  { id: 'chinese', hi: 'चाइनीज़', en: 'Chinese', items: [
    ['Singapore Noodles', null, 0, 1], ['Chilli Garlic Noodles', 209], ['Veg Hakka Noodles', 209], ['Veg Fried Rice', 209],
    ['Chilli Garlic Rice Chicken', 259, 1], ['Fried Rice Chicken', 259, 1], ['Veg Steamed Momos', 269, 0, 0, '5 pieces'],
    ['Veg Chilli Momos', 269, 0, 0, '5 pieces'], ['Veg Manchow Soup', 199],
    ['Chinese Veg Platter', 499, 0, 0, 'Chilli paneer, dry manchurian, honey chilli potato, spring roll']] },
  { id: 'mains', hi: 'मेन कोर्स', en: 'Mains', items: [
    ['Butter Chicken', null, 1, 1], ['Paneer Lababdar', 296, 0, 1], ['Dal Makhani', 599, 0, 1], ['Mutton Rogan Josh', null, 1, 1],
    ['Kadai Paneer', 269], ['Kesari Malai Kofta', 329], ['Kashmiri Dum Aloo', 299], ['Dal Tadka', 259], ['Tawa Chaap', 249],
    ['Chicken Biryani', 279, 1], ['Veg Biryani', 225], ['Butter Naan', 75], ['Lachha Paratha', 59]] },
  { id: 'sizzlers', hi: 'सिज़लर', en: 'Sizzlers', items: [
    ['Sizzlers', null, 0, 1, 'A favourite in reviews. The full list and prices would come from the restaurant.']] },
  { id: 'pizza', hi: 'पिज़्ज़ा-पास्ता', en: 'Pizza & Pasta', items: [
    ['Mix Veg Pizza', 259, 0, 1, '12 inch'], ['Chilli Paneer Pizza', 259, 0, 0, '12 inch'], ['Margherita Pizza', 229, 0, 0, '12 inch'],
    ['Veg Lovers Pizza', 309, 0, 0, '12 inch'], ['Chicken Tikka Pizza', 299, 1, 0, '12 inch'], ['Chicken Lovers Pizza', 459, 1, 0, '12 inch'],
    ['Veg Alfredo Sauce Pasta', 259], ['Veg Pink Sauce Pasta', 249], ['Alfredo Sauce Pasta, Non-veg', 379, 1]] },
  { id: 'bar', hi: 'बार', en: 'From the bar', items: [
    ['Pink Chilli Mojito', null, 0, 1], ['Cranberry Mojito', null], ['Malta Berry', null], ['Masala Coke', null], ['Ice Tea', null], ['Oreo Shake', null]] }
];
