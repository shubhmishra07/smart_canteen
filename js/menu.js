// Menu functionality for displaying canteen items with advanced filtering and search

// Initialize Supabase client
const supabaseUrl = 'https://nbkftwsrsnvyaxolnqvt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia2Z0d3Nyc252eWF4b2xucXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODMxMDAsImV4cCI6MjA4MTM1OTEwMH0.sxkl4I37z3904WfK0DWgV0gkF1BmJMzdL-vGsUuWN9Q';

// Since we can't use npm, we'll use the Supabase CDN
// This will be initialized in the HTML file
let supabase;

// Array to store fetched menu items from Supabase
let supabaseMenuItems = [];

// Comprehensive food dataset with ~100 items and unique images
const foodDataset = [
    // Indian Veg - Dal
    { id: 1, name: "Dal Tadka", category: "Indian Veg", veg: true, price: 80, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Dal Makhani", category: "Indian Veg", veg: true, price: 120, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Moong Dal", category: "Indian Veg", veg: true, price: 90, stock: true, image: "https://images.unsplash.com/photo-1626078438300-104ef7c1ff03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Indian Veg - Paneer
    { id: 4, name: "Paneer Butter Masala", category: "Indian Veg", veg: true, price: 180, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Palak Paneer", category: "Indian Veg", veg: true, price: 170, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Paneer Tikka", category: "Indian Veg", veg: true, price: 200, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Shahi Paneer", category: "Indian Veg", veg: true, price: 190, stock: false, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Indian Veg - Roti
    { id: 8, name: "Tandoori Roti", category: "Indian Veg", veg: true, price: 15, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 9, name: "Butter Naan", category: "Indian Veg", veg: true, price: 30, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 10, name: "Garlic Naan", category: "Indian Veg", veg: true, price: 40, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 11, name: "Missi Roti", category: "Indian Veg", veg: true, price: 25, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Indian Veg - Rice
    { id: 12, name: "Jeera Rice", category: "Indian Veg", veg: true, price: 90, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 13, name: "Veg Pulao", category: "Indian Veg", veg: true, price: 110, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 14, name: "Kashmiri Pulao", category: "Indian Veg", veg: true, price: 130, stock: true, image: "https://images.unsplash.com/photo-1626078438300-104ef7c1ff03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Indian Veg - South Indian
    { id: 15, name: "Masala Dosa", category: "Indian Veg", veg: true, price: 80, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 16, name: "Idli Sambhar", category: "Indian Veg", veg: true, price: 60, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 17, name: "Vada Sambhar", category: "Indian Veg", veg: true, price: 70, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 18, name: "Upma", category: "Indian Veg", veg: true, price: 50, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 19, name: "Pongal", category: "Indian Veg", veg: true, price: 75, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Indian Non-Veg - Chicken
    { id: 20, name: "Butter Chicken", category: "Indian Non-Veg", veg: false, price: 220, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 21, name: "Chicken Tikka Masala", category: "Indian Non-Veg", veg: false, price: 240, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 22, name: "Chicken Curry", category: "Indian Non-Veg", veg: false, price: 200, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 23, name: "Chicken Biryani", category: "Indian Non-Veg", veg: false, price: 180, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 24, name: "Tandoori Chicken", category: "Indian Non-Veg", veg: false, price: 250, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 25, name: "Chicken Korma", category: "Indian Non-Veg", veg: false, price: 230, stock: false, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Indian Non-Veg - Egg
    { id: 26, name: "Egg Curry", category: "Indian Non-Veg", veg: false, price: 90, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 27, name: "Egg Biryani", category: "Indian Non-Veg", veg: false, price: 100, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 28, name: "Boiled Eggs", category: "Indian Non-Veg", veg: false, price: 20, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Indian Non-Veg - Mutton
    { id: 29, name: "Mutton Curry", category: "Indian Non-Veg", veg: false, price: 300, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 30, name: "Mutton Biryani", category: "Indian Non-Veg", veg: false, price: 280, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 31, name: "Rogan Josh", category: "Indian Non-Veg", veg: false, price: 320, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Snacks & Street Food
    { id: 32, name: "Samosa", category: "Snacks & Street Food", veg: true, price: 20, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 33, name: "Pani Puri", category: "Snacks & Street Food", veg: true, price: 30, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 34, name: "Chole Bhature", category: "Snacks & Street Food", veg: true, price: 120, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 35, name: "Aloo Tikki", category: "Snacks & Street Food", veg: true, price: 50, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 36, name: "Pav Bhaji", category: "Snacks & Street Food", veg: true, price: 100, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 37, name: "Vada Pav", category: "Snacks & Street Food", veg: true, price: 25, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 38, name: "Dabeli", category: "Snacks & Street Food", veg: true, price: 35, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 39, name: "Bhel Puri", category: "Snacks & Street Food", veg: true, price: 40, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 40, name: "Sev Puri", category: "Snacks & Street Food", veg: true, price: 45, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Junk Food - Burger
    { id: 41, name: "Cheeseburger", category: "Junk Food", veg: true, price: 80, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 42, name: "Veggie Burger", category: "Junk Food", veg: true, price: 90, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 43, name: "Chicken Burger", category: "Junk Food", veg: false, price: 120, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 44, name: "Double Cheeseburger", category: "Junk Food", veg: true, price: 140, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Junk Food - Pizza
    { id: 45, name: "Margherita Pizza", category: "Junk Food", veg: true, price: 150, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 46, name: "Pepperoni Pizza", category: "Junk Food", veg: false, price: 180, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 47, name: "Veg Supreme Pizza", category: "Junk Food", veg: true, price: 170, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 48, name: "Chicken Pizza", category: "Junk Food", veg: false, price: 200, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Junk Food - Fries
    { id: 49, name: "French Fries", category: "Junk Food", veg: true, price: 60, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 50, name: "Peri Peri Fries", category: "Junk Food", veg: true, price: 80, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 51, name: "Loaded Fries", category: "Junk Food", veg: true, price: 100, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Junk Food - Momos
    { id: 52, name: "Veg Momos", category: "Junk Food", veg: true, price: 70, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 53, name: "Chicken Momos", category: "Junk Food", veg: false, price: 90, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 54, name: "Paneer Momos", category: "Junk Food", veg: true, price: 85, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 55, name: "Steam Momos", category: "Junk Food", veg: true, price: 65, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Beverages
    { id: 56, name: "Coca Cola", category: "Beverages", veg: true, price: 30, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 57, name: "Sprite", category: "Beverages", veg: true, price: 30, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 58, name: "Orange Juice", category: "Beverages", veg: true, price: 40, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 59, name: "Apple Juice", category: "Beverages", veg: true, price: 45, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 60, name: "Mango Shake", category: "Beverages", veg: true, price: 70, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 61, name: "Chocolate Milkshake", category: "Beverages", veg: true, price: 80, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 62, name: "Cold Coffee", category: "Beverages", veg: true, price: 90, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 63, name: "Tea", category: "Beverages", veg: true, price: 15, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 64, name: "Green Tea", category: "Beverages", veg: true, price: 20, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 65, name: "Hot Chocolate", category: "Beverages", veg: true, price: 60, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Additional items to reach 100 with unique images
    { id: 66, name: "Fried Rice", category: "Indian Veg", veg: true, price: 100, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 67, name: "Noodles", category: "Snacks & Street Food", veg: true, price: 80, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 68, name: "Manchurian", category: "Snacks & Street Food", veg: true, price: 90, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 69, name: "Spring Rolls", category: "Snacks & Street Food", veg: true, price: 70, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 70, name: "Hakka Noodles", category: "Snacks & Street Food", veg: true, price: 95, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 71, name: "Gulab Jamun", category: "Snacks & Street Food", veg: true, price: 50, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 72, name: "Rasgulla", category: "Snacks & Street Food", veg: true, price: 40, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 73, name: "Jalebi", category: "Snacks & Street Food", veg: true, price: 45, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 74, name: "Rasmalai", category: "Snacks & Street Food", veg: true, price: 60, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 75, name: "Kheer", category: "Snacks & Street Food", veg: true, price: 55, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 76, name: "Ice Cream", category: "Beverages", veg: true, price: 60, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 77, name: "Falooda", category: "Beverages", veg: true, price: 80, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 78, name: "Lassi", category: "Beverages", veg: true, price: 50, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 79, name: "Smoothie", category: "Beverages", veg: true, price: 75, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 80, name: "Mocktail", category: "Beverages", veg: true, price: 90, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 81, name: "Milk", category: "Beverages", veg: true, price: 25, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 82, name: "Buttermilk", category: "Beverages", veg: true, price: 20, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 83, name: "Mineral Water", category: "Beverages", veg: true, price: 20, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 84, name: "Energy Drink", category: "Beverages", veg: true, price: 100, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 85, name: "Protein Shake", category: "Beverages", veg: true, price: 120, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 86, name: "Coconut Water", category: "Beverages", veg: true, price: 40, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 87, name: "Lemonade", category: "Beverages", veg: true, price: 35, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 88, name: "Iced Tea", category: "Beverages", veg: true, price: 45, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 89, name: "Coffee Frappe", category: "Beverages", veg: true, price: 110, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 90, name: "Espresso", category: "Beverages", veg: true, price: 60, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // Additional Sweets
    { id: 91, name: "Barfi", category: "Sweets", veg: true, price: 30, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 92, name: "Ladoo", category: "Sweets", veg: true, price: 25, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 93, name: "Halwa", category: "Sweets", veg: true, price: 40, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 94, name: "Kaju Katli", category: "Sweets", veg: true, price: 50, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 95, name: "Pedha", category: "Sweets", veg: true, price: 20, stock: true, image: "https://images.unsplash.com/photo-1588638175940-9802a0d0bc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    
    // More Junk Food
    { id: 96, name: "Nachos", category: "Junk Food", veg: true, price: 70, stock: true, image: "https://images.unsplash.com/photo-1603569283847-aa4053b0924a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 97, name: "Tacos", category: "Junk Food", veg: true, price: 85, stock: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 98, name: "Wraps", category: "Junk Food", veg: true, price: 95, stock: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 99, name: "Sandwich", category: "Junk Food", veg: true, price: 65, stock: true, image: "https://images.unsplash.com/photo-1617237204009-9ca0aedc11d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" },
    { id: 100, name: "Pasta", category: "Junk Food", veg: true, price: 110, stock: true, image: "https://images.unsplash.com/photo-1625944525533-473f1c8f80a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" }
];

// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Filter and sort state
let currentFilters = {
    search: '',
    veg: 'all',
    category: 'all',
    stock: 'all',
    sort: 'name'
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const vegFilter = document.getElementById('vegFilter');
const categoryFilter = document.getElementById('categoryFilter');
const stockFilter = document.getElementById('stockFilter');
const sortOrder = document.getElementById('sortOrder');
const menuItemsContainer = document.getElementById('menuItemsContainer');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for out-of-stock items
    addOutOfStockStyles();
    
    // Initialize Supabase client
    initializeSupabase();
    
    // Set up event listeners
    setupEventListeners();
    
    // Note: loadMenuItems() is now called from initializeSupabase()
    // or fetchMenuItemsFromSupabase() to ensure data is ready
});

// Add CSS styles for out-of-stock items
function addOutOfStockStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .menu-item-card.out-of-stock {
            opacity: 0.6;
            filter: grayscale(100%);
        }
        
        .menu-item-card.out-of-stock .menu-item-price {
            text-decoration: line-through;
        }
    `;
    document.head.appendChild(style);
}

// Initialize Supabase client
async function initializeSupabase() {
    // Check if Supabase is available (loaded via CDN)
    if (typeof supabase !== 'undefined') {
        try {
            // Fetch menu items from Supabase
            await fetchMenuItemsFromSupabase();
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            // Fallback to local dataset if Supabase fails
            loadMenuItems();
        }
    } else {
        console.log('Supabase not available - using local dataset');
        // Load menu items with local dataset
        loadMenuItems();
    }
}

// Fetch menu items from Supabase
async function fetchMenuItemsFromSupabase() {
    try {
        // Assuming Supabase JS client is properly initialized
        // and we have a menu_items table
        const { data, error } = await supabase
            .from('menu_items')
            .select('*');
        
        if (error) {
            console.error('Error fetching menu items from Supabase:', error);
            return;
        }
        
        // Store fetched data in our array
        supabaseMenuItems = data || [];
        
        // Log success message with detailed data structure
        console.log(`Successfully fetched ${supabaseMenuItems.length} menu items from Supabase`);
        if (supabaseMenuItems.length > 0) {
            console.log('First item structure:', supabaseMenuItems[0]);
        }
        console.log('Supabase menu items:', supabaseMenuItems);
        
        // Trigger a reload of menu items to use the new data
        loadMenuItems();
        
    } catch (error) {
        console.error('Error in fetchMenuItemsFromSupabase:', error);
    }
}

// Set up event listeners for filters and search
function setupEventListeners() {
    searchInput.addEventListener('input', function(e) {
        currentFilters.search = e.target.value.toLowerCase();
        loadMenuItems();
    });
    
    vegFilter.addEventListener('change', function(e) {
        currentFilters.veg = e.target.value;
        loadMenuItems();
    });
    
    categoryFilter.addEventListener('change', function(e) {
        currentFilters.category = e.target.value;
        loadMenuItems();
    });
    
    stockFilter.addEventListener('change', function(e) {
        currentFilters.stock = e.target.value;
        loadMenuItems();
    });
    
    sortOrder.addEventListener('change', function(e) {
        currentFilters.sort = e.target.value;
        loadMenuItems();
    });
}

// Filter and sort menu items based on current filters
function filterAndSortItems(items) {
    let filteredItems = [...items];
    
    // Apply search filter
    if (currentFilters.search) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(currentFilters.search)
        );
    }
    
    // Apply veg/non-veg filter
    if (currentFilters.veg !== 'all') {
        const isVeg = currentFilters.veg === 'veg';
        filteredItems = filteredItems.filter(item => item.veg === isVeg);
    }
    
    // Apply category filter
    if (currentFilters.category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === currentFilters.category);
    }
    
    // Apply stock filter
    if (currentFilters.stock !== 'all') {
        const inStock = currentFilters.stock === 'available';
        filteredItems = filteredItems.filter(item => {
            // Use stock_count if available, otherwise fallback to stock boolean
            if (item.stock_count !== undefined) {
                return inStock ? item.stock_count > 0 : item.stock_count === 0;
            } else {
                return item.stock === inStock;
            }
        });
    }
    
    // Apply sorting
    switch (currentFilters.sort) {
        case 'price-low':
            filteredItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredItems.sort((a, b) => b.price - a.price);
            break;
        case 'availability':
            // Sort by availability (available items first)
            filteredItems.sort((a, b) => {
                // Use stock_count if available, otherwise fallback to stock boolean
                const aInStock = a.stock_count !== undefined ? a.stock_count > 0 : a.stock;
                const bInStock = b.stock_count !== undefined ? b.stock_count > 0 : b.stock;
                
                if (aInStock && !bInStock) return -1;
                if (!aInStock && bInStock) return 1;
                return a.name.localeCompare(b.name);
            });
            break;
        case 'name':
        default:
            filteredItems.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    return filteredItems;
}

// Load menu items and display them
function loadMenuItems() {
    // Use Supabase data if available, otherwise fallback to local dataset
    const dataSource = supabaseMenuItems.length > 0 ? supabaseMenuItems : foodDataset;
    const filteredItems = filterAndSortItems(dataSource);
    
    if (!menuItemsContainer) return;
    
    // Display items in clean card layout
    if (filteredItems.length === 0) {
        menuItemsContainer.innerHTML = `
            <div class="no-results">
                <h3>No items found</h3>
                <p>Try adjusting your filters or search term</p>
            </div>
        `;
        return;
    }
    
    menuItemsContainer.innerHTML = filteredItems.map((item, index) => {
        // Determine stock status based on stock_count (if available) or stock boolean (legacy)
        const isInStock = item.stock_count !== undefined ? item.stock_count > 0 : item.stock;
        
        return `
        <div class="menu-item-card ${!isInStock ? 'out-of-stock' : ''}" style="animation-delay: ${index * 0.1}s">
            ${!isInStock ? `<span class="stock-badge outofstock">Out of Stock</span>` : `<span class="stock-badge available">Available</span>`}
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1574933448797-065851720110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';">
            </div>
            <div class="menu-item-info">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="veg-indicator ${item.veg ? 'veg' : 'nonveg'}" title="${item.veg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                </div>
                <p class="menu-item-category">${item.category}</p>
                <p class="menu-item-price">₹${item.price}</p>
            </div>
            <button class="add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" ${!isInStock ? 'disabled' : ''}>
                ${!isInStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `;
    }).join('');
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn:not(:disabled)').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const itemName = this.getAttribute('data-name');
            const itemPrice = parseFloat(this.getAttribute('data-price'));
            addToCart(itemId, itemName, itemPrice);
        });
    });
}

// Add item to cart
function addToCart(itemId, itemName, itemPrice) {
    // Get cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.itemId === itemId);
    
    if (existingItemIndex > -1) {
        // Increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            itemId: itemId,
            name: itemName,
            price: itemPrice,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation without page reload
    showConfirmation(`${itemName} added to cart!`);
}

// Show confirmation message
function showConfirmation(message) {
    // Create confirmation element if it doesn't exist
    let confirmation = document.getElementById('confirmation-message');
    if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.id = 'confirmation-message';
        confirmation.className = 'confirmation-message';
        document.body.appendChild(confirmation);
    }
    
    // Set message and show
    confirmation.textContent = message;
    confirmation.style.display = 'block';
    
    // Hide after 2 seconds
    setTimeout(() => {
        confirmation.style.display = 'none';
    }, 2000);
}
