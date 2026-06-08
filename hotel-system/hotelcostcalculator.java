import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class hotelcostcalculator {
    @SuppressWarnings("ConvertToTryWithResources")
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
//----------------------------------------------------------------------------------------------------//
        // Hotel structure code
        /*
         * 1 -- Welcome message 
         * 2 -- Display cost for customers (maximum rooms to rent out = 30)
         *         ROOM TYPE        COST
         *         standard         400
         *         standard vip     600
         *         high vip         1000
         * 3 -- Discounts
         *      Standard rooms: > 5 (12% off), > 10 (50% off)
         *      Standard VIP: > 2 (10% off), > 5 (30% off), > 10 (50% off)
         *      High VIP: > 2 (10% off), > 10 (40% off)
         *      Returning customers get an additional 3% off
         * 4 -- Calculations 
         * 5 -- Display results
        */
//----------------------------------POST CODE---------------------------------------------------------//
// CREATE ARRAY OF PAST USERS

        ArrayList<String> users = new ArrayList<>(Arrays.asList("AKHANANI GCEYA", "LIONEL MESSI"));

        System.out.println("Welcome to Akha Gceya's Hotel! Please enter your name: ");
        String userName = scanner.nextLine();
        System.out.println();

        // Check if the user is a returning customer
        if (users.contains(userName.toUpperCase())) {
            System.out.println("Welcome back, " + userName + "! As a valued returning guest, you get an exclusive 3% discount on your total bill.");
        } else {
            System.out.println("Hello, " + userName + "! We’re excited to have you at Akha Gceya's Hotel and look forward to providing you with excellent service.");
            users.add(userName);
        }

        System.out.println();
//-------------------------------MENU DISPLAY ---------------------------------------------------------//
        System.out.println("--------------------- MENU ----------------------------");
        System.out.println("           ROOM TYPE           COST PER ROOM");
        System.out.println("           Standard            R400");
        System.out.println("           Standard VIP        R600");
        System.out.println("           High VIP            R1000");
        System.out.println("-------------------------------------------------------");
        System.out.println("-------------------- DISCOUNTS ------------------------");
        System.out.println("Standard: > 5 rooms (12% off), > 10 rooms (50% off)");
        System.out.println("Standard VIP: > 2 rooms (10% off), > 5 rooms (30% off), > 10 rooms (50% off)");
        System.out.println("High VIP: > 2 rooms (10% off), > 10 rooms (40% off)");
        System.out.println("Returning customers: Extra 3% off the discounted total");
        System.out.println();
//-------------------------------USER INPUT-------------------------------------------------//
        System.out.println("What type of room would you like to rent? Enter [Standard, Standard VIP, High VIP]: ");
        String roomType = scanner.nextLine().toLowerCase().replaceAll("\\s", "").trim();
        System.out.println("How many " + roomType + " rooms would you like to rent? (Enter a number from 1 to 30): ");
        int roomQty = scanner.nextInt();
        System.out.println();
        System.out.println("You have selected " + roomQty + " " + roomType + " room(s). Please wait while we calculate your total cost...");
//-------------------------------CALCULATIONS---------------------------------------------//
        double disCost = 0;
        switch (roomType) {
            case "standard" -> {
                if (roomQty > 10) {
                    int cost = roomQty * 400;
                    disCost = cost - cost * 0.5;
                    System.out.println("Original Cost: R" + cost + " | Discounted Cost: R" + disCost);
                } else if (roomQty > 5) {
                    int cost = roomQty * 400;
                    disCost = cost - cost * 0.12;
                    System.out.println("Original Cost: R" + cost + " | Discounted Cost: R" + disCost);
                } else {
                    int cost = roomQty * 400;
                    disCost = cost;
                    System.out.println("Total Cost: R" + disCost);
                }
            }
            case "standardvip" -> {
                if (roomQty > 10) {
                    int cost = roomQty * 600;
                    disCost = cost - cost * 0.5;
                    System.out.println("Original Cost: R" + cost + " | Discounted Cost: R" + disCost);
                } else if (roomQty > 5) {
                    int cost = roomQty * 600;
                    disCost = cost - cost * 0.3;
                    System.out.println("Original Cost: R" + cost + " | Discounted Cost: R" + disCost);
                } else if (roomQty > 2) {
                    int cost = roomQty * 600;
                    disCost = cost - cost * 0.1;
                    System.out.println("Original Cost: R" + cost + " | Discounted Cost: R" + disCost);
                } else {
                    int cost = roomQty * 600;
                    disCost = cost;
                    System.out.println("Total Cost: R" + disCost);
                }
            }
            case "highvip" -> {
                if (roomQty > 10) {
                    int cost = roomQty * 1000;
                    disCost = cost - cost * 0.4;
                    System.out.println("Original Cost: R" + cost + " | Discounted Cost: R" + disCost);
                } else if (roomQty > 2) {
                    int cost = roomQty * 1000;
                    disCost = cost - cost * 0.1;
                    System.out.println("Original Cost: R" + cost + " | Discounted Cost: R" + disCost);
                } else {
                    int cost = roomQty * 1000;
                    disCost = cost;
                    System.out.println("Total Cost: R" + disCost);
                }
            }
            default -> {System.out.println("Invalid Choice!! Try Again");}
        }

        if (users.contains(userName.toUpperCase())) {
            System.out.println("As a returning customer, you get an extra 3% off your discounted cost!");
            double finalCost = disCost - (disCost * 0.03);
            System.out.println("Final Cost after all discounts: R" + finalCost);
        } else {
            System.out.println("Thank you, " + userName + "! We hope to see you again so you can enjoy our 3% returning customer discount.");
        }

        scanner.close();
    }
}
