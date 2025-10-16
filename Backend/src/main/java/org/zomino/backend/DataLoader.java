package org.zomino.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.zomino.backend.model.Cart;
import org.zomino.backend.model.MenuItem;
import org.zomino.backend.model.Restaurant;
import org.zomino.backend.model.User;
import org.zomino.backend.repository.CartRepository;
import org.zomino.backend.repository.MenuItemRepository;
import org.zomino.backend.repository.RestaurantRepository;
import org.zomino.backend.repository.UserRepository;

import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataLoader(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository,
                      UserRepository userRepository, CartRepository cartRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Idempotent seeding: only skip if users already exist.
        // (Don't check restaurants here because Flyway may have pre-seeded restaurants.)
        if (userRepository.count() > 0) {
            System.out.println("DataLoader: users already exist, skipping user seed.");
            return;
        }

        // Create sample users
        User user1 = new User("John Doe", "john@example.com", passwordEncoder.encode("password123"), "USER");
        user1.setPhone("1234567890");
        user1.setAddress("123 Main St, City");
        userRepository.save(user1);
        cartRepository.save(new Cart(user1));

        User user2 = new User("Jane Smith", "jane@example.com", passwordEncoder.encode("password123"), "USER");
        user2.setPhone("9876543210");
        user2.setAddress("456 Oak Ave, Town");
        userRepository.save(user2);
        cartRepository.save(new Cart(user2));

        User admin = new User("Admin User", "admin@zomino.com", passwordEncoder.encode("admin123"), "ADMIN");
        admin.setPhone("5555555555");
        userRepository.save(admin);
        cartRepository.save(new Cart(admin));

        System.out.println("Seeded sample users (john@example.com / password123, jane@example.com / password123, admin@zomino@zomino.com / admin123)");

        // Seed sample restaurants and menu items (only if none exist - migrations may have already created them)
        if (restaurantRepository.count() == 0) {
            Restaurant r1 = new Restaurant("Pizzeria Zomino", "12 Market St");
            r1.addMenuItem(new MenuItem("Margherita Pizza", "VEG", new BigDecimal("7.50")));
            r1.addMenuItem(new MenuItem("Pepperoni Pizza", "NON-VEG", new BigDecimal("8.90")));
            r1.addMenuItem(new MenuItem("Four Cheese Pizza", "VEG", new BigDecimal("9.50")));

            Restaurant r2 = new Restaurant("Sushi Hub", "45 Ocean Ave");
            r2.addMenuItem(new MenuItem("Salmon Nigiri", "NON-VEG", new BigDecimal("5.00")));
            r2.addMenuItem(new MenuItem("Avocado Roll", "VEG", new BigDecimal("4.00")));
            r2.addMenuItem(new MenuItem("Dragon Roll", "NON-VEG", new BigDecimal("6.75")));

            Restaurant r3 = new Restaurant("Spice Villa", "88 Curry Rd");
            r3.addMenuItem(new MenuItem("Butter Chicken", "NON-VEG", new BigDecimal("6.50")));
            r3.addMenuItem(new MenuItem("Paneer Tikka", "VEG", new BigDecimal("5.00")));
            r3.addMenuItem(new MenuItem("Dal Makhani", "VEG", new BigDecimal("4.50")));

            Restaurant r4 = new Restaurant("Burger Barn", "7 King St");
            r4.addMenuItem(new MenuItem("Classic Beef Burger", "NON-VEG", new BigDecimal("6.00")));
            r4.addMenuItem(new MenuItem("Veggie Burger", "VEG", new BigDecimal("5.50")));
            r4.addMenuItem(new MenuItem("Fries (Large)", "VEG", new BigDecimal("2.50")));

            Restaurant r5 = new Restaurant("Green Salads", "102 Meadow Ln");
            r5.addMenuItem(new MenuItem("Caesar Salad", "VEG", new BigDecimal("4.25")));
            r5.addMenuItem(new MenuItem("Grilled Chicken Salad", "NON-VEG", new BigDecimal("5.75")));

            Restaurant r6 = new Restaurant("Taco Town", "9 Fiesta Ave");
            r6.addMenuItem(new MenuItem("Al Pastor Taco", "NON-VEG", new BigDecimal("2.75")));
            r6.addMenuItem(new MenuItem("Carnitas Taco", "NON-VEG", new BigDecimal("2.50")));
            r6.addMenuItem(new MenuItem("Veggie Taco", "VEG", new BigDecimal("2.00")));

            Restaurant r7 = new Restaurant("Curry Express", "210 Spice Blvd");
            r7.addMenuItem(new MenuItem("Lamb Rogan Josh", "NON-VEG", new BigDecimal("7.00")));
            r7.addMenuItem(new MenuItem("Chana Masala", "VEG", new BigDecimal("4.00")));

            Restaurant r8 = new Restaurant("Noodle Nest", "33 Bamboo St");
            r8.addMenuItem(new MenuItem("Chicken Hakka Noodles", "NON-VEG", new BigDecimal("5.50")));
            r8.addMenuItem(new MenuItem("Veg Stir Fry Noodles", "VEG", new BigDecimal("4.50")));
            r8.addMenuItem(new MenuItem("Spring Rolls", "VEG", new BigDecimal("3.25")));

            Restaurant r9 = new Restaurant("Pizza Palace", "200 Baker St");
            r9.addMenuItem(new MenuItem("BBQ Chicken Pizza", "NON-VEG", new BigDecimal("9.00")));
            r9.addMenuItem(new MenuItem("Truffle Mushroom Pizza", "VEG", new BigDecimal("10.50")));

            Restaurant r10 = new Restaurant("Bistro Bella", "56 Garden Rd");
            r10.addMenuItem(new MenuItem("Grilled Salmon", "NON-VEG", new BigDecimal("11.00")));
            r10.addMenuItem(new MenuItem("Ratatouille", "VEG", new BigDecimal("7.50")));

            Restaurant r11 = new Restaurant("Dosa Point", "14 South St");
            r11.addMenuItem(new MenuItem("Masala Dosa", "VEG", new BigDecimal("3.25")));
            r11.addMenuItem(new MenuItem("Set Dosa", "VEG", new BigDecimal("3.75")));

            Restaurant r12 = new Restaurant("BBQ Central", "88 Grill Ave");
            r12.addMenuItem(new MenuItem("Smoked Ribs", "NON-VEG", new BigDecimal("12.00")));
            r12.addMenuItem(new MenuItem("Grilled Corn", "VEG", new BigDecimal("2.75")));

            // Save all restaurants
            restaurantRepository.save(r1);
            restaurantRepository.save(r2);
            restaurantRepository.save(r3);
            restaurantRepository.save(r4);
            restaurantRepository.save(r5);
            restaurantRepository.save(r6);
            restaurantRepository.save(r7);
            restaurantRepository.save(r8);
            restaurantRepository.save(r9);
            restaurantRepository.save(r10);
            restaurantRepository.save(r11);
            restaurantRepository.save(r12);

            System.out.println("Seeded expanded restaurants and menu items.");
        } else {
            System.out.println("DataLoader: restaurants already exist, skipping restaurant seed.");
        }
    }
}
