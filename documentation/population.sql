-- The population must follow an order, due to its level of declaration 
-- (key and constraints)

Plans: 
INSERT INTO plans (planValue, DESCRIPTION, durationDays) VALUES (20, "Basic test", 30)

Users: 
INSERT INTO users (planId, email, passwordHash, ACTIVE, phone, userPermission, acceptedTerms) 
VALUES (1, "ff@gmail.com", "assas", TRUE, "48984116469", 1, TRUE)

Categories:
INSERT INTO categories (userId, DESCRIPTION, createdAt, updatedAt) VALUES (1, 'Bolo', NOW(), NOW())

Products: 
INSERT INTO products (userId, categoryId, NAME, DESCRIPTION, VALUE, productionCost, createdAt, updatedAt)
VALUES (1, 2, 'Bolo de cenoura', 'Delicioso Bolo de cenoura', 30, 10, NOW(), NOW())

Orders: 
INSERT INTO orders (userId, clientId, orderNumber, deliveryDate, VALUE, deliveryCost, delivered, orderStatus, createdAt, updatedAt)
VALUE (1, 3, 1, NOW(), 20, 4, NOW(), 3, NOW(), NOW())

OrderItems:
insert INTO orderitems (orderId, productId, quantity, finished, createdAt, updatedAt) 
VALUES (4, 2, 1, FALSE, NOW(), NOW());