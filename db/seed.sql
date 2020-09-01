USE drink_app;

INSERT INTO User (user_id, username, password, email)
VALUES (1, "test_user_1", "tester_1", "testytest1@gmail.com"),
(2, "test_user_2", "tester_2", "testytest2@gmail.com"),
(3, "test_user_3", "tester_3", "testytest3@gmail.com");


INSERT INTO Ingredient (ingredient_id, ingredient_name)
VALUES (1, "Vodka"),
(2, "Gin"),
(3, "Bitters"),
(4, "Whiskey"),
(5, "Garnish"),
(6, "Tonic"),
(7, "Ice");

INSERT INTO Recipe (recipe_name, instructions, user_id, image_file_name,  rating)
VALUES ("Gin and Tonic", 
"Take 1 part Gin and 2 parts tonic.  Mix in a highball glass with ice.  Drink and Repeat.", 
1, 
"https://www.thespruceeats.com/thmb/9g5q0ChNcHs5IjThGwciEsa5d0Y=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/gin-tonic-5a8f334b8e1b6e0036a9631d.jpg", 
4.3),
("Vodka Shot", 
"Just drink it. This isn't rocket science.", 
2, 
"https://img4.thelist.com/img/gallery/when-you-drink-vodka-every-night-this-is-what-happens-to-your-body/you-may-lose-weight-if-you-drink-vodka-every-night-1580240935.jpg", 
2.2);


