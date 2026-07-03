import requests
import json

BASE_URL = "http://localhost:5000/api"

def add_menu_item():
    print("\n--- ADD MENU ITEM ---")
    name = input("Item Name: ")
    price = float(input("Price: "))
    category = input("Category (appetizer/main/dessert/beverage): ")
    stock = int(input("Stock: "))
    
    data = {
        "name": name,
        "price": price,
        "category": category,
        "stock": stock
    }
    
    response = requests.post(f"{BASE_URL}/menu", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def view_menu():
    print("\n--- VIEW MENU ---")
    response = requests.get(f"{BASE_URL}/menu")
    print(f"Status: {response.status_code}")
    items = response.json()
    if items:
        for item in items:
            print(f"  {item['name']} - ${item['price']} (Stock: {item['stock']})")
    else:
        print("  No items in menu")
    print()

def add_table():
    print("\n--- ADD TABLE ---")
    table_number = int(input("Table Number: "))
    capacity = int(input("Capacity: "))
    
    data = {
        "tableNumber": table_number,
        "capacity": capacity
    }
    
    response = requests.post(f"{BASE_URL}/tables", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def view_tables():
    print("\n--- VIEW TABLES ---")
    response = requests.get(f"{BASE_URL}/tables")
    print(f"Status: {response.status_code}")
    tables = response.json()
    if tables:
        for table in tables:
            status = "Available" if table['isAvailable'] else "Occupied"
            print(f"  Table {table['tableNumber']} - Capacity: {table['capacity']} - {status}")
    else:
        print("  No tables added")
    print()

def place_order():
    print("\n--- PLACE ORDER ---")
    
    # Show available tables
    response = requests.get(f"{BASE_URL}/tables")
    tables = response.json()
    print("Available Tables:")
    for table in tables:
        if table['isAvailable']:
            print(f"  ID: {table['_id']} - Table {table['tableNumber']} (Capacity: {table['capacity']})")
    
    table_id = input("Enter Table ID: ")
    
    # Show menu items
    response = requests.get(f"{BASE_URL}/menu")
    items = response.json()
    print("Menu Items:")
    for item in items:
        print(f"  ID: {item['_id']} - {item['name']} (${item['price']}) - Stock: {item['stock']}")
    
    order_items = []
    while True:
        menu_id = input("Enter Menu Item ID (or 'done' to finish): ")
        if menu_id == 'done':
            break
        quantity = int(input("Quantity: "))
        order_items.append({"menuItem": menu_id, "quantity": quantity})
    
    data = {
        "tableId": table_id,
        "items": order_items
    }
    
    response = requests.post(f"{BASE_URL}/orders", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def view_orders():
    print("\n--- VIEW ORDERS ---")
    response = requests.get(f"{BASE_URL}/orders")
    print(f"Status: {response.status_code}")
    orders = response.json()
    if orders:
        for order in orders:
            print(f"  Order ID: {order['_id']}")
            print(f"  Status: {order['status']}")
            print(f"  Total: ${order['totalAmount']}")
            print(f"  Items: {len(order['items'])} items")
            print()
    else:
        print("  No orders placed")
    print()

def update_order_status():
    print("\n--- UPDATE ORDER STATUS ---")
    
    # Show orders
    response = requests.get(f"{BASE_URL}/orders")
    orders = response.json()
    print("Orders:")
    for order in orders:
        print(f"  ID: {order['_id']} - Status: {order['status']} - Total: ${order['totalAmount']}")
    
    order_id = input("Enter Order ID: ")
    status = input("Status (pending/preparing/ready/served/paid): ")
    
    data = {"status": status}
    response = requests.patch(f"{BASE_URL}/orders/{order_id}/status", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def main():
    while True:
        print("\n" + "="*40)
        print("RESTAURANT API TESTER")
        print("="*40)
        print("1. Add Menu Item")
        print("2. View Menu")
        print("3. Add Table")
        print("4. View Tables")
        print("5. Place Order")
        print("6. View Orders")
        print("7. Update Order Status")
        print("8. Exit")
        print("="*40)
        
        choice = input("Choose option: ")
        
        if choice == '1':
            add_menu_item()
        elif choice == '2':
            view_menu()
        elif choice == '3':
            add_table()
        elif choice == '4':
            view_tables()
        elif choice == '5':
            place_order()
        elif choice == '6':
            view_orders()
        elif choice == '7':
            update_order_status()
        elif choice == '8':
            print("Goodbye! 👋")
            break
        else:
            print("Invalid choice!")

if __name__ == "__main__":
    main()