// Order functionality for managing orders

// Initialize orders in localStorage if it doesn't exist
if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
}

// Load and display order history from Supabase or localStorage
async function loadOrderHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const container = document.getElementById('ordersContainer');
    
    if (!container) return;
    
    // Redirect to login if no user is logged in
    if (!currentUser || currentUser === null) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // Check if Supabase is available
        if (typeof supabase === 'undefined') {
            console.log('Supabase not available, loading from localStorage');
            // Fallback to localStorage
            loadOrdersFromLocalStorage(currentUser);
            return;
        }
        
        // Fetch orders from Supabase for current user
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_name', currentUser.username)
            .order('created_at', { ascending: false });
        
        if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            // Fallback to localStorage
            loadOrdersFromLocalStorage(currentUser);
            return;
        }
        
        // Fetch order items for all orders
        const orderIds = orders.map(order => order.id);
        if (orderIds.length === 0) {
            container.innerHTML = '<p>You have no orders yet. <a href="menu.html">Start ordering</a></p>';
            return;
        }
        
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds);
        
        if (itemsError) {
            console.error('Error fetching order items:', itemsError);
            // Fallback to localStorage
            loadOrdersFromLocalStorage(currentUser);
            return;
        }
        
        // Combine orders with their items
        const ordersWithItems = orders.map(order => {
            const items = orderItems.filter(item => item.order_id === order.id);
            return {
                id: order.id,
                user: {
                    id: currentUser.id,
                    username: order.user_name,
                    fullname: currentUser.fullname
                },
                items: items.map(item => ({
                    name: item.item_name,
                    quantity: item.quantity,
                    price: item.price
                })),
                status: order.status,
                timestamp: order.created_at,
                total: order.total_amount
            };
        });
        
        displayOrders(ordersWithItems);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        // Fallback to localStorage
        loadOrdersFromLocalStorage(currentUser);
    }
}

// Fallback function to load orders from localStorage
function loadOrdersFromLocalStorage(currentUser) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter orders for current user
    const userOrders = orders.filter(order => order.user.id === currentUser.id);
    
    if (userOrders.length === 0) {
        document.getElementById('ordersContainer').innerHTML = '<p>You have no orders yet. <a href="menu.html">Start ordering</a></p>';
        return;
    }
    
    displayOrders(userOrders);
}

// Display orders in the UI
function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<p>You have no orders yet. <a href="menu.html">Start ordering</a></p>';
        return;
    }
    
    // Sort orders by timestamp (newest first)
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-date">${new Date(order.timestamp).toLocaleString()}</div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: $${order.total.toFixed(2)}</div>
        </div>
    `).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadOrderHistory();
});