USE drink_app;

INSERT INTO User (username, password, email)
VALUES ("test_user_1", "tester_1", "testytest1@gmail.com"),
("test_user_2", "tester_2", "testytest2@gmail.com"),
("test_user_3", "tester_3", "testytest3@gmail.com");


INSERT INTO Ingredient (ingredient_name)
VALUES
("Vodka"),
("Gin"),
("Bitters"),
("Whiskey"),
("Garnish"),
("Tonic"),
("Ice");

INSERT INTO Recipe (recipe_name, instructions, user_id, image_file_name)
VALUES 
("Gin and Tonic", 
"Take 1 part Gin and 2 parts tonic.  Mix in a highball glass with ice.  Drink and Repeat.", 
1, 
"https://www.thespruceeats.com/thmb/9g5q0ChNcHs5IjThGwciEsa5d0Y=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/gin-tonic-5a8f334b8e1b6e0036a9631d.jpg"),
("Vodka Shot", 
"Just drink it. This isn't rocket science.", 
2, 
"https://img4.thelist.com/img/gallery/when-you-drink-vodka-every-night-this-is-what-happens-to-your-body/you-may-lose-weight-if-you-drink-vodka-every-night-1580240935.jpg");

INSERT INTO RecipeIngredient (recipe_id, ingredient_id, amount)
VALUES
(1, 2, "1 part"),
(1, 6, "2 parts"),
(2, 1, "1 shot");

INSERT INTO UserRecipeRating(user_id, recipe_id, rating)
VALUES
(1, 1, 2.0),
(1, 2, 4.0),
(2, 1, 4.0),
(2, 2, 3.0),
(3, 1, 4.0),
(3, 2, 4.0);
