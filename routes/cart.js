const mongoose = require("mongoose");
var fetchuser = require("../middleware/fetchUser");
const Product = require("../models/Product");
const Cart = require("../models/AddCart"); // Assuming you have a Cart model defined
const express = require("express");
const router = express.Router();

// Route for adding an item to the cart
// cart.js

router.post('/addtocart', fetchuser, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required.' });
        }

        // Retrieve the user's cart from the database
        const userId = req.userId; // This should be set based on your authentication method
        let userCart = await Cart.findOne({ userId });

        // If the user doesn't have a cart yet, create one
        if (!userCart) {
            userCart = new Cart({ userId, items: [] });
        }

        // Generate a new ObjectId for the item
        const newItemId = new mongoose.Types.ObjectId();

        // Check if the item is already in the cart
        const itemIndex = userCart.items.findIndex((item) => {
            // Ensure both itemId and newItemId are defined before calling toString()
            return item.itemId && newItemId && item.itemId.toString() === newItemId.toString();
        });

        if (itemIndex !== -1) {
            // Update the quantity if the item is already in the cart
            userCart.items[itemIndex].quantity += quantity;
        } else {
            // Add the new item to the cart with the generated itemId
            userCart.items.push({ itemId: newItemId, productId, quantity });
        }

        // Ensure all items have an itemId before saving
        userCart.items = userCart.items.map(item => ({
            ...item,
            itemId: item.itemId || newItemId // Fallback to newItemId if itemId is not present
        }));

        // Save the updated cart
        await userCart.save();

        res.status(200).json({ message: 'Item added to cart.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the item to the cart.' });
    }
});

// Endpoint for fetching a user's cart details
router.get("/getcart/:userId", async (req, res) => {
  try {
    // Find the user's cart and populate the items with product details
    const userCart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.itemId"
    );
   
    if (!userCart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the given user ID." });
    }
    res.json(userCart);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the cart." });
  }
});

// Route for deleting an item from the cart
router.delete('/deletefromcart/:userId/:itemId', fetchuser, async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        if (!userId || !itemId) {
            return res.status(400).json({ message: 'User ID and Item ID are required.' });
        }

        // Retrieve the user's cart from the database
        const userCart = await Cart.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found for the given user ID.' });
        }

        // Remove the item from the cart
        userCart.items = userCart.items.filter(item => item.itemId.toString() !== itemId);

        // Save the updated cart
        await userCart.save();

        res.status(200).json({ message: 'Item removed from cart.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while removing the item from the cart.' });
    }
});

module.exports = router;
